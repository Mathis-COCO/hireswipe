import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          scriptSrc: [`'self'`, `'unsafe-inline'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
        },
      },
    }),
  );
  (app.getHttpAdapter().getInstance() as express.Express).disable(
    'x-powered-by',
  );

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
}
bootstrap();
