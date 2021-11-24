import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { Config } from 'src/common/config/Config';
import { HttpExceptionFilter } from 'src/common/utils/HttpExceptionFilter';
import { AriesService } from 'src/core/aries/aries.service';
import { CredentialDefinition } from 'src/model/credential-definition/credentialDefinition.entity';
import { CredentialDefinitionResult } from 'src/model/credential-definition/credentialDefinitionResult.entity';
import { Schema } from 'src/model/credential-schema/schema.entity';
import { SchemaResult } from 'src/model/credential-schema/schemaResult.entity';
import { PresentationExchange } from 'src/model/credential-verification/presentationExchange.entity';
import { CredentialExchange } from 'src/model/issue-credentials/credentialExchange.entity';
import { CredentialProposalRequestV1 } from 'src/model/issue-credentials/credentialOfferRequestV1.entity';
import { CredentialPreview } from 'src/model/issue-credentials/credentialPreview.entity';
import { BasicMessage } from 'src/model/message/basicMessage.entity';

@Controller('cs')
@UseFilters(new HttpExceptionFilter())
export class CsController {

    private api: string;
    private cpoApi: string;
    private evApi: string;

    private csDID: string;

    private alias = 'cs';

    private schemaVersion: string;

    public currentChargingRate: string;

    private connectionToCPO: string;
    private connectionToEV: string;
    private connectionToEVOwner: string;

    private presentationExchangeEMSPContract: string;
    private presentationExchangeRDWRegistrationEVOwner: string;
    private presentationExchangeRDWRegistrationEV: string;

    private credential2schema_id: string;
    private credential2credentialDefinitionID: string;

    private credential4schema_id: string;
    private credential4credentialDefinitionID: string;

    private credential3schema_id: string;
    private credential3credentialDefinitionID: string;

    private credential7schema_attributes: string[];
    private credential7schema_id: string;
    private credential7schema: Schema;
    private credential7credentialDefinitionID: string;
    private credential7credentialDefinition: CredentialDefinition;

    private eMSPCompanyName: string;

    public constructor(private ariesService: AriesService) {
        this.api = new Config().settings.csAdminApi;
        this.cpoApi = new Config().settings.cpoAdminApi;
        this.evApi = new Config().settings.evAdminApi;

        this.csDID = new Config().settings.csDID;

        this.connectionToCPO = new Config().settings.connectionCSCPO;
        this.connectionToEV = new Config().settings.connectionCSEV;

        this.schemaVersion = new Config().settings.schema_version;

        this.credential2schema_id = new Config().settings.credential2ID;
        this.credential2credentialDefinitionID = new Config().settings.credential2CD;

        this.credential3schema_id = new Config().settings.credential3ID;
        this.credential3credentialDefinitionID = new Config().settings.credential3CD;

        this.credential4schema_id = new Config().settings.credential4ID;
        this.credential4credentialDefinitionID = new Config().settings.credential4CD;

        this.credential7schema_id = new Config().settings.credential7ID;
        this.credential7credentialDefinitionID = new Config().settings.credential7CD;
        this.credential7schema_attributes = ["TransactionID", "Charging Session Duration", "kWh", "Price", "eMSPContractID"];
        this.credential7schema = new Schema(this.credential7schema_attributes, "Charging_Session_Receipt", this.schemaVersion);
    }

    @Get('connections/cpo')
    public getActiveConnectionsWithCPO(): Promise<any> {
        const state = 'active';
        return new Promise(resolve => {
            this.ariesService.getActiveConnections(this.api, state).pipe()
                .subscribe(
                    responseConnections => {
                        const goodConnections = responseConnections.results.find((b) => { return b.their_label == 'cpo.Agent'; });
                        this.connectionToCPO = goodConnections.connection_id;
                        resolve(goodConnections.connection_id)
                    }
                )
        })
    }

    @Get('connections/ev')
    public getActiveConnectionsWithEV(): Promise<any> {
        const state = 'active';
        return new Promise(resolve => {
            this.ariesService.getActiveConnections(this.api, state).pipe()
                .subscribe(
                    responseConnections => {
                        const goodConnections = responseConnections.results.find((b) => { return b.their_label == 'ev.Agent'; });
                        this.connectionToEV = goodConnections.connection_id;
                        resolve(goodConnections.connection_id)
                    }
                )
        })
    }


    @Post('schemas')
    public createCredentialSchemaReceipt(): Promise<SchemaResult> {
        return new Promise(resolve => {
            this.ariesService.issueCredentialSchema(this.api, this.credential7schema).pipe()
                .subscribe(
                    response => {
                        this.credential7schema_id = response.schema_id;
                        resolve(response);
                    })
        })
    }

