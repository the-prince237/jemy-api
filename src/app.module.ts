import { Module } from '@nestjs/common';
import { SheinModule } from './shein/shein.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SheinModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
