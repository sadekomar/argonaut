import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/db";
import { oneTap } from "better-auth/plugins";
import { Resend } from "resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:4000",
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendResetPasswordEmail(user, token, url);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail(user, token, url);
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
  },
  plugins: [
    oneTap({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "NO_CLIENT_ID",
      disableSignup: true,
    }),
  ],
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID ?? "NO_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      disableSignUp: true,
    },
  },
});

async function sendEmail(
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  },
  token: string,
  url: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = `<p>Click the link to verify your email: ${url}</p>`;
  console.log("sending email to", { ...user, url, token });
  // TODO: configure DNS
  const domain = "Argonaut <confirm@argonaut.com.eg>";
  return await resend.emails.send({
    from: domain,
    to: user.email,
    subject: "Verify your email address",
    html,
  });
}

async function sendResetPasswordEmail(
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  },
  token: string,
  url: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = `<p>Click the link to reset your password: ${url}</p>`;
  console.log("sending email to", { ...user, url, token });
  // TODO: configure DNS
  const domain = "Argonaut <confirm@argonaut.com.eg>";
  return await resend.emails.send({
    from: domain,
    to: user.email,
    subject: "Reset your password",
    html,
  });
}