    @Post('credential-definitions')
    public createCredentialDefinitionCPO(): Promise<CredentialDefinitionResult> {
        this.credential7credentialDefinition = new CredentialDefinition(100, this.credential7schema_id, true, "Charging_Session_Receipt");
        return new Promise(resolve => {
            this.ariesService.issueCredentialDefinition(this.api, this.credential7credentialDefinition).pipe()
                .subscribe(
                    response => {
                        this.credential7credentialDefinitionID = response.credential_definition_id;
                        resolve(response);
                    })
        })
    }



    @Post('obtain-charging-rate')
    public obtainCurrentChargingRate(): Promise<any> {

        return new Promise(resolve => {
            resolve({ charging_rate: this.currentChargingRate });
        })
    }

    @Post('request-charging-rate')
    public requestChargingRate(@Body("eMSPCompanyName") eMSPCompanyName: any): Promise<any> {

        return new Promise(resolve => {
            this.ariesService.sendMessage(this.api, this.connectionToCPO, new BasicMessage("Request Charging Rate: " + eMSPCompanyName)).pipe()
                .subscribe(
                    response => {
                        resolve(response)
                    }
                )
        })

    }

    @Post('webhooks/topic/basicmessages')
    public receiveChargingRate(@Body() payload: any): any {

        if (payload.content.includes('€')) {
            this.currentChargingRate = payload.content;
        }
    }


    @Post('present-proof/send-request/request-emsp-contract')
    public sendEMSPContractCredentialRequest(@Body("connectionId") connectionToEvOwner: any): Promise<PresentationExchange> {

        const requested_attributes = {
            'ContractID':
            {
                name: 'ContractID',
                restrictions: [
                    {
                        schema_id: this.credential4schema_id,
                        cred_def_id: this.credential4credentialDefinitionID
                    }
                ],
                non_revoked:
                {
                    "to": 1620658245
                }
            },
            'eMSPCompanyName':
            {
                name: 'eMSPCompanyName',
                restrictions: [
                    {
                        schema_id: this.credential4schema_id,
                        cred_def_id: this.credential4credentialDefinitionID
                    }
                ],
                non_revoked:
                {
                    "to": 1620658245
                }
            }
        }


        const requested_predicates = {
            'ContractExpiryDate':
            {
                name: 'ContractExpiryDate',
                p_type: '>',
                p_value: 1609459200,
                restrictions: [
                    {
                        schema_id: this.credential4schema_id,
                        cred_def_id: this.credential4credentialDefinitionID
                    }
                ],
                non_revoked:
                {
                    "to": 1620658245
                }
            }
        }

        const proofRequest = {
            comment: 'Requesting eMSP contract number from EVOwner Signed by eMSP',
            connection_id: connectionToEvOwner,
            proof_request: {
                name: 'eMobility Service Provider Contract Details',
                requested_attributes: requested_attributes,
                requested_predicates: requested_predicates,
                version: '1.0'
            },
            trace: false
        }

        return new Promise(resolve => {
            this.ariesService.sendProofRequest(this.api, proofRequest).pipe()
                .subscribe(
                    response => {
                        this.presentationExchangeEMSPContract = response.presentation_exchange_id;
                        resolve(response)
                    }
                )
        })
    }

    @Get('/present-proof/records/verify-presentation-emsp-contract')
    public verifyEMSPContractCredentialRequest(): Promise<any> {

        return new Promise(resolve => {
            this.ariesService.checkPresentationStatus(this.api, this.presentationExchangeEMSPContract).pipe()
                .subscribe(
                    response => {
                        resolve(response)
                    }
                )
        })

    }

    @Post('present-proof/send-request/request-rdw-registration-evowner')
    public sendRDWRegistrationCredentialRequest(@Body("connectionId") connectionToEvOwner: any): Promise<PresentationExchange> {

        const requested_attributes = {
            'registration_ID':
            {
                name: 'registration_ID',
                restrictions: [
                    {
                        schema_id: this.credential3schema_id,
                        cred_def_id: this.credential3credentialDefinitionID
                    },
                ],
            }
        }

        const requested_predicates = {
            'expiration_date':
            {
                name: 'expiration_date',
                p_type: '>',
                p_value: 1609459200,
                restrictions: [
                    {
                        schema_id: this.credential3schema_id,
                        cred_def_id: this.credential3credentialDefinitionID
                    }
                ],
                non_revoked:
                {
                    "to": 1620658245
                }
            }
        }

        const proofRequest = {
            comment: 'Requesting RDW Registration number from EVOwner Signed by RDW',
            connection_id: connectionToEvOwner,
            proof_request: {
                name: 'Transportation Agency Details',
                requested_attributes: requested_attributes,
                requested_predicates: requested_predicates,
                version: '1.0'
            },
            trace: false
        }

        return new Promise(resolve => {
            this.ariesService.sendProofRequest(this.api, proofRequest).pipe()
                .subscribe(
                    response => {
                        this.presentationExchangeRDWRegistrationEVOwner = response.presentation_exchange_id;
                        resolve(response)
                    }
                )
        })
    }

