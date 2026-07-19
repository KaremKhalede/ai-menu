export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "MenuAI",
  nodeEnv: process.env.NODE_ENV,
} as const;