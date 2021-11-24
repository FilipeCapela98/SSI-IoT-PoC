import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { Config } from 'src/common/config/Config';
import { HttpExceptionFilter } from 'src/common/utils/HttpExceptionFilter';
import { AriesService } from 'src/core/aries/aries.service';

@Controller('ev')
@UseFilters(new HttpExceptionFilter())
export class EvController {

    private api: string;
    private oemApi: string;
    private rdwApi: string;
    private csApi: string;

    private evDID: string;

    private connectionToRDW: string;
    private connectionToOEM: string;
    private connectionToCS: string;

    private presentationExchangeWithRDW: string;

    private alias = 'ev';

    private recipient_key: string;
    private mediation_id: string;
    private endpointOfMediator: string;
    private routing_keys: string;


    public constructor(private ariesService: AriesService) {
        this.api = new Config().settings.evAdminApi;

        this.evDID = new Config().settings.evDID;

        this.oemApi = new Config().settings.oemAdminApi;
        this.rdwApi = new Config().settings.rdwAdminApi;
        this.csApi = new Config().settings.csAdminApi;

        this.connectionToOEM = new Config().settings.connectionEVOEM;
        this.connectionToRDW = new Config().settings.connectionEVRDW;
        this.connectionToCS = new Config().settings.connectionEVCS;
    }

    @Post('webhooks/topic/connections')
    public webhookConnections(@Body() payload: any): any {

    }

    @Post('connections/connect-oem')
    public createAndSendInvitationOEM(): Promise<any> {
        return new Promise(resolve => {
            this.ariesService.createConInvitation(this.api, this.alias, true).pipe()
                .subscribe(
                    responseInv => {
                        this.connectionToOEM = responseInv.connection_id;
                        this.ariesService.receiveConInvitation(this.oemApi, true, responseInv.invitation).pipe()
                            .subscribe(
                                response => {
                                    resolve(responseInv.connection_id);
                                }
                            )
                    }
                )
        })
    }

    @Post('connections/connect-rdw')
    public createAndSendInvitationRDW(): Promise<any> {
        return new Promise(resolve => {
            this.ariesService.createConInvitation(this.api, this.alias, true).pipe()
                .subscribe(
                    responseInv => {
                        this.connectionToRDW = responseInv.connection_id;
                        this.ariesService.receiveConInvitation(this.rdwApi, true, responseInv.invitation).pipe()
                            .subscribe(
                                response => {
                                    resolve(responseInv.connection_id);
                                }
                            )
                    }
                )
        })
    }

    @Post('connections/connect-cs')
    public createAndSendInvitationEV(): any {
        return new Promise(resolve => {
            this.ariesService.createConInvitation(this.api, this.alias, true).pipe()
                .subscribe(
                    responseInv => {
                        this.connectionToCS = responseInv.connection_id;
                        this.ariesService.receiveConInvitation(this.csApi, true, responseInv.invitation).pipe()
                            .subscribe(
                                response => {
                                    resolve(responseInv.connection_id);
                                }
                            )
                    }
                )
        })
    }


    @Post('webhooks/topic/present_proof')
    public receivePresentationRequests(@Body() payload: any): any {

    }

}










/*     @Get('connections/rdw')
    public getActiveConnectionsWithRDW(): Promise<any>{
        const state = 'active';
        return new Promise(resolve=>{
            this.ariesService.getActiveConnections(this.api, state).pipe()
             .subscribe(
                responseConnections => {
                    const goodConnections = responseConnections.results.find((b) => { return b.their_label == 'rdw.Agent';});
                    this.connectionToRDW = goodConnections.connection_id;
                    resolve(goodConnections.connection_id)
                }
             )
        })
    }

    @Get('connections/oem')
    public getActiveConnectionsWithOEM(): Promise<any>{
        const state = 'active';
        return new Promise(resolve=>{
            this.ariesService.getActiveConnections(this.api, state).pipe()
             .subscribe(
                responseConnections => {
                    const goodConnections = responseConnections.results.find((b) => { return b.their_label == 'oem.Agent';});
                    this.connectionToOEM = goodConnections.connection_id;
                    resolve(goodConnections.connection_id)
                }
             )
        })
    } */