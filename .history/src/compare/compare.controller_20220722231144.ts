import { Controller, Get, Post, Body, Query, Param, Res, Response, Put } from '@nestjs/common';
import { CompareService } from './compare.service';
import { FastifyReply } from 'fastify';
import CompareByBuyer from './compareByBuyer.interface';
import { excelGenrator } from './excelGenerator.service';
import { downloadImagesService } from './downloadImages.service';
const excelJS = require('exceljs')
const dateFormat = require('date-fns')
import { AllowUnauthorizedRequest } from '../auth/allowed-routes.strategy';
import RoutesInterface from './Routes/routes.interface'
import PriceCompare from './compare.interface';
import { ObjectId } from 'mongoose';

interface getStockinterface {
    category: string,
    cat: string
}
interface setBuyerInterface {
    category: string,
    brand: string,
    buyer: string
}
interface putInterface {
    productId: ObjectId,
    updates: any
}

@AllowUnauthorizedRequest()

@Controller('compare')
export class CompareController {
    constructor(private readonly compareService: CompareService,
        private readonly excelGenerator: excelGenrator,
        private readonly downloadImagesService: downloadImagesService
    ) { }
    
    @Get()
    getFilteredData(@Query() filters:any)
    {
        return this.compareService.getFilteredData(filters)
    }
    @Get('/buyer')
    getCompared(@Param('name') buyer: string) {
        console.log('trying..', buyer)
        return this.compareService.getByInCharge(buyer)
    }

    @Post('/buyer')
    async setBuyerCategory(@Body() buyer: setBuyerInterface, @Response() reply: FastifyReply) {
         const itemsToUpdate = await this.compareService.setBuyer(buyer.buyer, buyer.category, buyer.brand)
         reply.code(200).send(itemsToUpdate.modifiedCount)


    }
    @Get('/compare')
    async compare() {
        return this.compareService.getAllItemsIvory('s');
    }
    @Put()
    async put(@Body() product: putInterface)
    {
        console.log(product)
        return this.compareService.updateProduct(product.productId,product.updates)
    }


    @Get('/pending')
    async pending() {
        console.log('checking pending')
        return this.compareService.getPendingApproval();
    }

    @Post('/routes')
    async setRoutes() {

    }
    // @Post('/stock')
    // async getStock(@Body() int: getStockinterface)
    // {
    //     console.log(await this.compareService.getCurrentStock(int.category, int.cat));

    // }


    @Post('/stock')
    async getStock(@Body() GetCategoryFromKsp: RoutesInterface) {
        console.log(GetCategoryFromKsp)
        console.log(await this.compareService.getEntireCategory(GetCategoryFromKsp));

    }

    @Get('/stock/load/:category/:brand')
    async setStockByCategory(@Param('category') category: string, @Param('brand') brand: string
    , @Response() reply: FastifyReply) {
        console.log("cat" + category)

        await this.compareService.loadCategory(category, brand)
        reply.code(200).send("Done")

    }

    @Get('/search/:text')
    async getOneItem(@Param('text') text: string, @Response() reply: FastifyReply) {
        const searchResults = await this.compareService.searchDB(text);

        console.log("searchResults" + searchResults);
        reply.code(200).send(searchResults)
    }

    @Get('/search/live/:text')
    async getOneItemLive(@Param('text') text: string, @Response() reply: FastifyReply) {
        const searchResults = await this.compareService.searchDBLive(text);

        console.log("searchResults" + searchResults);
        reply.code(200).send(searchResults)
    }

    @Get('/GetCat')
    async getCategory() {
        return await this.compareService.getAmountSales("Fragrences");
    }

    @Get('/reset')
    async reset() {
        await this.compareService.resetArr();
    }

    @Get('/resetIvoryUid')
    async resetIVUid() {
        await this.compareService.resetIvoryUid();
    }

    @Get('/Excel/:cat')
    async getExcel(@Param('cat') cat: string, @Response() reply: FastifyReply) {
        const workbook = await this.excelGenerator.getStockByCategory(cat);
        workbook.xlsx.writeFile(`./Excels/WeeklyCompare/${cat}.xlsx`)
        reply.header(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        reply.header(
            'Content-Disposition',
            `attachment; filename=` + `${cat}.xlsx`
        )
        const buffer = await workbook.xlsx.writeBuffer();
        reply.code(200).send(buffer)

    }

@Get('/removeref')
async removeRef( @Response() reply: FastifyReply)
{
    this.compareService.removeRefurbished();
    reply.code(200).send("Removed all refurbished data")

}

@Get('/removeall')
async removeAll( @Response() reply: FastifyReply)
{
    this.compareService.removeAll();
    reply.code(200).send("Removed all data")

}
// @Get('/images/:link')
// async downloadImages(@Param('link') link: string, @Response() reply: FastifyReply)
// {
//     return this.downloadImagesService.downloadImage(link);
// }


}


