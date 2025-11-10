import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ 
      where: { username },
      relations: ['roles']
    });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user.id,
      roles: user.roles.map(role => role.name)
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: { username: string; email: string; password: string }): Promise<User> {
    const { username, email, password } = userData;
    
    // Проверка на существующего пользователя
    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }]
    });
    
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Находим роль пользователя по умолчанию
    const userRole = await this.rolesRepository.findOne({ where: { name: 'user' } });
    
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      roles: userRole ? [userRole] : [],
    });

    return this.usersRepository.save(user);
  }
}