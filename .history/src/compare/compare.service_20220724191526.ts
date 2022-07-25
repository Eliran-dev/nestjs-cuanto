import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { delay, last, timer } from 'rxjs';
import PriceCompare from './compare.interface';
import { Mongoose } from 'mongoose';
import { ObjectId } from 'mongoose';
import routes from './routes.json';
//import headers from './ksp/kspHeaders';
import KspItem from './ksp/ksp.interface';
import { RoutesService } from './Routes/routes.service';
import * as fs from 'fs';
import { resolve } from 'path/posix';
import * as x from 'x-ray-scraper'
import e from 'express';
import { ar } from 'date-fns/locale';
import RoutesInterface from './Routes/routes.interface';
import { time } from 'console';
import * as sharp from 'sharp';
const headers = {
    'authority': 'ksp.co.il',
    'sec-ch-ua': '" Not;A Brand";v="99", "Microsoft Edge";v="97", "Chromium";v="97"',
    'referer': 'https://ksp.co.il/web/cat/12764/',
    'lang': 'he',
    'sec-ch-ua-mobile': '?0',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.69',
    'token': 'MTY0NzAwMzEwNWJiZDI4YTI3NjE1MzQ2ZTU1ZmJkYTlmMWQxZTdlNGMxOTllMTllMGFERFpqUnFqQUpXZjlGZG90Y2oxblhXZ1NWNWxGTzN2Wg==',
    'sec-ch-ua-platform': '"Windows"',
    'accept': '*/*',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'accept-language': 'en-US,en;q=0.9',
    //'cookie': 'store=shipment; ID_computer=876893872; cfontsize=0; __utma=249577116.2103769798.1617989799.1623862108.1624105487.7; cart_form_inputs=[]; city_id=7900; street_id=620; cf_clearance=42DRHCwRyPeO_uTZ6l72PM4lrY.SCQGSPXJ0cpljktg-1633106923-0-250; _fbp=fb.2.1637682924021.607932519; _gac_UA-109261-1=1.1637687813.CjwKCAiAv_KMBhAzEiwAs-rX1Nge3piIvsZctSvK1kaKZ-fri3wWiYKjsHPQaZJBnWWhalLt4WvRuxoC1gsQAvD_BwE; _gcl_aw=GCL.1637687814.CjwKCAiAv_KMBhAzEiwAs-rX1Nge3piIvsZctSvK1kaKZ-fri3wWiYKjsHPQaZJBnWWhalLt4WvRuxoC1gsQAvD_BwE; language=he; _gcl_au=1.1.910571121.1640124123; _fbc=fb.2.1640124123203.IwAR1ymNgfHzORje7licQ1cafZhlau1BL6rb90h55PNM4ArxP_uoF883EG8jo; _gid=GA1.3.1734143184.1642781687; remoteVer=5.06; _gat=1; _gat_gtag_UA_109261_1=1; PHPSESSID=vmmd4004nil4nk1vp0f9eenlm4; _ga_04VL5ZQ1FG=GS1.1.1642882057.7.1.1642882092.0; _ga=GA1.3.2103769798.1617989799; language=he; store=shipment'
};

@Injectable()
export class CompareService {
    constructor(
        @InjectModel('Compare') private readonly PriceCompare: Model<PriceCompare>,
        private routes: RoutesService
    ) { }


    async doesExist(uid: number): Promise<PriceCompare> {
        const product = this.PriceCompare.findOne({ 'IvoryUid': uid }).exec()
        console.log(product)
        return product
    }

    async doesExistKsp(uid: number): Promise<PriceCompare> {
        const product = this.PriceCompare.findOne({ 'KspUid': uid }).exec()
        console.log(product)
        return product
    }
    async getByInCharge(buyer: string) {
        let changeBuyer = {}
        if(buyer == null)
        {
            changeBuyer = { "IvoryUid": {$ne: 0}, "KspUid": {$ne: null}}
        }
        else
        {
        
            changeBuyer = {"inCharge" : buyer, "IvoryUid": {$ne: 0}, "KspUid": {$ne: null}}
        }
            const AllBuyerPrices = this.PriceCompare.find(
            {
                changeBuyer,
                
            }
        )
        return (await AllBuyerPrices)

    }

