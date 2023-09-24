import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer-core';

const baseUrl = 'https://shein.com';

@Injectable()
export class SheinService {
  constructor(private readonly configService: ConfigService) {}
  async getProducts(products: string) {
    const browser = await puppeteer.connect({
      browserWSEndpoint: this.configService.getOrThrow('SBR_WS_ENDPOINT'),
    });

    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(20 * 60 * 1000);
      await page.goto(`${baseUrl}/pdsearch/${products}`);

      const res = await page.$$eval('.S-product-item', (resultItems) => {
        return resultItems.map((resultItem) => {
          const image = resultItem.querySelector('img')?.src;
          const url = resultItem.querySelector('a')?.href;
          const title = resultItem.querySelector('.S-product-item__link')
            ?.textContent;
          const fullPrice = resultItem.querySelector('.S-product-item__price')
            ?.textContent;
          const amount = fullPrice ? parseFloat(fullPrice.split('$')[1]) : null;
          const currency = fullPrice ? fullPrice[0] : null;
          return {
            image: `https:${image}`,
            url,
            title,
            fullPrice,
            amount,
            currency,
          };
        });
      });

      return res;
    } catch (e) {
      throw e;
    } finally {
      await browser.close();
    }
  }
}
