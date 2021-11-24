import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { Config } from 'src/common/config/Config';
import { HttpExceptionFilter } from 'src/common/utils/HttpExceptionFilter';
import { AriesService } from 'src/core/aries/aries.service';
import { CredentialDefinition } from 'src/model/credential-definition/credentialDefinition.entity';
import { CredentialDefinitionResult } from 'src/model/credential-definition/credentialDefinitionResult.entity';
import { Schema } from 'src/model/credential-schema/schema.entity';
import { SchemaResult } from 'src/model/credential-schema/schemaResult.entity';
import { CredentialExchange } from 'src/model/issue-credentials/credentialExchange.entity';
import { CredentialProposalRequestV1 } from 'src/model/issue-credentials/credentialOfferRequestV1.entity';
import { CredentialProposalRequestV2 } from 'src/model/issue-credentials/credentialOfferRequestV2.entity';
import { CredentialPreview } from 'src/model/issue-credentials/credentialPreview.entity';

@Controller('emsp')
@UseFilters(new HttpExceptionFilter())
export class EMSPController {
    private api: string;
    private cpoAPI: string;
    private emspDID: string;
    private alias = 'emsp';

    private schemaVersion: string;

    private connectionToCPO: string;

    private evOwnerAttributes = ["ContractID", "ContractSignedDate", "ContractExpiryDate", "eMSPCompanyName"];
    private credential4ID: string;
    private credential4CD: string;

    private cpoAttributes = ["ContractID", "ContractSignedDate", "ContractExpiryDate", "eMSPCompanyName", "CPOCompanyName"];
    private credential5ID: string;
    private credential5CD: string;

    public constructor(private ariesService: AriesService) {
        this.api = new Config().settings.eMSPAdminApi;
        this.cpoAPI = new Config().settings.cpoAdminApi;
        this.emspDID = new Config().settings.emspDID;

        this.connectionToCPO = new Config().settings.connectionEMSPCPO;

        this.schemaVersion = new Config().settings.schema_version;
    }

    @Post('cpo-publish-schema')
    public createCredentialSchemaCPO(): Promise<SchemaResult> {

        const contractWithCPO_schema = new Schema(this.cpoAttributes, "Contract_with_Charging_Point_Operator", this.schemaVersion);

        return new Promise(resolve => {
            this.ariesService.issueCredentialSchema(this.api, contractWithCPO_schema).pipe()
                .subscribe(
                    response => {
                        this.credential5ID = response.schema_id;
                        resolve(response);
                    })
        })
    }

    @Post('cpo-publish-credential-definition')
    public createCredentialDefinitionCPO(): Promise<CredentialDefinitionResult> {

        const credentialDefinitionCPO = new CredentialDefinition(100, this.credential5ID, true, "Contract_with_Charging_Point_Operator");

        return new Promise(resolve => {
            this.ariesService.issueCredentialDefinition(this.api, credentialDefinitionCPO).pipe()
                .subscribe(
                    response => {
                        this.credential5CD = response.credential_definition_id;
                        resolve(response);
                    })
        })
    }

    @Post('connections/cpo/connect')
    public createAndSendInvitation(): Promise<any> {

        return new Promise(resolve => {
            this.ariesService.createConInvitation(this.api, this.alias, true).pipe()
                .subscribe(
                    responseInv => {
                        this.connectionToCPO = responseInv.connection_id;
                        this.ariesService.receiveConInvitation(this.cpoAPI, true, responseInv.invitation).pipe()
                            .subscribe(
                                response => {
                                    resolve(responseInv.connection_id)
                                }
                            )
                    }
                )
        })
    }

    @Post('issue-credential/cpo')
    public sendCredentialOfferCPO(): Promise<CredentialExchange> {

        this.credential5ID = new Config().settings.credential5ID;
        this.credential5CD = new Config().settings.credential5CD;

        var credentialValues = [
            "12345678901",
            "1577836800",
            "1830297600",
            "eMSP1",
            "CPO4U2"
        ]

        const credentialPreviewArray = this.cpoAttributes.map((key, i) => ({ name: key, value: credentialValues[i] }));

        const credentialOffer = new CredentialProposalRequestV2(false,
            "emsp contract to CPO",
            this.connectionToCPO,
            new CredentialPreview('issue-credential/2.0/credential-preview', credentialPreviewArray),
            {
                dif: { some_dif_criterion: '' },
                indy: {
                    schema_id: this.credential5ID,
                    cred_def_id: this.credential5CD,
                    issuer_did: this.emspDID

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

    @Post('evowner-publish-schema')
    public createCredentialSchemaEVOwner(): Promise<SchemaResult> {

        const contractWithEVOwner_schema = new Schema(this.evOwnerAttributes, "Contract_with_eMobility_Service_Provider", this.schemaVersion);

        return new Promise(resolve => {
            this.ariesService.issueCredentialSchema(this.api, contractWithEVOwner_schema).pipe()
                .subscribe(
                    response => {
                        this.credential4ID = response.schema_id;
                        resolve(response);
                    })
        })
    }

    @Post('evowner-publish-credential-definition')
    public createCredentialDefinitionEVOwner(): Promise<CredentialDefinitionResult> {

        const credentialDefinitionEVOwner = new CredentialDefinition(100, this.credential4ID, true, "Contract_with_eMobility_Service_Provider",);
        return new Promise(resolve => {
            this.ariesService.issueCredentialDefinition(this.api, credentialDefinitionEVOwner).pipe()
                .subscribe(
                    response => {
                        this.credential4CD = response.credential_definition_id;
                        resolve(response);
                    })
        })
    }

    @Post('issue-credential/evowner')
    public sendCredentialOfferEVOwner(@Body("connectionId") connectionToEvOwner: any): Promise<CredentialExchange> {

        this.credential4ID = new Config().settings.credential4ID;
        this.credential4CD = new Config().settings.credential4CD;

        var credentialValues = [
            "123456789",
            "1577836800",
            "1830297600",
            "eMSP1"
        ]

        const credentialPreviewArray = this.evOwnerAttributes.map((key, i) => ({ name: key, value: credentialValues[i] }));

        const credentialOffer = new CredentialProposalRequestV1(false,
            "emsp contract to EVOwner",
            connectionToEvOwner,
            new CredentialPreview('issue-credential/1.0/credential-preview', credentialPreviewArray),
            {
                dif: { some_dif_criterion: '' },
                indy: {
                    schema_id: this.credential4ID,
                    cred_def_id: this.credential4CD,
                    issuer_did: this.emspDID

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


}