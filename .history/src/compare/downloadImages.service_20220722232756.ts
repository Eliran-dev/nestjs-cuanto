import { Injectable , Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
@Injectable()
export class downloadImagesService {
  constructor(
      private readonly downloadImagesService: downloadImagesService ,
      ) {}
      async downloadImage(url: string) {
         return await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        }).then(res => {
            res.data.pipe(fs.createWriteStream('./Excels/WeeklyCompare/sdsa.png'))
        }) 

      }
}