import { HttpException, HttpService, Injectable, UseFilters } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpExceptionFilter } from 'src/common/utils/HttpExceptionFilter';
import { PresentationExchange } from 'src/model/credential-verification/presentationExchange.entity';
import { PresentationSendRequest } from 'src/model/credential-verification/presentationSendRequest.entity';
import { DIDResult } from 'src/model/DIDs/didResult.entity';
import { CredentialProposalRequestV1 } from 'src/model/issue-credentials/credentialOfferRequestV1.entity';
import { CredentialProposalRequestV2 } from 'src/model/issue-credentials/credentialOfferRequestV2.entity';
import { MediationRecord } from 'src/model/mediation/mediationRecord.entity';
import { Connection } from '../../model/connection/Connection.entity';
import { ConnectionInvitation } from '../../model/connection/ConnectionInvitation.entity';
import { InvitationResult } from '../../model/connection/InvitationResult.entity';
import { CredentialDefinition } from '../../model/credential-definition/credentialDefinition.entity';
import { CredentialDefinitionResult } from '../../model/credential-definition/credentialDefinitionResult.entity';
import { Schema } from '../../model/credential-schema/schema.entity';
import { SchemaResult } from '../../model/credential-schema/schemaResult.entity';
import { CredentialExchange } from '../../model/issue-credentials/credentialExchange.entity';
import { BasicMessage } from '../../model/message/basicMessage.entity';

@Injectable()
@UseFilters(new HttpExceptionFilter())
export class AriesService {
    public constructor(private httpService: HttpService) {
    }

    /* Fetch Public DID */

    public retrievePublicDID(endpoint: string): Observable<DIDResult> {
        return this.httpService
            .get(endpoint + 'wallet/did/public')
            .pipe(map((response: AxiosResponse<DIDResult>): DIDResult => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));
    }


    /* Fetch Default Mediator */
    public fetchDefaultMediator(endpoint: string): Observable<MediationRecord> {
        return this.httpService
            .get(endpoint + 'mediation/default-mediator')
            .pipe(map((response: AxiosResponse<MediationRecord>): MediationRecord => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }


    /* Fetch Active Connections */

    public getActiveConnections(endpoint: string, state: string): Observable<{ results: Connection[] }> {
        return this.httpService
            .get(endpoint + 'connections?state=' + state)
            .pipe(map((response: AxiosResponse<{ results: Connection[] }>): { results: Connection[] } => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    /* Connection Establishment */

    public createConInvitation(endpoint: string, alias: string, autoAccept: boolean): Observable<InvitationResult> {
        return this.httpService
            .post(endpoint + 'connections/create-invitation' + '?alias=' + alias + '&auto_accept=' + autoAccept)
            .pipe(map((response: AxiosResponse<InvitationResult>): InvitationResult => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    public receiveConInvitation(destinationEndpoint: any, autoAccept: boolean, invitation: ConnectionInvitation): Observable<Connection> {
        return this.httpService
            .post(destinationEndpoint + 'connections/receive-invitation' + '?auto_accept=' + autoAccept, invitation)
            .pipe(map((response: AxiosResponse<Connection>): Connection => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    // Only needed if --AUTO-PING-CONNECTION flag is disabled
    public acceptConRequest(endpoint: any, connectionId: string): Observable<Connection> {
        return this.httpService
            .post(endpoint + 'connections/' + connectionId + '/accept-request')
            .pipe(map((response: AxiosResponse<Connection>): Connection => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    /* Basic Message */

    public sendMessage(endpoint: string, conn_id: string, basicMessage: BasicMessage): Observable<BasicMessage> {
        return this.httpService
            .post(endpoint + 'connections/' + conn_id + '/send-message', basicMessage)
            .pipe(map((response: AxiosResponse<BasicMessage>): BasicMessage => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    public getConnectionById(endpoint: string): Observable<Connection> {
        return this.httpService
            .get(endpoint)
            .pipe(map((response: AxiosResponse<Connection>): Connection => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    /* Credential Schema and Definitions */

    public issueCredentialSchema(endpoint: string, schema: Schema): Observable<SchemaResult> {
        return this.httpService
            .post(endpoint + "schemas", schema)
            .pipe(map((response: AxiosResponse<SchemaResult>): SchemaResult => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    public issueCredentialDefinition(endpoint: string, credentialDefinition: CredentialDefinition): Observable<CredentialDefinitionResult> {
        return this.httpService
            .post(endpoint + "credential-definitions", credentialDefinition)
            .pipe(map((response: AxiosResponse<CredentialDefinitionResult>): CredentialDefinitionResult => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    /* Credential Issuance Flow */

    public sendCredentialV1(endpoint: string, credentialProposalRequest: CredentialProposalRequestV1): Observable<CredentialExchange> {
        return this.httpService
            .post(endpoint + "issue-credential/send", credentialProposalRequest)
            .pipe(map((response: AxiosResponse<CredentialExchange>): CredentialExchange => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));
    }

    public sendCredentialV2(endpoint: string, credentialProposalRequest: CredentialProposalRequestV2): Observable<CredentialExchange> {
        return this.httpService
            .post(endpoint + "issue-credential-2.0/send", credentialProposalRequest)
            .pipe(map((response: AxiosResponse<CredentialExchange>): CredentialExchange => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    public sendCredentialRequest(destinationEndpoint: string, credentialExchangeID: string): Observable<CredentialExchange> {
        return this.httpService
            .post(destinationEndpoint + "issue-credential/records/" + credentialExchangeID + "/send-request")
            .pipe(map((response: AxiosResponse<CredentialExchange>): CredentialExchange => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    public issueCredential(endpoint: string, credentialExchangeID: string): Observable<CredentialExchange> {
        return this.httpService
            .post(endpoint + "issue-credential/records/" + credentialExchangeID + "/issue")
            .pipe(map((response: AxiosResponse<CredentialExchange>): CredentialExchange => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    /* Credential Verification Flow */

    public sendProofRequest(endpoint: string, proofRequest: PresentationSendRequest): Observable<PresentationExchange> {
        return this.httpService
            .post(endpoint + "present-proof/send-request", proofRequest)
            .pipe(map((response: AxiosResponse<PresentationExchange>): PresentationExchange => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

    public checkPresentationStatus(endpoint: string, credentialExchangeID: string): Observable<PresentationExchange> {
        return this.httpService
            .get(endpoint + "present-proof/records/" + credentialExchangeID)
            .pipe(map((response: AxiosResponse<PresentationExchange>): PresentationExchange => response.data))
            .pipe(
                catchError(e => {
                    throw new HttpException(e.response.data, e.response.status);
                }));;
    }

}

