import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AriesModule } from 'src/core/aries/aries.module';
import { EMSPController } from './emsp.controller';

@Module({
    imports: [AriesModule],
    controllers: [EMSPController],
    providers: [],
})
export class EMSPModule { 
    public configure(consumer: MiddlewareConsumer): void {
        consumer
          .apply()
          .forRoutes(EMSPModule);
      }
}
