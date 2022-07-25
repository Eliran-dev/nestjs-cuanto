import { Document } from "mongoose";


interface RoutesInterface extends Document {
    IVlink: string,
    cat: string,
    category: string,
    brand: string,
    inCharge: string,
    date: Date



}

export default RoutesInterface;