import "next-auth";
import "next-auth/jwt";

type UserRole = "admin" | "member";

declare module "next-auth" {
  interface User {
    firstName: string;
    lastName: string;
    tesseraCode: string;
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      tesseraCode: string;
      role: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    tesseraCode: string;
    role: UserRole;
  }
}