    async getEntireCategory(GetCategoryFromKsp : RoutesInterface) {
        let page = 1;
        let counter = 0
        const cat = GetCategoryFromKsp.cat

        while (page > 0) {
            await this.wait(1500);

            await axios.get(`https://ksp.co.il/m_action/api/category/${cat}?sort=2&page=${page}`, {
                headers: headers
            })
                .then(async (res) => {
                    let updatedItems

                    //this.routes.setRoute(GetCategoryFromKsp)
                    let isDiscountBmsArr = [];
                    for(let isDiscountedItem of res.data.result.items)
                    {
                     isDiscountBmsArr.push({"uin": isDiscountedItem.uin, "price": Number(isDiscountedItem.price)})

                    }
                    const itemsUinString = isDiscountBmsArr.map(x => x.uin).join(",")
                    console.log(itemsUinString)
                    await axios.get(`https://ksp.co.il/m_action/api/bms/${itemsUinString}`, {
                        headers: headers
                    })
                    .then(async (response) => {
                        updatedItems = Object.values(response.data.result).filter((x: any) => x.discount != null)
                        console.log(updatedItems)
                        if(updatedItems)
                        {await this.wait(3000)
                            for(let updatedItem of updatedItems)
                            {
                                console.log(updatedItem.price + " " + updatedItem.discount.value)
                            }

                }
                        for(let item of updatedItems)
                        {
                            
                        }

                    })
                    //await this.wait(10000)
                    for (let item of res.data.result.items) {

                        if (item.uin == null) {
                            console.log(item)
                            //await this.wait(1000)
                        }
                        counter++;
                        if(!item.name.includes('מציאון'))
                        {


                        //await this.wait(1000)

                        console.log(item.uin)

                        this.PriceCompare.findOneAndUpdate(
                            {
                            KspUid: Number(item.uin),

                        },
                        {
                            KspUid: Number(item.uin),
                            kspSql: (item.uinsql),
                            title: item.name,
                            priceKsp: (updatedItems.findIndex(x => x.uin == item.uin)) != -1 ? Number(updatedItems[updatedItems.findIndex(x => x.uin == item.uin)].discount.value)  :Number(item.price),
                            category: GetCategoryFromKsp.category,
                            brand: item.brandName,
                            cat: cat,
                            kspPromo: {
                                onSale: updatedItems.findIndex(x => x.uin == item.uin) != -1, 
                                isVirtual: item.ispickUp != 1 && item.labels.some(x => x.type == "DirectDelivery"),
                                isExtraDiscount: item.redMsg.some(x => x.type == "ExtraDc"),
                                freeShipping: item.labels.some(x => x.type == "FreeShipping"),
                                isPayments: item.labels.some(x => x.type == "Payment")
                            }
                        },

                        {
                            upsert: true
                        }).exec()


                        // const Product = new this.PriceCompare(product);
                        // console.log(Product)
                        // Product.save().catch((e) => {
                        //     {

                        //         console.log(e)

                        //     }
                        // })
                    }
                }

                    if (!res.data.result.next) { page = 0 }
                    else {
                        page++
                    }
                })
            //    for(let ltem of res.data.result.items)
        }
        return counter;

    }

    async setEntireCategoryStock(category: string) {
        let filter;
        if (category != "all") {
            filter = {
                category: category,
                isKspEOL: false
            }

        }
        console.log(category)
        const items = await this.PriceCompare.find({ category }).exec()
        return items;

    }

