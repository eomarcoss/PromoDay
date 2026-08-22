import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CostomersModule } from './modules/costomers/costomers.module';
import { AuthModule } from './modules/auth/auth.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    CostomersModule,
    AuthModule,
    SellersModule,
    PromotionsModule,
    ClaimsModule,
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
