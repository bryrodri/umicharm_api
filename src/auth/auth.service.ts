import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        console.log("user ", user)
        if (user && await bcrypt.compare(password, user.password) && user.rol=="admin") {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
    
    async loginAdmin(user: any) {
        const payload = { username: user.username, id: user.id,  role_name: 'admin' };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }
}
