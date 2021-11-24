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
import { CredentialProposalRequestV2 } from 'src/model/issue-credentials/credentialOfferRequestV2.entity';
import { CredentialPreview } from 'src/model/issue-credentials/credentialPreview.entity';

@Controller('rdw')
@UseFilters(new HttpExceptionFilter())
export class RdwController {

    private api: string;
    private evApi: string;

    private rdwDID: string;
    private schemaVersion;

    private alias = 'rdw';
    private connectionToEV: string;

    private presentationExchangeId: string;

    private rdw_ev_registration_schemaAttributes: string[];
    private rdw_ev_registration_id: string;
    private rdw_ev_registration_schema: Schema;

    private rdw_evOwner_registration_schemaAttributes: string[];
    private rdw_evOwner_registration_id: string;
    private rdw_evOwner_registration_schema: Schema;

    private credential1SchemaID: string;
    private credential1CredentialDefinition: string;

    private credential2SchemaID: string;
    private credential2CredentialDefinition: string;

    private credential3SchemaID: string;
    private credential3CredentialDefinition: string;

    public constructor(private ariesService: AriesService) {
        this.api = new Config().settings.rdwAdminApi;
        this.rdwDID = new Config().settings.rdwDID;

        this.schemaVersion = new Config().settings.schema_version;

        this.connectionToEV = new Config().settings.connectionRDWEV;

        this.credential1SchemaID = new Config().settings.credential1ID;
        this.credential1CredentialDefinition = new Config().settings.credential1CD;

        this.credential2SchemaID = new Config().settings.credential2ID;
        this.credential2CredentialDefinition = new Config().settings.credential2CD;

        this.credential3SchemaID = new Config().settings.credential3ID;
        this.credential3CredentialDefinition = new Config().settings.credential3CD;

        this.rdw_ev_registration_schemaAttributes = [
            "registration_ID",
            "issue_date",
            "effective_date",
            "expiration_date",
            "country_of_registration",
            "vehicleID"]

        this.rdw_evOwner_registration_schemaAttributes = [
            "registration_ID",
            "issue_date",
            "effective_date",
            "expiration_date",
            "country_of_registration",
            "vehicleID"]
    }

    @Post('schemas-evRegistration')
    public createCredentialSchemaEV(): Promise<SchemaResult> {

        this.rdw_ev_registration_schema = new Schema(this.rdw_ev_registration_schemaAttributes, "Transportation_Agency_Vehicle_Registration_Credential", this.schemaVersion);

        return new Promise(resolve => {
            this.ariesService.issueCredentialSchema(this.api, this.rdw_ev_registration_schema).pipe()
                .subscribe(
                    response => {
                        this.rdw_ev_registration_id = response.schema_id;
                        resolve(response);
                    })
        })
    }

    @Post('credential-definitions-evRegistration')
    public createCredentialDefinitionEV(): Promise<CredentialDefinitionResult> {
        const credentialDefinition = new CredentialDefinition(100, this.rdw_ev_registration_id, true, "Transportation_Agency_Vehicle_Registration_Credential");
        return new Promise(resolve => {
            this.ariesService.issueCredentialDefinition(this.api, credentialDefinition).pipe()
                .subscribe(
                    response => {
                        resolve(response);
                    })
        })
    }

    @Post('schemas-evOwnerRegistration')
    public createCredentialSchemaEVOwner(): Promise<SchemaResult> {

        this.rdw_evOwner_registration_schema = new Schema(this.rdw_evOwner_registration_schemaAttributes, "Transportation_Agency_Vehicle_Ownership_Credential", this.schemaVersion);

        return new Promise(resolve => {
            this.ariesService.issueCredentialSchema(this.api, this.rdw_evOwner_registration_schema).pipe()
                .subscribe(
                    response => {
                        this.rdw_evOwner_registration_id = response.schema_id;
                        resolve(response);
                    })
        })
    }

    @Post('credential-definitions-evOwneregistration')
    public createCredentialDefinitionEVOwner(): Promise<CredentialDefinitionResult> {
        const credentialDefinition = new CredentialDefinition(100, this.rdw_evOwner_registration_id, true, "Transportation_Agency_Vehicle_Ownership_Credential");
        return new Promise(resolve => {
            this.ariesService.issueCredentialDefinition(this.api, credentialDefinition).pipe()
                .subscribe(
                    response => {
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

    @Post('present-proof/send-request')
    public sendVINCredentialRequest(): Promise<PresentationExchange> {

        const requested_attributes = {
            'VIN':
            {
                name: 'VIN',
                restrictions: [
                    {
                        schema_id: this.credential1SchemaID,
                        cred_def_id: this.credential1CredentialDefinition
                    }
                ]
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
                        schema_id: this.credential1SchemaID,
                        cred_def_id: this.credential1CredentialDefinition
                    }
                ]
            }
        }

        const proofRequest = {
            comment: 'Requesting VIN number from Vehicle Signed by OEM',
            connection_id: this.connectionToEV,
            proof_request: {
                name: 'Request for Vehicle VIN',
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
                        this.presentationExchangeId = response.presentation_exchange_id;
                        resolve(response)
                    }
                )
        })
    }

    @Post('webhooks/topic/present_proof')
    public presentationExchangeWebhook(@Body() presentationExchange: any): any {

        console.log(presentationExchange);

        if (presentationExchange.state == "verified" && presentationExchange.presentation_request.name == "Request for Vehicle VIN") {
            this.verifyAndIssueResponseCredential()
        }

    }

    public verifyAndIssueResponseCredential(): Promise<any> {

        var credentialValues = [
            "00000000001",
            "1577836800",
            "1577836800",
            "1830297600",
            "Netherlands",
            "17249817249149182"
        ]

        const credentialPreviewArray = this.rdw_ev_registration_schemaAttributes.map((key, i) => ({ name: key, value: credentialValues[i] }));

        const credentialProposal = new CredentialProposalRequestV2(false,
            'RDW VC for EV to attest its registration',
            this.connectionToEV,
            new CredentialPreview('issue-credential/2.0/credential-preview', credentialPreviewArray),
            {
                dif: { some_dif_criterion: '' },
                indy: {
                    issuer_did: this.rdwDID,
                    cred_def_id: this.credential2CredentialDefinition,
                    schema_id: this.credential2SchemaID
                }
            })

        return new Promise(resolve => {
            this.ariesService.sendCredentialV2(this.api, credentialProposal).pipe()
                .subscribe(responseCredential => {
                    resolve(responseCredential);
                })
        })

    }

    @Post('issue-credential/send-credential-evowner')
    public sendCredentialOfferEVOwner(@Body("connectionId") connectionToEvOwner: any): Promise<CredentialExchange> {

        var credentialValues = [
            "00000000001",
            "1577836800",
            "1577836800",
            "1830297600",
            "Netherlands",
            "17249817249149182"
        ]

        const credentialPreviewArray = this.rdw_evOwner_registration_schemaAttributes.map((key, i) => ({ name: key, value: credentialValues[i] }));

        const credentialOffer = new CredentialProposalRequestV1(
            false,
            "registration of EV Owner as owner of said EV",
            connectionToEvOwner,
            new CredentialPreview('issue-credential/1.0/credential-preview', credentialPreviewArray),
            {
                dif: { some_dif_criterion: '' },
                indy: {
                    cred_def_id: this.credential3CredentialDefinition,
                    issuer_did: this.rdwDID,
                    schema_id: this.credential3SchemaID
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
