import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "./user.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);


@Injectable()
export class AuthService {

   constructor(private userService: UserService) {}

   async signup(email: string, password: string) {
      const user = await this.userService.find(email);
      if (user.length) {
         throw new BadRequestException('Email in use');
      }
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      const hashPassword = salt + '.' + hash.toString('hex');

      const newUser = await this.userService.create(email, hashPassword);
      return newUser;
   }
   
   async signin(email: string, password: string) {
      const user = await this.userService.find(email);
      if (!user.length) {
         throw new BadRequestException('Invalid credentials');
      }
      const [foundUser] = user;
      const [salt, storedHash] = foundUser.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      if (storedHash !== hash.toString('hex')) {
         throw new BadRequestException('Invalid credentials');
      }
      return foundUser;
   }
}