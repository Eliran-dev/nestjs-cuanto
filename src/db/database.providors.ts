import * as mongoose from 'mongoose';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () =>
        await mongoose.connect('mongodb+srv://Elirany:Eliran111@cluster0.ycsa3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
    },
];