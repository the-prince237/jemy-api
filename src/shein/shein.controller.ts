import { Controller, Get, Query } from '@nestjs/common';
import { SheinService } from './shein.service';

@Controller('shein')
export class SheinController {
  constructor(private readonly sheinService: SheinService) {}
  @Get('products')
  async getProducts(@Query('product') product: string) {
    return await this.sheinService.getProducts(product);
  }
}
