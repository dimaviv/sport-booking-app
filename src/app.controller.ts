import {Controller, Get, Res} from '@nestjs/common';
import { AppService } from './app.service';
import {Response} from "express";
import * as path from "path";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('.well-known/assetlinks.json')
  serveAssetLinks(@Res() res: Response) {
    const filePath = path.resolve(__dirname, 'static/assetlinks.json');
    res.sendFile(filePath);
  }
}
