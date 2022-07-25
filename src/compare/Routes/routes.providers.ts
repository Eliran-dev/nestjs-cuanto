import { Connection } from 'mongoose';
import routesSchema from './routes.schema';

export const routesProviders = [
    {
        provide: 'RoutesModel',
        useFactory: (connection: Connection) => connection.model('Routes', routesSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];