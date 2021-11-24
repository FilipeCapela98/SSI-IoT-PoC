import { Module } from '@nestjs/common';
import { AriesModule } from './aries/aries.module';

@Module({
    imports: [AriesModule],
    controllers: [],
    providers: [],
})
export class CoreModule { }
