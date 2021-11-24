import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AriesModule } from 'src/core/aries/aries.module';
import { CsController } from './cs.controller';

@Module({
    imports: [AriesModule],
    controllers: [CsController],
    providers: [],
})
export class CsModule { 

    public configure(consumer: MiddlewareConsumer): void {
        consumer
          .apply()
          .forRoutes(CsModule);
      }

}
