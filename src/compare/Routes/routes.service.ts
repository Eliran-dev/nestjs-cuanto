import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import RoutesInterface from './routes.interface';
@Injectable()

export class RoutesService {
    constructor(
        @InjectModel('Routes') private readonly Routes: Model<RoutesInterface>
    ) { }

    async getAllRoutes()
    {
        return this.Routes.find().exec();
    }

    async setRoute(route: RoutesInterface)
    {
        const newRoute = new this.Routes(route);
        newRoute.save();
    }
}
