import { Injectable } from '@nestjs/common';
import { Cron, ScheduleModule } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
@Injectable()
export class AppService {
  constructor(private schedulerRegistry: SchedulerRegistry){}

  getHello(): string {
    return 'Hello World!';
  }


}
