import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AriesModule } from 'src/core/aries/aries.module';
import { EpController } from './ep.controller';

@Module({
    imports: [AriesModule],
    controllers: [EpController],
    providers: [],
})
export class EpModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
          .apply()
          .forRoutes(EpModule);
      }
}