    @Get('/present-proof/records/verify-presentation-rdw-registration-evowner')
    public verifyRDWRegistrationCredentialRequest(): Promise<any> {

        return new Promise(resolve => {
            this.ariesService.checkPresentationStatus(this.api, this.presentationExchangeRDWRegistrationEVOwner).pipe()
                .subscribe(
                    response => {
                        resolve(response)
                    }
                )
        })
    }

    @Post('issue-credential/receipt')
    public issueCredentialReceipt(@Body("connectionId") connectionToEVOwner: any, @Body("eMSPContractID") eMSPContractID: any): Promise<CredentialExchange> {

        var credentialValues = [
            "0000000001",
            "00:30:00",
            this.currentChargingRate,
            "4€",
            eMSPContractID
        ]

        const credentialPreviewArray = this.credential7schema_attributes.map((key, i) => ({ name: key, value: credentialValues[i] }));

        const credentialOffer = new CredentialProposalRequestV1(false,
            "Charging Transaction Receipt",
            connectionToEVOwner,
            new CredentialPreview('issue-credential/1.0/credential-preview', credentialPreviewArray),
            {
                dif: { some_dif_criterion: '' },
                indy: {
                    schema_id: this.credential7schema_id,
                    cred_def_id: this.credential7credentialDefinitionID,
                    issuer_did: this.csDID
                }
            });

        return new Promise(resolve => {
            this.ariesService.sendCredentialV1(this.api, credentialOffer).pipe()
                .subscribe(responseSend => {
                    resolve(responseSend);
                }
                )
        }
        )
    }

    @Post('webhooks/topic/connections')
    public webhooksConnections(@Body() payload: any): any {

        //if(payload.state == 'active' && payload.their_label == 'ev.Agent'){
        //    this.connectionToEV = payload.connection_id;
        //    this.sendRDWRegistrationCredentialRequestToEV(); 
        //}
    }

    @Post('present-proof/send-request/request-rdw-registration-electricvehicle')
    public sendRDWRegistrationCredentialRequestToEV(): Promise<PresentationExchange> {

        const requested_attributes = {
            'registration_ID':
            {
                name: 'registration_ID',
                restrictions: [
                    {
                        schema_id: this.credential2schema_id,
                        cred_def_id: this.credential2credentialDefinitionID
                    },
                ],
            }
        }

        const requested_predicates = {
            'expiration_date':
            {
                name: 'expiration_date',
                p_type: '>',
                p_value: 1609459200,
                restrictions: [
                    {
                        schema_id: this.credential2schema_id,
                        cred_def_id: this.credential2credentialDefinitionID
                    }
                ]
            }
        }

        const proofRequest = {
            comment: 'Requesting RDW Registration number from EV Signed by RDW',
            connection_id: this.connectionToEV,
            proof_request: {
                name: 'Transportation Agency Details',
                requested_attributes: requested_attributes,
                requested_predicates: requested_predicates,
                version: '1.0'
            },
            trace: false
        }

        return new Promise(resolve => {
            this.ariesService.sendProofRequest(this.api, proofRequest).pipe()
                .subscribe(
                    response => {
                        this.presentationExchangeRDWRegistrationEV = response.presentation_exchange_id;
                        resolve(response)
                    }
                )
        })
    }

    @Post('webhooks/topic/present_proof')
    public webhooksPresentProof(@Body() payload: any): any {

        if (payload.state == 'verified' && payload.presentation_exchange_id == this.presentationExchangeRDWRegistrationEV) {
            console.log("Ready To Verify");
        }
    }

    @Get('/present-proof/records/verify-presentation-rdw-registration-electricvehicle')
    public verifyRDWRegistrationCredentialRequestToEV(): Promise<any> {

        return new Promise(resolve => {
            this.ariesService.checkPresentationStatus(this.api, this.presentationExchangeRDWRegistrationEV).pipe()
                .subscribe(
                    response => {
                        resolve(response)
                    }
                )
        })
    }
}
