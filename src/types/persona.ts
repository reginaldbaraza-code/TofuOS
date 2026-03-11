/**
 * Persona creation source abstraction for extensibility.
 * New import methods (LinkedIn, resume, company URL) can plug in here.
 */
export type PersonaSourceType =
  | "manual"
  | "quick_prompt"
  | "template"
  | "linkedin"   // coming soon
  | "resume"     // coming soon
  | "company_url"; // coming soon

export interface ImportedPersonaDraft {
  source: PersonaSourceType;
  name: string;
  avatarEmoji: string;
  role: string;
  company?: string | null;
  companySize?: string | null;
  industry?: string | null;
  experienceYears?: number | null;
  age?: number | null;
  background?: string | null;
  toolsUsed?: string | null;
  painPoints?: string | null;
  communicationStyle?: string | null;
  personality?: string | null;
  /** Optional raw payload for audit or re-processing */
  raw?: unknown;
}

export const PERSONA_SOURCE_LABELS: Record<PersonaSourceType, string> = {
  manual: "Manual",
  quick_prompt: "Quick prompt",
  template: "Template",
  linkedin: "LinkedIn",
  resume: "Resume",
  company_url: "Company URL",
};
