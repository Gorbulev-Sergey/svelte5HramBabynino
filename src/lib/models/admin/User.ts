import { Role } from "./Role";

export class User {
    uid: string = '';
    email: string = '';
    role: Role = new Role();
}