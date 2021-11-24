import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { Config } from 'src/common/config/Config';
import { HttpExceptionFilter } from 'src/common/utils/HttpExceptionFilter';
import { AriesService } from 'src/core/aries/aries.service';
import { CredentialDefinition } from 'src/model/credential-definition/credentialDefinition.entity';
import { CredentialDefinitionResult } from 'src/model/credential-definition/credentialDefinitionResult.entity';
import { Schema } from 'src/model/credential-schema/schema.entity';
import { SchemaResult } from 'src/model/credential-schema/schemaResult.entity';
import { CredentialExchange } from 'src/model/issue-credentials/credentialExchange.entity';
import { CredentialProposalRequestV2 } from 'src/model/issue-credentials/credentialOfferRequestV2.entity';
import { CredentialPreview } from 'src/model/issue-credentials/credentialPreview.entity';
import { BasicMessage } from 'src/model/message/basicMessage.entity';

@Controller('cpo')
@UseFilters(new HttpExceptionFilter())
export class CpoController {
    private api: string;
    private csApi: string;

    private cpoDID: string;

    private alias = 'cpo';

    private connectionToCS: string;
    private connectionToEMSP: string;
    private connectionToEP: string;

    private schemaVersion: string;

    private credential6_schemaAttributes: string[];
    private credential6_schema_id: string;
    private credential6_schema: Schema;
    private credential6_credentialDefinitionID: string;
    private credential6_credentialDefinition: CredentialDefinition;

    public constructor(private ariesService: AriesService) {
        this.api = new Config().settings.cpoAdminApi;
        this.csApi = new Config().settings.csAdminApi;

        this.cpoDID = new Config().settings.cpoDID;

        this.connectionToEMSP = new Config().settings.connectionCPOEMSP;
        this.connectionToCS = new Config().settings.connectionCPOCS;
        this.connectionToEP = new Config().settings.connectionCPOEP;

        this.schemaVersion = new Config().settings.schema_version;

        this.credential6_schema_id = new Config().settings.credential6ID;
        this.credential6_credentialDefinitionID = new Config().settings.credential6CD;

        this.credential6_schemaAttributes = ["CPOCompany", "ContractSignedDate", "ContractExpiryDate", "CSUniqueID"];
        this.credential6_schema = new Schema(this.credential6_schemaAttributes, "Ownership_Proof_of_CS", this.schemaVersion);
    }

    @Post('schemas')
    public createCredentialSchemaReceipt(): Promise<SchemaResult> {
        return new Promise(resolve => {
            this.ariesService.issueCredentialSchema(this.api, this.credential6_schema).pipe()
                .subscribe(
                    response => {
                        this.credential6_schema_id = response.schema_id;
                        resolve(response);
                    })
        })
    }

    @Post('credential-definitions')
    public createCredentialDefinitionCPO(): Promise<CredentialDefinitionResult> {
        this.credential6_credentialDefinition = new CredentialDefinition(100, this.credential6_schema_id, true, "Ownership_Proof_of_CS");
        return new Promise(resolve => {
            this.ariesService.issueCredentialDefinition(this.api, this.credential6_credentialDefinition).pipe()
                .subscribe(
                    response => {
                        this.credential6_credentialDefinitionID = response.credential_definition_id;
                        resolve(response);
                    })
        })
    }

    @Post('connections/connect-cs')
    public createAndSendInvitationCS(): Promise<any> {
        return new Promise(resolve => {
            this.ariesService.createConInvitation(this.api, this.alias, true).pipe()
                .subscribe(
                    responseInv => {
                        this.connectionToCS = responseInv.connection_id;
                        this.ariesService.receiveConInvitation(this.csApi, true, responseInv.invitation).pipe()
                            .subscribe(
                                response => {
                                    resolve(responseInv.connection_id)
                                }
                            )
                    }
                )
        })
    }

    @Post('issue-credential/ownership-cs')
    public issueCredentialOwnershipCS(): Promise<CredentialExchange> {

        var credentialValues = [
            "CPO4U2",
            "1577836800",
            "1830297600",
            "000000010201"
        ]

        const credentialPreviewArray = this.credential6_schemaAttributes.map((key, i) => ({ name: key, value: credentialValues[i] }));

        const credentialOffer = new CredentialProposalRequestV2(false,
            "Ownership Attestation of Charging Station",
            this.connectionToCS,
            new CredentialPreview('issue-credential/2.0/credential-preview', credentialPreviewArray),
            {
                dif: { some_dif_criterion: '' },
                indy: {
                    schema_id: this.credential6_schema_id,
                    cred_def_id: this.credential6_credentialDefinitionID,
                    issuer_did: this.cpoDID

                }
            });

        return new Promise(resolve => {
            this.ariesService.sendCredentialV2(this.api, credentialOffer).pipe()
                .subscribe(responseSend => {
                    resolve(responseSend);
                }
                )
        }
        )
    }

    @Get('connections/eMSP')
    public getActiveConnectionsWithEMSP(): Promise<any> {
        const state = 'active';
        return new Promise(resolve => {
            this.ariesService.getActiveConnections(this.api, state).pipe()
                .subscribe(
                    responseConnections => {
                        const goodConnections = responseConnections.results.find((b) => { return b.their_label == 'emsp.Agent'; });
                        this.connectionToEMSP = goodConnections.connection_id;
                        resolve(goodConnections.connection_id)
                    }
                )
        })
    }

    @Get('connections/EP')
    public getActiveConnectionsWithEP(): Promise<any> {
        const state = 'active';
        return new Promise(resolve => {
            this.ariesService.getActiveConnections(this.api, state).pipe()
                .subscribe(
                    responseConnections => {
                        const goodConnections = responseConnections.results.find((b) => { return b.their_label == 'ep.Agent'; });
                        this.connectionToEP = goodConnections.connection_id;
                        resolve(goodConnections.connection_id)
                    }
                )
        })
    }

    @Post('webhooks/topic/basicmessages')
    public receiveChargingRate(@Body() payload: any): any {

        var chargingRateValue = '';

        if (payload.content.includes("Request Charging Rate")) {

            if (payload.content.includes("eMSP1")) {
                chargingRateValue = "0.098€/kWh";
            }
            else {
                chargingRateValue = "0.104€/kWh";
            }

            return new Promise(resolve => {
                this.ariesService.sendMessage(this.api, this.connectionToCS, new BasicMessage(chargingRateValue)).pipe()
                    .subscribe(
                        response => {
                            resolve(response)
                        }
                    )
            })
        }

    }


}
