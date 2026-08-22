import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CostomersService } from '../costomers/costomers.service';
import { SellersService } from '../sellers/sellers.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private costomersService: CostomersService,
    private jwtService: JwtService,
    private sellersService: SellersService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // 1. Busca como cliente
    const customer = await this.costomersService.findByEmail(email);

    if (customer) {
      if (
        customer.password &&
        (await bcrypt.compare(pass, customer.password))
      ) {
        const { password, ...result } = customer;
        return {
          ...result,
          role: (customer as any).role || 'CUSTOMER',
        };
      }
      return null;
    }

    // 2. Se não for cliente, busca como vendedor
    const seller = await this.sellersService.findByEmail(email);

    if (seller) {
      if (seller.password && (await bcrypt.compare(pass, seller.password))) {
        const { password, ...result } = seller;
        return {
          ...result,
          role: (seller as any).role || 'SELLER',
        };
      }
      return null;
    }

    return null;
  }
  async login(user: any) {
    // Payload contendo o id, e-mail e role para assinatura do JWT
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // 👈 Agora este campo é garantido
        phone: user.phone,
        avatarUrl: user.avatarUrl || null,
        totalPromotions: user.totalPromotions,
        totalSales: user.totalSales,
        ...(user.businessHours && { businessHours: user.businessHours }),
        ...(user.address && { address: user.address }),
        ...(user.category && { category: user.category }),
      },
    };
  }
}
