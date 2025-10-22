import { oneTapClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  plugins: [
    oneTapClient({
      clientId:
        "507392803535-ihpo7dkule730ear2bs1q1auoloqmkp4.apps.googleusercontent.com",
      autoSelect: false,
      cancelOnTapOutside: true,
      context: "signin",
      promptOptions: {
        baseDelay: 1000,
        maxAttempts: 2,
      },
    }),
  ],
});
