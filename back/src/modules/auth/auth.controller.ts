import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    // Valida as credenciais enviadas no corpo da requisição
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // Se válido, gera e retorna o JWT
    return this.authService.login(user);
  }
}
