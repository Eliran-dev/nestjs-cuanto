import * as mongoose from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'
import RoutesInterface from './routes.interface';
const routesSchema = new mongoose.Schema<RoutesInterface>({
    IVlink: {type: String, required: false, unique: true, sparse: true},
    cat: {type: String, required: false, unique: true},
    category: {type: String, required: false, unique: true},
    brand: {type: String, required: false},

    inCharge: {type: String, required: false},
    date: {type: Date, default: Date.now}


}, {
    collection: "Routes",
    versionKey: false,
    _id: true
})
//compareSchema.plugin(uniqueValidator,  { message: 'mongoose-unique-validator' })


export default routesSchema;