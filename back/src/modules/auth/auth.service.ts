import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CostomersService } from '../costomers/costomers.service';
import * as bcrypt from 'bcrypt';
import { SellersService } from '../sellers/sellers.service';

@Injectable()
export class AuthService {
  constructor(
    private costomersService: CostomersService,
    private jwtService: JwtService,
    private sellersService: SellersService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // 1. Busca o cliente no banco pelo e-mail
    let user = await this.costomersService.findByEmail(email);

    // 2. Se NÃO achou como cliente, busca na tabela de vendedores
    if (!user) {
      user = await this.sellersService.findByEmail(email); // 👈 Garanta que tem esse método no seu sellersService
    }

    // 2. Se achou, compara a senha digitada com o hash salvo no banco
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result; // Retorna o usuário sem a senha
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
