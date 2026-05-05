import { User } from "../../generated/prisma/client";

declare global {
    namespace Express {
        interface Request {
        user?:{
        id: User["id"];
        name: User["name"];
        role: User["role"];
      };
        }
    }
}