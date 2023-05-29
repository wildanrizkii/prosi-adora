import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider.default({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        console.log("username " + credentials.username);
        console.log("password " + credentials.password);
        try {
          const res = await fetch("http://localhost:3000/api/LogIn", {
            method: "POST",
            body: JSON.stringify({
              x: credentials.username,
              y: credentials.password,
            }),
          });
          const hasil = await res.json();
          const data = hasil.data;
          if (
            data != "Maaf Username atau Password anda salah" &&
            data != "Terjadi masalah saat mengakses db"
          ) {
            const user = {
              username: data[0],
              role: data[1],
              idUser: data[2],
            };
            console.log(
              "HASIL USER" + user.idUser + " " + user.username + " " + user.role
            );
            return user;
          } else {
            throw new Error(data);
          }
        } catch (e) {
          throw e;
        }
      },
    }),
  ],

  jwt: {
    maxAge: 86400,
  },

  callbacks: {
    async session({ session, token }) {
      session.user = {
        username: token.username,
        role: token.role,
        idUser: token.idUser,
      };
      // session.username = token.username;
      // session.role = token.role;
      // session.idUser = token.idUser;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
        token.idUser = user.idUser;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth.default(authOptions);
