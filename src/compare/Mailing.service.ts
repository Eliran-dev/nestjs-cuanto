import { Injectable , Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { CompareService } from './compare.service';
const excelJS = require('exceljs')



@Injectable()
export class MailingService {
  constructor(
      private readonly mailerService: MailerService ,
      private readonly compareService: CompareService
      ) {}


  async sendCat(emailReciever: Array<string>, title: string, stock: any)
  {
      let link = `https://ksp.co.il/web/item/${stock.itemMostSold}`
      this
      .mailerService
      .sendMail({
          to: emailReciever,
          from: 'elirandevop@gmail.com',
          subject: `מלאי ${title}  ✔`,
          html: `
          <div
          href=${link}
 
          >
          <h1> Current stock of ${title} is: ${stock.sumCounter} </h1>
          <h1> ${stock.unitsSoldSum} :units overall has been sold</h2>
          <h2>${stock.itemMostSoldTitle} :Most popular item </h2>
          <a
          href=${link}

          >
          <img 
          src=${stock.itemMostSoldImgLink}         
          alt=${stock.itemMostSold} 
          > </img>
          </a>

          </div>
          `,
          template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
          context: {  // Data to be sent to template engine.
            code: 'cf1a3f828287',
            username: 'john doe',
          },
          
      })
    .then((success) => {
     console.log(success)
   })/* The above code is a cron job that runs every hour and sends an email to the users with the
   stock of the category that they chose. */
   
   .catch((err) => {
     console.log(err)
   });
  }


  // @Cron(CronExpression.EVERY_2_HOURS)
  // async getProcessors() {
  //   const tomerEmail = 'shchiber91@gmail.com';
  //   const eliranEmail = 'eliranyihye@gmail.com';
  //   const eliranEmailSChool = 'eliranschool@gmail.com';

  //   const royEmail = 'roybs2011@gmail.com';

  //     const stock = await this.compareService.getAmountSales("Laptops");
  //   console.log("CHECK")
  //   console.log("stock::::::" + JSON.stringify(stock))
  //   this.sendCat([eliranEmail, eliranEmailSChool], 'Laptops', stock);
  // }

  // @Cron(CronExpression.EVERY_3_HOURS)
  // async getCases() {
  //   const tomerEmail = ' shchiber91@gmail.com';
  //   const eliranEmail = 'eliranyihye@gmai.com';
  //   const royEmail = 'roybs2011@gmail.com';

  //     const stock = await this.compareService.getAmountSales("PcCases");
  //   console.log("CHECK")
  //   console.log("stock::::::" + JSON.stringify(stock))
  //   this.sendCat([eliranEmail], 'PcCases', stock);
  // }

//   @Cron(CronExpression.EVERY_HOUR)
//   async getProcessorss() {
//     const tomerEmail = ' shchiber91@gmail.com';
//     const eliranEmail = 'eliranyihye@gmai.com';
//     const royEmail = 'roybs2011@gmail.com';

//       const stock = await this.compareService.getAmountSales("Processors");
//     console.log("CHECK")
//     console.log("stock::::::" + JSON.stringify(stock))
//     this.sendCat([eliranEmail], 'Processors', stock);
//   }

// @Cron('* 53 * * * *')
// async getProcessorssHalf() {
//     const tomerEmail = ' shchiber91@gmail.com';
//     const eliranEmail = 'eliranyihye@gmai.com';
//     const royEmail = 'roybs2011@gmail.com';

//       const stock = await this.compareService.getAmountSales("Processors");
//     console.log("CHECK")
//     console.log("stock::::::" + JSON.stringify(stock))
//     this.sendCat([eliranEmail], 'Processors', stock);
//   }


}