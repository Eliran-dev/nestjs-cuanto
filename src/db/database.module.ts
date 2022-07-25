import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providors';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}