    async loadCategory(category: string, brand: string) {
        const date: Date = new Date;
        //this.routes.setRoute()

        let brandFilter;
        let filter;
        if (category != "all" || brand != "all") {
            if (category != "all" && brand == "all") {
                filter = { category: category }
            }
            if (category == "all" && brand != "all") {
                filter = { brand: brand }
            }

        }


        const allItems = await this.PriceCompare.find(filter);
        console.log(allItems.length)
        let sumMain = 0
        let counter = 0
        let update
console.log(allItems.filter(x => x.kspStockArray[0] == null).length)
this.wait(3000)
        for (let item of         allItems.filter(x => x.kspStockArray[0] == null)
        ) {
            console.log(item.KspUid)

            console.log(item.KspUid)
            if (item.kspStockArray[0] == null ||item.kspStockArray[item.kspStockArray.length-1].time.getDate() != date.getDate()
            ) {
                await this.wait(600)


                counter++
                const stock = await this.getCurrentStock(item.KspUid)
                let result;
                if (stock.status == 204 || stock.result.stock == null) {
                    console.log("EOLEOLEOL")
                    result = ["EOL"]
                }
                else {

                    result = Object.values(stock.result.stock)
                }
                let pushMet =
                {
                    stock: result,
                    time: date

                }
                if (stock.status == 204 || stock.result.stock == null) {
                    update = { isKspEOL: true }
                }
                else {
                    let arr = [];
                    arr.push(pushMet)


                    update = {
                        isKspEOL: false,
                        kspStock: result,
                        $push: {"kspStockArray": pushMet},
                        //isNightDiscount: (stock.result.bms.uid.discount.name).includes("מבצעי לילה")

                    }
                }


                console.log((item.KspUid), "Counter: " + counter)
                console.log(await this.PriceCompare.findOneAndUpdate(
                    { KspUid: item.KspUid },
                    update,
                    { new: true }
                )
                )
            }
            else { console.log("Already Loaded earlier") }


        }
    }

    async getPendingApproval() {
        return this.PriceCompare.find({approvalStatus:"Pending", IvoryUid: {$ne: 0}})
    }
    async getAllUins() {
        const uins = this.PriceCompare.find().exec();
        return uins;
    }


    async getAllItemsIvory(name: string) {
        // const currentUins = this.getAllUins();
        // let uinList: string = '';
        // for (let uin of await currentUins) {
        //     uinList += uin.KspUid + ',';
        // }
        console.log('getAllItemsIvory')

        const currentRoutes = this.routes.getAllRoutes();
        for (let route of await currentRoutes) {
            console.log('route')
            if (route.category == "Cellphones") {
                x(route.IVlink,
                    {
                        products: x('a.product-anchor',
                            [
                                {
                                    IvoryUid: '@data-product-id',
                                    title: '.title_product_catalog',
                                    priceIvory: '.price',
                                }
                            ]
                        )
                    }
                )
                    .paginate('a[title="לדף הבא"]@href')
                    .limit(10)
                    .then(async (res) => {
                        console.log("res")
                        let sum = 0;
                        for (let productsArr of res) {
                            for (let product of productsArr.products) {
                                if (await this.doesExist(product.IvoryUid) == null) {
                                    console.log(product.IvoryUid, "IvoryUid")
                                    console.log((product.priceIvory.replace(',', '')))
                                    product.priceIvory = Number(product.priceIvory.replace(',', ''))
                                    product.category = route.category
                                    product.inCharge = 'Eliran';
                                    const kspProduct = await this.getKspUid(route.category, product.title, product.priceIvory);
                                    let approvalStatus = "Pending";
                                    let newProduct = {
                                        priceIvory: product.priceIvory,
                                        title : product.title,
                                        category: product.category,
                                        inCharge : product.inCharge,
                                        approvalStatus: approvalStatus
                                    }
                                    if (kspProduct) {
                                        console.log('KSPPRODUCT = ' + product.title + " " + kspProduct.title)

                                        product.KspUid = kspProduct.KspUid;
                                        product.priceKsp = kspProduct.priceKsp;
                                        if (
                                            product.priceIvory == product.priceKsp
                                        ) {
                                            console.log('in end')

                                            product.approvalStatus = "Approved by the system"

                                        }


                                        console.log("product1")

                                        this.PriceCompare.findOneAndUpdate({ IvoryUid: product.IvoryUid  }, {...product}, {upsert: true}).exec()
 


                                    }

                                    else {
                                        console.log("product2")

                                        this.PriceCompare.findOneAndUpdate({ IvoryUid: product.IvoryUid }, {...product}, {upsert: true}).exec().catch(async (e) => {
                                            console.log(e)
                                        })

                                        console.log(product)

                                        await this.wait(2000)
                                    }
                                }

                            }
                        }
                    })
            }
        }
    }


