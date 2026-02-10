import { ConsoleLogger, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        if (user && await bcrypt.compare(password, user.password)) {
          if(user.status=="disabled"){
            throw new HttpException(`Usuario Deshabilitado`, HttpStatus.CONFLICT);
          }
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
    
    async login(user: any) {
        const payload = { username: user.username, id: user.id,  role_name: user.rol };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }
}
