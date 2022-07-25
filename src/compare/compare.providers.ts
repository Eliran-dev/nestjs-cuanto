import { Connection } from 'mongoose';
import compareSchema from './compare.schema';
export const compareProviders = [
    {
        provide: 'CompareModel',
        useFactory: (connection: Connection) => connection.model('Compare', compareSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];