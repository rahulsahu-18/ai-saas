const localOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const configuredOrigins = (process.env.CLIENT_URL ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => {
    const url = new URL(origin);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(`Invalid CLIENT_URL origin: ${origin}`);
    }

    return url.origin;
  });

export const trustedOrigins = [...new Set([...localOrigins, ...configuredOrigins])];
