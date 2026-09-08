import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

const ensureSignupBonus = async (userId: string) => {
  await prisma.$transaction(async (transaction) => {
    const creditAccount = await transaction.creditAccount.findUnique({
      where: { userId },
    });

    if (creditAccount) {
      return;
    }

    await transaction.creditAccount.create({
      data: {
        userId,
        balance: 5,
      },
    });

    await transaction.creditTransaction.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        amount: 5,
        type: "BONUS",
        description: "signup bonus",
      },
    });
  });
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    "http://localhost:5173",
  ],

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await ensureSignupBonus(user.id);
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          await ensureSignupBonus(session.userId);
        },
      },
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});