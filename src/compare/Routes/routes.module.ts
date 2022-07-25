import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { routesProviders } from './routes.providers';
@Module({
    imports: [DatabaseModule],
    controllers: [RoutesController],
    providers: [RoutesService, ...routesProviders],
    exports: [RoutesService]
})
export class RoutesModule {}
