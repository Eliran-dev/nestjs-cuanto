import { Document, ObjectId } from "mongoose";

interface stockInterface {
    name: string,
    qnt: number
}
interface StockArray {
    time: Date,
    stock: Array<stockInterface>
}

interface PriceCompare extends Document {
    _id: ObjectId,

    title: string,
    category: string,
    cat: string,
    brand: string,
    inCharge: string,
    IvoryUid: number,
    KspUid: number,
    kspSql: string,
    priceIvory: number,
    priceKsp: number,
    kspStock: Array<stockInterface>,
    isKspEOL: Boolean,
    kspStockArray: Array<StockArray>,
    branches: number,
    isNightDiscount: boolean,
    approvalStatus: string,
    lastApproval: string,
    lastChanged: string,
    date: Date,
    updatedAt: Date


}

export default PriceCompare;