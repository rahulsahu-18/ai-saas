import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth"

interface IfunctionArgs {
  buffer: Buffer;
  fileType: string;
  userId: string;
  documentId: string;
  fileName: string;
}

export function getContentType(extension: string): string {
  switch (extension) {
    case ".pdf":
      return "application/pdf";

    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    case ".txt":
      return "text/plain";

    default:
      return "application/octet-stream";
  }
}


export async function processDocument({
  buffer,
  fileType,
  userId,
  documentId,
  fileName,
}: IfunctionArgs) {
  let text = "";

  if (fileType === "application/pdf") {
    const uint8Array = new Uint8Array(buffer);

    const pdf = await getDocument({
      data: uint8Array,
    }).promise;

    let extractedText = "";

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item: any) => {
          return "str" in item ? item.str : "";
        })
        .join(" ");

      extractedText += pageText + "\n";
    }

    text = extractedText;
  }

  else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer,
    });

    text = result.value;
  }

  else if (fileType === "text/plain") {
    text = buffer.toString("utf-8");
  }

  else {
    throw new Error("Unsupported document type");
  }

  if (!text.trim()) {
    throw new Error("Document contains no readable text");
  }

  return text;
}