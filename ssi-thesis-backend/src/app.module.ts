import { CoreModule } from './core/core.module';
import { RdwModule } from './controllers/rdw/rdw.module';
import { OemModule } from './controllers/oem/oem.module';
import { EvModule } from './controllers/ev/ev.module';
import { EpModule } from './controllers/ep/ep.module';
import { EMSPModule } from './controllers/eMSP/emsp.module';
import { CsModule } from './controllers/cs/cs.module';
import { CpoModule } from './controllers/cpo/cpo.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './common/config/config.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/utils/HttpExceptionFilter';

@Module({
  imports: [
    CoreModule,
    RdwModule,
    OemModule,
    EvModule,
    EpModule,
    EMSPModule,
    CsModule,
    CpoModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig())],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }],
})
export class AppModule { }
