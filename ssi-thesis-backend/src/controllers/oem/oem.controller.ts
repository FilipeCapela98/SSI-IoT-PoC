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

@Controller('oem')
@UseFilters(new HttpExceptionFilter())
export class OemController {

    private api: string;
    private evApi: string;

    private oemDID: string;
    private schemaVersion: string;

    private alias = 'oem';
    private connectionToEV: string;

    private schemaAttributes: string[];
    private vin_schema_id: string;
    private vin_schema: Schema;

    private credentialDefinitionID: string;
    private credentialDefinition: CredentialDefinition;

    public constructor(private ariesService: AriesService) {
        this.api = new Config().settings.oemAdminApi;
        this.evApi = new Config().settings.evAdminApi;
        this.oemDID = new Config().settings.oemDID;

        this.schemaVersion = new Config().settings.schema_version;

        this.connectionToEV = new Config().settings.connectionOEMEV;

        this.vin_schema_id = new Config().settings.credential1ID;
        this.credentialDefinitionID = new Config().settings.credential1CD;

        this.schemaAttributes = ["registration_ID",
            "registration_jurisdiction",
            "previous_registration_jurisdiction",
            "VIN",
            "issue_date",
            "effective_date",
            "expiration_date",
            "color",
            "country_of_origin"]
        this.vin_schema = new Schema(this.schemaAttributes, "Vehicle_Birth_ID", this.schemaVersion);

    }

    @Post('schemas')
    public createCredentialSchema(): Promise<SchemaResult> {
        return new Promise(resolve => {
            this.ariesService.issueCredentialSchema(this.api, this.vin_schema).pipe()
                .subscribe(
                    response => {
                        this.vin_schema_id = response.schema_id;
                        resolve(response);
                    })
        })
    }

    @Post('credential-definitions')
    public createCredentialDefinition(): Promise<CredentialDefinitionResult> {
        this.credentialDefinition = new CredentialDefinition(100, this.vin_schema_id, true, "Vehicle_Birth_ID");
        return new Promise(resolve => {
            this.ariesService.issueCredentialDefinition(this.api, this.credentialDefinition).pipe()
                .subscribe(
                    response => {
                        this.credentialDefinitionID = response.credential_definition_id;
                        resolve(response);
                    })
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

    @Post('issue-credential/send')
    public sendCredentialOffer(): Promise<CredentialExchange> {

        var credentialValues = [
            "EVRegistration_0000001",
            "LEGAL_COUNCIL_LTD",
            "-",
            "17249817249149182",
            "1577836800",
            "1577836800",
            "1830297600",
            "Blue",
            "Netherlands"]

        const credentialPreviewArray = this.schemaAttributes.map((key, i) => ({ name: key, value: credentialValues[i] }));

        const credentialOffer = new CredentialProposalRequestV2(
            false,
            "OEM issuing EV with VIN",
            this.connectionToEV,
            new CredentialPreview('issue-credential/2.0/credential-preview', credentialPreviewArray),
            {
                dif: { some_dif_criterion: '' },
                indy: {
                    cred_def_id: this.credentialDefinitionID,
                    issuer_did: this.oemDID,
                    schema_id: this.vin_schema_id
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


    @Post('webhooks/topic/issue_credential')
    public webhookCredentials(@Body() payload: any): any {

        console.log(payload);

    }
    
}
