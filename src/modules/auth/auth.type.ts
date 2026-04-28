import { User } from "../../../generated/prisma/client";


export type TAuthID = User["id"];
export type TAuthRead = Pick<User, "id" | "name">;
export type TAuthWrite = Pick<User, "name" | "email" | "password">;