import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _script } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email us is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException("Email in use");
    }

    // Hash the passeword
    // Generate a salt
    const salt = randomBytes(8).toString("hex");

    // Hash salt and pasword together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join hashed result and salt
    const result = salt + "." + hash.toString("hex");

    // Create a new user
    const user = await this.usersService.create(email, result);

    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException("User not found");

    const [salt, storedHash] = user.password.split(".");

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString("hex"))
      throw new BadRequestException("Bad password");

    return user;
  }
}
