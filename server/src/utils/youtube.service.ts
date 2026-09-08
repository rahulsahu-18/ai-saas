import { YoutubeTranscript } from "youtube-transcript-plus";

export async function getYoutubeTranscript(url: string): Promise<{text:string,title:string}> {
  const response = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  );

  if (!response.ok) {
    throw new Error("Unable to get YouTube video title");
  }

  const data = await response.json();

  const transcript = await YoutubeTranscript.fetchTranscript(url);
  const text = transcript.map((chunk) => chunk.text).join(" ");
  return { text, title: data.title };
}

export function extractYoutubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);

    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    const pathname = parsedUrl.pathname;

    // youtube.com/watch?v=VIDEO_ID
    if (hostname === "youtube.com" && pathname === "/watch") {
      return parsedUrl.searchParams.get("v");
    }

    // youtu.be/VIDEO_ID
    if (hostname === "youtu.be") {
      const videoId = pathname.split("/")[1];
      return videoId || null;
    }

    // youtube.com/shorts/VIDEO_ID
    if (hostname === "youtube.com" && pathname.startsWith("/shorts/")) {
      const videoId = pathname.split("/")[2];
      return videoId || null;
    }

    return null;
  } catch {
    return null;
  }
}
