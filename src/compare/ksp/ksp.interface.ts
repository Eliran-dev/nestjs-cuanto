import { Document } from "mongoose";


interface KspItem extends Document {
    addToCart: boolean,
    If: string,
    uin: number
    uinsql: number,
    price: number,
    name: string,
    img: string,

}

export default KspItem;