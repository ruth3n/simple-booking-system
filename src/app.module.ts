import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SlotsModule } from './slots/slots.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    SlotsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
