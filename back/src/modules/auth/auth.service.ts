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
    let user: any = await this.costomersService.findByEmail(email);

    // 2. Se NÃO achou como cliente, busca na tabela de vendedores
    if (!user) {
      user = await this.sellersService.findByEmail(email);
    }

    // 3. Validação defensiva: só chama o bcrypt se user E user.password existirem
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result; // Retorna o usuário completo do banco (sem a senha)
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      // Retorna exatamente tudo o que veio do validateUser sem perder propriedades
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.avatarUrl && { avatarUrl: user.avatarUrl }),
        ...(user.imageUrl && { imageUrl: user.imageUrl }),
        ...(user.businessHours && { businessHours: user.businessHours }),
        ...(user.address && { address: user.address }),
        ...(user.phone && { phone: user.phone }),
      },
    };
  }
}
