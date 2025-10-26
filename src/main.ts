// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  // Apply global guards
  const reflector = app.get('Reflector' as any);
  app.useGlobalGuards(new RolesGuard(reflector));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();