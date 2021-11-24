import { HttpModule, Module } from '@nestjs/common';
import { AriesController } from './aries.controller';
import { AriesService } from './aries.service';

@Module({
    imports: [HttpModule],
    exports: [AriesService],
    controllers: [AriesController],
    providers: [AriesService],
})
export class AriesModule { }
