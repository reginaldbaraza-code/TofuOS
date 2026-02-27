import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    // Get the token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated - No token provided' }, { status: 401 });
    }

    // Create a server client that uses the provided token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth Error:', authError);
      return NextResponse.json({ message: 'Not authenticated - Invalid token' }, { status: 401 });
    }

    const params = await req.json();
    
    // Fetch the user's Jira configuration from Supabase
    const { data: config, error: configError } = await supabase
      .from('jira_configs')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (configError || !config) {
      return NextResponse.json({ message: 'Jira not configured' }, { status: 400 });
    }

    const { domain, email, api_token } = config;
    const projectKey = params.projectKey;
    
    if (!projectKey) {
      return NextResponse.json({ message: 'Project key is required' }, { status: 400 });
    }

    const issueType = params.issueType || 'Task';

    const { result: jiraResult } = await (async () => {
      const response = await fetch(`https://${domain}/rest/api/3/issue`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${email}:${api_token}`).toString('base64')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            project: {
              key: projectKey
            },
            summary: params.summary,
            description: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: params.description || params.summary
                    }
                  ]
                }
              ]
            },
            issuetype: {
              name: issueType
            }
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw { status: response.status, data: errorData };
      }

      return { result: await response.json() };
    })();

    // Update the last_project_key in the background
    await supabase
      .from('jira_configs')
      .update({ last_project_key: projectKey })
      .eq('user_id', user.id);

    return NextResponse.json({
      key: jiraResult.key,
      id: jiraResult.id,
      url: `https://${domain}/browse/${jiraResult.key}`
    });
  } catch (error: any) {
    if (error.status) {
      console.error('Jira API Error:', error.data);
      return NextResponse.json({ 
        message: error.data.errors ? Object.values(error.data.errors).join(', ') : 'Failed to create Jira issue' 
      }, { status: error.status });
    }
    console.error('Server Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
