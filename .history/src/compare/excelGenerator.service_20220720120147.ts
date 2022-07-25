import { Injectable , Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { CompareService } from './compare.service';
import { Xlsx } from 'exceljs';
import { timestamp } from 'rxjs';
import e from 'express';
const dateFormat = require('date-fns')

const excelJS = require('exceljs')

@Injectable()
export class excelGenrator {
  constructor(
      private readonly compareService: CompareService
      ) {}

      async getStockByCategory(category: string) : Promise<any>
      {
          console.log("cat" + category)
          let catStock = await this.compareService.setEntireCategoryStock(category);
          catStock = catStock.filter((x) => x.kspStockArray[0] != null)
          let arrCategories = [... new Set(catStock.map(item => item.category))]
          const date: Date = new Date();
          console.log(catStock.length)

          console.log(arrCategories)
  
  
          for(let cat of arrCategories)
          {
          const workbook = new excelJS.Workbook();  // Create a new workbook
          let newFilteredArr = catStock.filter((item) => item.category == cat && item.kspStockArray[0] != null)
          let arrBrands = [... new Set(newFilteredArr.map(item => item.brand))]
          console.log(arrBrands)
          console.log(dateFormat.format(date,"yyyy-mm-dd_hh:MM"))
          const newDate = (dateFormat.format(date,"yyyy-mm-dd_hh:MM"))
          const firstSheet = workbook.addWorksheet("Sum");
          let arrTimes = []
          let allBrandsStock  = []
          let timeStampCounter = 0;
          for (let timeStamp of catStock[0].kspStockArray)
          {
          timeStampCounter++;
            const headers = {header: dateFormat.format(timeStamp.time,"MM-dd hh:mm"), key: `Stock${timeStampCounter}`, width: 10}
            
            arrTimes.push(headers)
            allBrandsStock.push(catStock)

          }
          firstSheet.columns = [
              {header: 'מותג', key: 'Brand'},
              {header: 'תיאור', key: 'Title', width: 60},
              ...arrTimes,
    
  
              // {header: 'סניפים', key: 'BranchesStock'},
              // {header: 'אילת', key: 'EilatStock'},
              {header: 'קישור', key: 'kspLink', width: 35},
              {header: 'מחיר', key: 'kspPrice'}
            ]
            for(let e of newFilteredArr)
            {
              let len: Number = e.kspStockArray.length;
                console.log(e.KspUid)  
              firstSheet.addRow({
                  Brand: e.brand,
                  Title: e.title,

                  Stock1: e.kspStockArray[0].stock[27].qnt,
                  //Stock3: e.kspStockArray[2].stock[27].qnt,  

                  // BranchesStock: BranchesSum,
                  // EilatStock: EilatSum,
                  kspLink: `https://ksp.co.il/web/item/${e.KspUid}`,
                  kspPrice: `${e.priceKsp}₪`
              }).commit()
  
            }
            const endRow = firstSheet.lastRow._number + 1;
            firstSheet.getCell(`C${endRow}`).value = {formula: `SUM(C2:C${endRow-1})`};
            firstSheet.getCell(`D${endRow}`).value = {formula: `SUM(D2:D${endRow-1})`};
            //firstSheet.getCell(`E${endRow}`).value = {formula: `SUM(E2:E${endRow-1})`};

          for(let brand of arrBrands)
          {
          const worksheet = workbook.addWorksheet(brand); // New Worksheet

          console.log(catStock.length)
          let minarr = catStock[0].kspStockArray;

          worksheet.columns = [
              {header: 'תיאור', key: 'Title', width: 60},
              ...arrTimes,
  
              // {header: 'סניפים', key: 'BranchesStock'},
              // {header: 'אילת', key: 'EilatStock'},
              {header: 'קישור', key: 'kspLink', width: 35},
              {header: 'מחיר', key: 'kspPrice'}
            ]
            
            newFilteredArr.filter((x) => x.brand == brand).forEach((e, index) => {
              //   let EilatSum = 0;
              //   let BranchesSum = 0;
  
              //   for(let i =0; i < e.kspStock.length; i++)
              //   {
              //       if(i != 27)
              //       {
              //           BranchesSum += e.kspStock[i].qnt;
              //           if(i < 4)
              //           {
              //             EilatSum += e.kspStock[i].qnt;
              //           }
  
              //       }
              //   }
                
                console.log(e.KspUid, e.priceKsp)
                let arrN = []
                let sumCells = [];
                let counterStock = 0
                for(let stockArr of e.kspStockArray)
                {
                  counterStock++;
                }

                
              worksheet.addRow({
                  Title: e.title,
                  Stock1: e.kspStockArray[0].stock[27].qnt,
                  //Stock3: e.kspStockArray[2].stock[27].qnt,  

                  // BranchesStock: BranchesSum,
                  // EilatStock: EilatSum,
                  kspLink: `https://ksp.co.il/web/item/${e.KspUid}`,
                  kspPrice: `${e.priceKsp}₪`
              }).commit()
            })
            const arrLength = worksheet.lastRow._number + 1;
            worksheet.getCell(`B${arrLength}`).value = {formula: `SUM(B2:B${arrLength-1})`};
            worksheet.getCell(`C${arrLength}`).value = {formula: `SUM(C2:C${arrLength-1})`};
            //worksheet.getCell(`D${arrLength}`).value = {formula: `SUM(D2:D${arrLength-1})`};

  
          }
          console.log('Done mapping', 'cat')
          
            
  
               return workbook;
      }
  
                 }

  }