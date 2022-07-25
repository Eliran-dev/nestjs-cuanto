import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { CompareService } from './compare.service';
import { Xlsx } from 'exceljs';
import { ConfigService } from '@nestjs/config';

const dateFormat = require('date-fns')

const accountSid = 'ACace23e952df9dbb50e555c0b9154d2af';
const authToken = '1dd6125e8a9891070fbb64eeccb987af'
const client = require('twilio')(accountSid, authToken);

let arr = []

const excelJS = require('exceljs')

@Injectable()
export class Sms {
    constructor(
        private readonly compareService: CompareService,

    ) { }
    //@Cron(CronExpression.EVERY_10_SECONDS)
    async sendSMS(recipient: string, body: string)
    {
        client.messages
        .create({
            body: body,
            from: '+12197064543',
            to: recipient
        })
        .then(message => console.log(message.sid))
        .catch(err => console.log(err))

    }
        //@Cron(CronExpression.EVERY_10_SECONDS)

    async getXiaomiNewest() {
        console.log("It's about time")

        const newestXiaomi: Array<any> = await this.compareService.getNewest(".272..573..2202.")
        console.log(arr)
        if (arr[0] == null) {
            arr = newestXiaomi;
            console.log("First Launch")

        }
        else {
            console.log("In else")

            if (newestXiaomi[0].KspUid != arr[0].KspUid) {
                console.log("In else/if")
                if(!newestXiaomi[0].title.includes("מציאון") &&  !this.compareService.doesExistKsp(newestXiaomi[0].KspUid))
            {
                console.log("It's about tTTTTime")
                this.sendSMS('+972507712388', 'New Xiaomi Phones!:\n https://ksp.co.il/web/cat/.272..573..2202.?sort=3')

            }
            }
        }
        console.log(newestXiaomi[0].KspUid)
    }

    //@Cron(CronExpression.EVERY_HOUR)
    //@Cron(CronExpression.EVERY_MINUTE)
    async getProcessorss() {

        console.log("It's about time")
        this.sendSMS('+972507712388', 'New Xiaomi Phones!:\n https://ksp.co.il/web/cat/.272..573..2202.?sort=3')
    }
    //@Cron(CronExpression.EVERY_MINUTE)
    async getHourlyStock() {
        const currentStock = await this.compareService.getCurrentStock(198303);
        console.log(currentStock.result.stock[28].qnt)
        this.sendSMS('+972507712388', `Current Stock!:\n ${currentStock.result.data.name} \n${currentStock.result.stock[28].qnt}`)

    }

}