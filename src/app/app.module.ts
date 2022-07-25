import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompareModule } from '../compare/compare.module';
import { RoutesModule } from '../compare/Routes/routes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

    }),
    MongooseModule.forRoot('mongodb+srv://Elirany:Eliran111@cluster0.ycsa3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587, 
        secure: false,
        auth: {
          user: "elirandevop@gmail.com",
          pass: "Eliran12345$",
        },
        
      },
      defaults: {
        from:'"nest-modules" <modules@nestjs.com>',
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule, CompareModule, RoutesModule],
  controllers: [AppController],
  providers: [AppService, ScheduleModule],
})
export class AppModule {}
