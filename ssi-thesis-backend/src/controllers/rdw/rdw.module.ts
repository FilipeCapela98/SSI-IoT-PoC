import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AriesModule } from 'src/core/aries/aries.module';
import { RdwController } from './rdw.controller';

@Module({
    imports: [AriesModule],
    controllers: [RdwController],
    providers: [],
})
export class RdwModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
          .apply()
          .forRoutes(RdwModule);
      }
 }
