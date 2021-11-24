import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AriesModule } from 'src/core/aries/aries.module';
import { CpoController } from './cpo.controller';

@Module({
    imports: [AriesModule],
    controllers: [CpoController],
    providers: [],
})
export class CpoModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
          .apply()
          .forRoutes(CpoModule);
      }
 }
