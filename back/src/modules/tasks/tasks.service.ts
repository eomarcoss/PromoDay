import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredPromotions() {
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      const expiredPromotions = await tx.promotion.findMany({
        where: { endTime: { lt: now } },
        select: { id: true },
      });

      if (expiredPromotions.length === 0) return;

      const expiredIds = expiredPromotions.map((p) => p.id);

      const deletedClaims = await tx.claim.deleteMany({
        where: { promotionId: { in: expiredIds } },
      });

      const deletedPromotions = await tx.promotion.deleteMany({
        where: { id: { in: expiredIds } },
      });

      this.logger.log(
        `[Limpeza]: ${deletedClaims.count} cupons e ${deletedPromotions.count} promoções expiradas foram removidos.`,
      );
    });
  }
}
