import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CostomersModule } from '../costomers/costomers.module'; // ajuste o caminho se necessário
import { SellersModule } from '../sellers/sellers.module';

@Global()
@Module({
  imports: [
    CostomersModule,
    SellersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }, // Token vale por 7 dias
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
