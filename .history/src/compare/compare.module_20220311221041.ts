import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CompareController } from './compare.controller';
import { CompareService } from './compare.service';
import { compareProviders } from './compare.providers';
import { DatabaseModule } from '../db/database.module';
import { RoutesModule } from './Routes/routes.module';
import { MailingService } from './Mailing.service';
import { excelGenrator } from './excelGenerator.service';
import { Sms } from './Sms.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [DatabaseModule, RoutesModule,ConfigModule.forRoot()],
        controllers: [CompareController],
    providers: [CompareService, ...compareProviders, MailingService, excelGenrator, Sms]
})
export class CompareModule {}
