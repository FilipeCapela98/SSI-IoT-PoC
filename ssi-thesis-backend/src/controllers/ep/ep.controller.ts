import { Controller, Post, UseFilters } from '@nestjs/common';
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

@Controller('ep')
@UseFilters(new HttpExceptionFilter())
export class EpController {

    private api: string;
    private cpoApi: string;

    private alias = 'ep';

    private epDID: string;

    private schemaVersion;
    private connectionToCPO: string;

    private credential8_schemaAttributes: string[];
    private credential8_schema_id: string;
    private credential8_schema: Schema;
    private credential8_credentialDefinitionID: string;
    private credential8_credentialDefinition: CredentialDefinition;

    public constructor(private ariesService: AriesService) {
        this.api = new Config().settings.epAdminApi;
        this.cpoApi = new Config().settings.cpoAdminApi;

        this.epDID = new Config().settings.epDID;

        this.connectionToCPO = new Config().settings.connectionEPCPO;

        this.credential8_schema_id = new Config().settings.credential8ID;
        this.credential8_credentialDefinitionID = new Config().settings.credential8CD;

        this.schemaVersion = new Config().settings.schema_version;

        this.credential8_schemaAttributes = ["ContractID", "ContractSignedDate", "ContractExpiryDate", "EPCompany", "CPOCompanyName"];
        this.credential8_schema = new Schema(this.credential8_schemaAttributes, "Contract_with_Charging_Point_Operator", this.schemaVersion);
    }

    @Post('schemas')
    public createCredentialSchemaReceipt(): Promise<SchemaResult> {
        return new Promise(resolve => {
            this.ariesService.issueCredentialSchema(this.api, this.credential8_schema).pipe()
                .subscribe(
                    response => {
                        this.credential8_schema_id = response.schema_id;
                        resolve(response);
                    })
        })
    }

    @Post('credential-definitions')
    public createCredentialDefinitionCPO(): Promise<CredentialDefinitionResult> {
        this.credential8_credentialDefinition = new CredentialDefinition(100, this.credential8_schema_id, true, "Contract_with_Charging_Point_Operator");
        return new Promise(resolve => {
            this.ariesService.issueCredentialDefinition(this.api, this.credential8_credentialDefinition).pipe()
                .subscribe(
                    response => {
                        this.credential8_credentialDefinitionID = response.credential_definition_id;
                        resolve(response);
                    })
        })
    }

    @Post('connections/connect-cpo')
    public createAndSendInvitationCPO(): Promise<any> {
        return new Promise(resolve => {
            this.ariesService.createConInvitation(this.api, this.alias, true).pipe()
                .subscribe(
                    responseInv => {
                        this.connectionToCPO = responseInv.connection_id;
                        this.ariesService.receiveConInvitation(this.cpoApi, true, responseInv.invitation).pipe()
                            .subscribe(
                                response => {
                                    resolve(responseInv.connection_id)
                                }
                            )
                    }
                )
        })
    }


    @Post('issue-credential/contract-cpo')
    public issueCredentialContractCPO(): Promise<CredentialExchange> {

        var credentialValues = [
            "000000000100101",
            "1577836800",
            "1830297600",
            "EP4U",
            "CPO4U2"
        ]

        const credentialPreviewArray = this.credential8_schemaAttributes.map((key, i) => ({ name: key, value: credentialValues[i] }));

        const credentialOffer = new CredentialProposalRequestV2(false,
            "Ownership Attestation of Charging Station",
            this.connectionToCPO,
            new CredentialPreview('issue-credential/2.0/credential-preview', credentialPreviewArray),
            {
                dif: { some_dif_criterion: '' },
                indy: {
                    schema_id: this.credential8_schema_id,
                    cred_def_id: this.credential8_credentialDefinitionID,
                    issuer_did: this.epDID
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
}
