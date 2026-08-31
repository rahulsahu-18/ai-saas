function getContentType(extension: string): string {
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

export default getContentType;