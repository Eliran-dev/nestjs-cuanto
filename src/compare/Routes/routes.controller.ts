import { Body, Controller, Get, Post } from '@nestjs/common';
import RoutesInterface from './routes.interface';
import { RoutesService } from './routes.service';
@Controller('routes')
export class RoutesController {
    constructor(private readonly routes: RoutesService) {}
    @Get()
    async getRoutes()
    {
        return this.routes.getAllRoutes();
    }
    @Post()
    async setRoute(@Body() s: RoutesInterface)
    {
        console.log(s);
        this.routes.setRoute(s);
    }
}
