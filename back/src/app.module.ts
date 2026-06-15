import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CostomersModule } from './modules/costomers/costomers.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CostomersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
