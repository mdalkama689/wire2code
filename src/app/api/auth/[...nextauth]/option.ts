import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import argon2 from "argon2";

const authOption: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Plaese provide both email and password!");
        }
        const { email, password } = credentials;
        const user = await prisma.user.findFirst({
          where: { email },
        });

        if (!user) {
          throw new Error("User ot found!");
        }

        const isValidPassword = await argon2.verify(user.password, password);

        if (!isValidPassword) {
          throw new Error("Invalid credentials!");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  session: {
    maxAge: 7 * 24 * 60 * 60,
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOption;
