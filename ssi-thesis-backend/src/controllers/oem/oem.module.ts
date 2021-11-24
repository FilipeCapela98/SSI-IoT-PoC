import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AriesModule } from 'src/core/aries/aries.module';
import { OemController } from './oem.controller';

@Module({
    imports: [AriesModule],
    controllers: [OemController],
    providers: []
})
export class OemModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
          .apply()
          .forRoutes(OemModule);
      }
 }
