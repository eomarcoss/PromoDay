import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Ativa a validação automática em todas as rotas da API baseada nos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora qualquer campo extra intencional enviado pelo front que não esteja no DTO
      forbidNonWhitelisted: true, // Joga um erro se tentarem enviar campos não permitidos
      transform: true, // Converte automaticamente os tipos dos dados para o que definimos no DTO
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
