import { Connection } from 'mongoose';
import UserSchema from './auth.schema';
export const authProviders = [
    {
        provide: 'UserModel',
        useFactory: (connection: Connection) => connection.model('User', UserSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];