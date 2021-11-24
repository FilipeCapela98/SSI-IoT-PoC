import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AriesModule } from 'src/core/aries/aries.module';
import { EvController } from './ev.controller';

@Module({
    imports: [AriesModule],
    controllers: [EvController],
    providers: [],
})
export class EvModule { 

    public configure(consumer: MiddlewareConsumer): void {
        consumer
          .apply()
          .forRoutes(EvModule);
      }

}
