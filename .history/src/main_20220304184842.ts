import { NestFactory } from '@nestjs/core';

import {  FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import fastifyCookie from 'fastify-cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
    );
    app.register(fastifyCookie)
    app.setGlobalPrefix('/api');
    

    await app.listen(3001, "0.0.0.0")
    console.log(`APP is running on ${await app.getUrl()}`)
    // app.use(function (req, res, next) {
    //   res.setHeader('Access-Control-Allow-Origin', '*');
    //   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //   res.setHeader('Access-Control-Allow-Credentials', true);
    //   next();});
    
}
bootstrap();