    async getKspUid(category: string, title: string, price: number) {
        let winningItem = null;
        const regex: RegExp = /[^\w\s]/;
        const reg: RegExp = new RegExp(regex, 'g')
        const newTitle = title.replaceAll(reg, '')
        const titleWordsArr = title.split(/[(\s+)*+]/);
        const upperCasedTitle: string = title.toUpperCase();
        console.log(title)
        await this.wait(1500)

        const res = await this.PriceCompare.find({ approvalStatus: "Pending",category: category, $text: { $search: title } }).exec()
        if(res)
        {
        console.log("TITLE" +upperCasedTitle, res[0].brand, res[0].title)
        await this.wait(5000)

        let resArr = res.filter((x) => !x.title.includes("מציאון") && x.brand != null) //Making sure that the item is not regfurbished 
        if(resArr.filter((x) => upperCasedTitle.includes(x.brand.toUpperCase()))) //Making sure that one of the items in the array is from the same brand 
        {
         resArr = resArr.filter((x) => upperCasedTitle.includes(x.brand.toUpperCase()))
         resArr.forEach(x => console.log(x.title))
        console.log(resArr)
        
        let counter = 0;
        let max = 0;
        if (res) {
            for (let item of resArr) {
                counter = 0;
                const itemArr = item.title.toUpperCase().split(/[(\s+)*+]/);
                for (let word of itemArr) {
                    console.log(word)

                    if (title.toUpperCase().includes(word)) {
                        counter++;
                        console.log(counter + "MAX=" + max)
                        if (title.includes("M5")) {
                            console.log("M5")
                            console.log(item.priceKsp)
                        }
                    }
                }
                console.log(item.priceKsp + " " + price + " " + counter + " " + max)
                if (counter >= max && (item.priceKsp > price * 0.8) && (item.priceKsp < price * 1.2)) {
                    max = counter;
                    winningItem = item;
                    console.log(winningItem.title)
                    await this.wait(1000)
                    if (winningItem.price == price) {
                        return winningItem
                    }
                }

            }
        }
        else {
            return null;
        }
    }
    }
        if (winningItem) {
            if ((winningItem.price > price * 1.3 || winningItem.price < price * 0.7) && category != "RamSticks") {
                winningItem = null
            }
        }
        return winningItem;
    }
    async wait(time: number) {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    async getAllKspUins(): Promise<void> {
        const itemsWithoutKspUin = await this.PriceCompare.find({ 'KspUid': 0 });
        console.log(itemsWithoutKspUin.length)
        for (let item of itemsWithoutKspUin) {
            console.log(item.title)
            const kspItem = await this.getKspUid("", item.title, item.priceIvory);
            console.log(kspItem)

            console.log('kspItem')
            if (kspItem != null) {
                console.log('sssssssssssssssss')
                this.PriceCompare.findOneAndUpdate({ IvoryUid: item.IvoryUid }, { $set: { KspUid: kspItem.uin, priceKsp: kspItem.discount.value | kspItem.price } }, { new: true }, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }

                    console.log(doc);
                });
            }
            else {
                console.log('null')
            }
            await this.wait(5000);

        }
    }

    async getAllKspPrices(list: string) {
        // const headers = {
        //     'authority': 'ksp.co.il',
        //     'sec-ch-ua': '" Not;A Brand";v="99", "Microsoft Edge";v="97", "Chromium";v="97"',
        //     'lang': 'he',
        //     'sec-ch-ua-mobile': '?0',
        //     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.69',
        //     'token': 'MTY0Mjg4MjEwODU0MDUyN2M2NjVkYzRiMzc5MGQ5MzQyNDg1MTYwYjNmYmQ0NDE1ODBaZ0JVajM1bHFLSjJDVWFmdVp1OWRPVTR1NWJuMFhoag==',
        //     'sec-ch-ua-platform': '"Windows"',
        //     'accept': '*/*',
        //     'sec-fetch-site': 'same-origin',
        //     'sec-fetch-mode': 'cors',
        //     'sec-fetch-dest': 'empty',
        //     'referer': 'https://ksp.co.il/web/world/5',
        //     'accept-language': 'en-US,en;q=0.9',
        //     'cookie': 'store=shipment; ID_computer=876893872; cfontsize=0; __utma=249577116.2103769798.1617989799.1623862108.1624105487.7; cart_form_inputs=[]; city_id=7900; street_id=620; cf_clearance=42DRHCwRyPeO_uTZ6l72PM4lrY.SCQGSPXJ0cpljktg-1633106923-0-250; _fbp=fb.2.1637682924021.607932519; _gac_UA-109261-1=1.1637687813.CjwKCAiAv_KMBhAzEiwAs-rX1Nge3piIvsZctSvK1kaKZ-fri3wWiYKjsHPQaZJBnWWhalLt4WvRuxoC1gsQAvD_BwE; _gcl_aw=GCL.1637687814.CjwKCAiAv_KMBhAzEiwAs-rX1Nge3piIvsZctSvK1kaKZ-fri3wWiYKjsHPQaZJBnWWhalLt4WvRuxoC1gsQAvD_BwE; language=he; _gcl_au=1.1.910571121.1640124123; _fbc=fb.2.1640124123203.IwAR1ymNgfHzORje7licQ1cafZhlau1BL6rb90h55PNM4ArxP_uoF883EG8jo; _gid=GA1.3.1734143184.1642781687; remoteVer=5.06; _gat=1; _gat_gtag_UA_109261_1=1; PHPSESSID=vmmd4004nil4nk1vp0f9eenlm4; _ga_04VL5ZQ1FG=GS1.1.1642882057.7.1.1642882092.0; _ga=GA1.3.2103769798.1617989799; language=he; store=shipment'
        // };

        // await axios.get(`https://ksp.co.il/m_action/api/bms/${list}`, {
        //     headers: headers
        // })
        // .then(async (res) => {

        // }

        // )


    }





    async getCurrentStock(id: number) {

        console.log(id)
        let item;
        await axios.get(`https://ksp.co.il/m_action/api/item/${id}`, {
            headers: headers
        })
            .then(async (res) => {
                /*  */
                item = res.data;

            }
            
            )         
               .catch((err)  => console.log(err));

        return item;
    }

    async searchDB(text: string) {
        console.log(text)
        const results = await this.PriceCompare.find({ $text: { $search: text } }).limit(10);
        return results;
        console.log(results)
    }

    async searchDBLive(text: string) {
        console.log(text)
        const results = await this.PriceCompare.find({ $text: { $search: text } }).limit(10);
        let arr = [];
        for (let result of results) {
            await this.wait(200)
            const newRes = await this.getCurrentStock(result.KspUid);
            console.log(newRes)
            arr.push(newRes);

        }
        return arr;
    }

    async getAmountSales(category: string) {
        const allItemsCategory = await this.PriceCompare.find({ category: category })
        let sumCounter = 0;
        let counter = 0;
        let itemMostSold;
        let itemMostSoldCounter = 0;
        let itemMostSoldTitle;
        let itemMostSoldImgLink;
        let unitsSoldSum = 0
        let stockArr = [];
        console.log(allItemsCategory.length)
        let product = {};
        await this.wait(5000)

        for (let item of allItemsCategory) {
            await this.wait(Math.random() * (2500 - 1500 + 1) + 1500)

            console.log(item.KspUid);
            counter++;
            const stock = await this.getCurrentStock(item.KspUid)
            let result;
            if (stock.status == 204 || stock.result.stock == null) {
                console.log("EOLEOLEOL")
                result = ["EOL"]
                await this.PriceCompare.findOneAndUpdate({ KspUid: item.KspUid }
                    , { isKspEOL: true })
            }
            else {
                console.log(item.kspStock[27].qnt)

                const lastKspStock = await this.PriceCompare.findOneAndUpdate({ KspUid: item.KspUid }
                    , { kspStock: result, isKspEOL: false })
                console.log(lastKspStock.kspStock[27].qnt)
                result = Object.values(stock.result.stock)
                sumCounter += result[27].qnt;
                if (result[27].qnt < lastKspStock.kspStock[27].qnt) {
                    unitsSoldSum += lastKspStock.kspStock[27].qnt - result[27].qnt;

                    if (result[27].qnt > itemMostSoldCounter) {
                        console.log("Found max" + stock.result.uin)
                        itemMostSoldCounter = result[27].qnt;
                        itemMostSold = item.KspUid;
                        itemMostSoldTitle = item.title;
                        itemMostSoldImgLink = (Object.values(stock.result.images)[0])
                        console.log(itemMostSoldImgLink)
                    }
                }
            }
        }
        console.log("NANANANANAAN" + allItemsCategory[10].kspStock[27].qnt)
        const newAllItemsCategory = await this.PriceCompare.find({ category: category })
        console.log("NANANANANAAN22222" + newAllItemsCategory[10].kspStock[27].qnt)
        return { sumCounter, itemMostSold, itemMostSoldTitle, itemMostSoldImgLink, unitsSoldSum };
    }

    async resetArr() {
        const items = await this.PriceCompare.find({});
        for (let item of items) {
            console.log(item)

            let arr = [];
            arr.push(item.kspStockArray[0]);
            await this.PriceCompare.findOneAndUpdate({ KspUid: item.KspUid }, { kspStockArray: arr })
        }
    }

    async resetIvoryUid() {
        return this.PriceCompare.updateMany({ IvoryUid: null })
    }

    async getNewest(cat: string) {
        let arr = []

        await axios.get(`https://ksp.co.il/m_action/api/category/${cat}?sort=3`, {
            headers: headers,

        })
            .then(async (res) => {
                for (let item of res.data.result.items) {
                    let product;
                    product = {
                        KspUid: Number(item.uin),
                        kspSql: (item.uinsql),
                        title: item.name,
                        priceKsp: Number(item.price),
                        category: cat,
                        brand: item.brandName,
                        cat: cat
                    }
                    arr.push(product);

                }
            })
            return arr;

    }

    async setBuyer(buyer: string, category: string, brand: string)
    {

        return this.PriceCompare.updateMany({category: category, brand: brand},{inCharge: buyer})
    }

    async removeRefurbished()
    {
        await this.PriceCompare.deleteMany({$text: {$search: "מציאון"}})
    }
    async removeAll()
    {
        await this.PriceCompare.deleteMany({})
    }

    async updateProduct(product: ObjectId, updates: any)
    {
        if(updates.KspUid)
        {
            const kspItem = await this.PriceCompare.findOne({KspUid: updates.KspUid})
            const ivoryItem = await this.PriceCompare.findById({_id: product})
            updates = {"IvoryUid":  ivoryItem!.IvoryUid, "priceIvory": ivoryItem!.priceIvory}
            //await this.PriceCompare.findByIdAndDelete(product)
            product = kspItem!._id


        }
        return this.PriceCompare.findOneAndUpdate({_id: product}, updates)
    }
    async getFilteredData(filters: any)
    {
        console.log(filters)
        return await this.PriceCompare.find(filters)
    }
    async downloadImage(urls: Array<string>, folderName: string) {
        console.log("urls:" ,urls)
        fs.mkdirSync(`images/${folderName}`)

        for(let i=0; i < urls.length; i++)
        {
            let url = urls[i]
            console.log(url)
          axios({
            url,
           method: 'GET',
           responseType: 'arraybuffer'
       }).then(async (res) => {

        await sharp(res.data).resize(500,428).toFile(`./images/${folderName}/${i}.jpg`)
           //res.data.pipe(fs.createWriteStream(`./${folderName}/${i}.jpg`))

       })
    }
     }

     async downloadImageSocial(url: string, folderName: string)
     {        console.log(url)

        fs.mkdirSync(`images/${folderName}`)
        const sizesArr = [{
            "name": "Facebook",
            "width": 660,
            "heigth": 660
        },
        {
            "name": "Instagram",
            "width": 500,
            "heigth": 500
        },
        {
            "name": "Telegram",
            "width": 512,
            "height": 512
        }

    ]
    for (let social of sizesArr)
    {
        console.log(social)
        axios({
            url,
           method: 'GET',
           responseType: 'arraybuffer'
       }).then(async (res) => {

        await sharp(res.data)
        .resize(social.width,social.height)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .toFormat('jpg')
        .toFile(`./images/${folderName}/${social.name}.jpg`)

       })
    }

     }
     async resizeImages(urls: Array<string>, folderName: string)
     {
        fs.mkdirSync(`images/${folderName}`)

        for(let i=0; i < urls.length; i++)
        {
            sharp(`${folderName}/${i}.jpg`)
            .resize(500,400)
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .toFormat('jpg')
            .toFile(`./${folderName}/fixed/${i}.jpg`)
    
        }

     }


}