import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
    baseURL: getBaseUrl(),
    plugins: [
        usernameClient()
    ]
})

