import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Ativa a validação automática em todas as rotas da API baseada nos DTOs
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora campos extras não mapeados no DTO
      forbidNonWhitelisted: true, // Lança erro 400 se enviarem campos não permitidos
      transform: true, // Converte automaticamente os tipos definidos no DTO
    }),
  );

  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://promo-day.vercel.app'] // Substitua pela URL da Vercel quando tiver
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // 🚀 Inicia o servidor HTTP na porta 3001 (ou na porta definida nas variáveis de ambiente)
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Servidor rodando em: http://localhost:${port}`);
}
bootstrap();
