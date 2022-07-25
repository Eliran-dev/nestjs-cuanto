import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../db/database.module';
import { AuthController } from './auth.controller';
import UserModel from './auth.schema';
import { AuthService } from './auth.service';
import { authProviders } from './auth.providers';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    DatabaseModule, 
    JwtModule.register({
      secret: 'SECRET123',
      signOptions: {expiresIn: '10h'}
    }),
    PassportModule
    ],
  controllers: [AuthController],
  providers: [AuthService, ...authProviders, JwtStrategy]
})
export class AuthModule {}
