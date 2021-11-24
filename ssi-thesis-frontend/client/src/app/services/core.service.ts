import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Connection } from '../interfaces/connection.interface';

@Injectable()
export class coreService {
  private readonly baseUrl: string = environment.emspUrl;
  private readonly backendUrl: string = environment.backendUrl;
  private headers: object;
  public constructor(private http: HttpClient) {
    this.headers = { headers: new Headers({ 'Content-Type': 'application/json' }) };

  }

  public createInvitation(autoAccept: boolean, deployedUrl: string): any {
    try {
      return this.http.post(deployedUrl + '/connections/create-invitation?auto_accept=' + autoAccept, this.headers).toPromise();
    } catch (err) {
      console.log(err);
    }
  }

  public connectToEV(endpointName: string, credentialEndpoint: string): any {
    try {
      return this.http.post(this.backendUrl + '/' + endpointName + '/connections/' + credentialEndpoint, this.headers).toPromise();
    } catch (err) {
      console.log(err);
    }
  }

  public issueCredential(endpointName: string, connectionId: string, credentialEndpoint: string): any {
    try {
      return this.http.post(this.backendUrl + '/' + endpointName + '/issue-credential/' + credentialEndpoint, {"connectionId": connectionId}, this.headers).toPromise();
    } catch (err) {
      console.log(err);
    }
  }

  public issueCredentialWithFields(endpointName: string, connectionId: string, credentialEndpoint: string, contractID: string): any {
    try {
      return this.http.post(this.backendUrl + '/' + endpointName + '/issue-credential/' + credentialEndpoint, {"connectionId": connectionId, "eMSPContractID": contractID}, this.headers).toPromise();
    } catch (err) {
      console.log(err);
    }
  }

  public requestProofs(endpointName: string, connectionId: string, credentialEndpoint: string): any {
    try {
      return this.http.post(this.backendUrl + '/' + endpointName + '/present-proof/send-request/' + credentialEndpoint, {"connectionId": connectionId}, this.headers).toPromise();
    } catch (err) {
      console.log(err);
    }
  }

  public requestProofsNoConnectionID(endpointName: string, credentialEndpoint: string): any {
    try {
      return this.http.post(this.backendUrl + '/' + endpointName + '/present-proof/send-request/' + credentialEndpoint, this.headers).toPromise();
    } catch (err) {
      console.log(err);
    }
  }

  public verifyProofs(endpointName: string, credentialEndpoint: string): any {
    try {
      return this.http.get(this.backendUrl + '/' + endpointName + '/present-proof/records/' + credentialEndpoint, this.headers).toPromise();
    } catch (err) {
      console.log(err);
    }
  }

  public requestChargeRate(endpointName: string, eMSPCompanyName: string): any {
    try {
      return this.http.post(this.backendUrl + '/' + endpointName + '/request-charging-rate', {"eMSPCompanyName": eMSPCompanyName}, this.headers).toPromise();
    } catch (err) {
      console.log(err);
    }
  }

  public obtainChargeRate(endpointName: string): any {
    try {
      return this.http.post(this.backendUrl + '/' + endpointName + '/obtain-charging-rate', this.headers).toPromise();
    } catch (err) {
      console.log(err);
    }
  }
}
