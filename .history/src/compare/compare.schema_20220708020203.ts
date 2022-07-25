import * as mongoose from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'
import { buffer } from 'stream/consumers';
import PriceCompare from './compare.interface'
//{[{name: String, qnt: Number, required: false},{date: Date, default: Date.now}]}
const compareSchema = new mongoose.Schema<PriceCompare>({
    title: { type: String, required: true, unique: true, sparse: true},
    category: { type: String, required: true },
    cat: { type: String, required: false },
    brand: { type: String, required: false },
    inCharge: { type: String, required: false },
    IvoryUid: { type: Number, required: false, default: 0 },
    KspUid: { type: Number, required: false, unique: true, sparse: true },
    kspSql: { type: String, required: false, unique: true, sparse: true },
    priceIvory: { type: Number, required: false },
    priceKsp: { type: Number, required: false, default: 0 },
    kspStock: [{ name: String, qnt: Number, required: false }],
    isKspEOL: {type: Boolean, required: false, default: false},
    kspStockArray: [
        {
        stock: [
            
                { name: String, qnt: Number, required: false }
        ],
        time: Date
        //stock: [[{name: String, qnt: Number, required: false}]]
        }
    ],
branches: { type: Number, required: false, default: 0 },
isNightDiscount: { type: Boolean, required: false },
approvalStatus: { type: String, required: false, default: 'Pending' },
lastApproval: { type: String, required: false, default: 'None' },
lastChanged: { type: String, required: false, default: 'notYet' }, 


date: { type: Date, default: Date.now }


}, {
    collection: "Products",
        versionKey: false,
            _id: true,
                timestamps: true

})
compareSchema.plugin(uniqueValidator, { message: 'mongoose-unique-validator' })
compareSchema.index({title: 'string'})

export default compareSchema;