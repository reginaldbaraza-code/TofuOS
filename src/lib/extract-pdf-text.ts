/**
 * Extract text from a PDF in the browser. Only use in client components.
 * Dynamically imports pdfjs-dist so it is never loaded on the server.
 */
export async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist");

  if (typeof window !== "undefined" && pdfjs.GlobalWorkerOptions) {
    const version = (pdfjs as { version?: string }).version || "4.8.69";
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
  }

  const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const numPages = doc.numPages;
  let text = "";

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    text += pageText + "\n";
  }

  return text.trim();
}
