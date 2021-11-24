import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { coreService } from 'src/app/services/core.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-charging-station',
  templateUrl: './charging-station.component.html',
  styleUrls: ['./charging-station.component.css'],
  providers: [coreService]
})
export class ChargingStationComponent implements OnInit {
  private readonly deployedUrl: string = environment.csUrl;

  public csQRCode: string;
  private connectionId = '';

  public invitationToEV = '';

  public chargingRate = '';

  public requestedProofs = false;
  public requestedProofsEV = false;

  public everythingIsCompliantEVOwner = false;
  public everythingIsCompliantEV = false;
  public chargingDone = false;

  public eMSPRequestSent = true;
  public eMSPRequestWaiting = false;
  public eMSPRequestApproved = false;
  public eMSPContractID = '';
  public eMSPCompanyName = '';

  public rdwRegistrationEVOwnerRequestSent = true;
  public rdwRegistrationEVOwnerRequestWaiting = false;
  public rdwRegistrationEVOwnerRequestApproved = false;
  public rdwRegistrationEVOwnerID = '';

  public rdwRegistrationEVRequestSent = true;
  public rdwRegistrationEVRequestWaiting = false;
  public rdwRegistrationEVRequestApproved = false;
  public rdwRegistrationEVID = '';


  constructor(private coreService: coreService, private route: ActivatedRoute) {
    this.csQRCode = 'Your QR code data-keeper string';
  }
  ngOnInit(): void {
    this.coreService.createInvitation(true, this.deployedUrl).then((data: any) => {
      this.csQRCode = data.invitation_url;
      this.connectionId = data.connection_id;
    });
  }

  requestProofs(): void {

    this.coreService.requestProofs('cs', this.connectionId, 'request-emsp-contract').then((data: any) => {
      this.eMSPRequestSent = false;
      this.eMSPRequestWaiting = true;
    });

    this.coreService.requestProofs('cs', this.connectionId, 'request-rdw-registration-evowner').then((data: any) => {
      this.rdwRegistrationEVOwnerRequestSent = false;
      this.rdwRegistrationEVOwnerRequestWaiting = true;
    })

    this.requestedProofs = true;

  }

  verifyProofs(): void {
    this.coreService.verifyProofs('cs', 'verify-presentation-emsp-contract').then((dataEMSP: any) => {

      this.coreService.verifyProofs('cs', 'verify-presentation-rdw-registration-evowner').then((dataRDW: any) => {

        if(dataEMSP.state == 'verified'){
          this.eMSPRequestWaiting = false;
          this.eMSPRequestApproved = true;
          this.eMSPContractID = dataEMSP.presentation.requested_proof.revealed_attrs.ContractID.raw;
          this.eMSPCompanyName = dataEMSP.presentation.requested_proof.revealed_attrs.eMSPCompanyName.raw;
        }
        if(dataRDW.state == 'verified'){
          this.rdwRegistrationEVOwnerRequestWaiting = false;
          this.rdwRegistrationEVOwnerRequestApproved = true;
          this.rdwRegistrationEVOwnerID = dataRDW.presentation.requested_proof.revealed_attrs.registration_ID.raw; 
        }

        if(this.eMSPRequestApproved && this.rdwRegistrationEVOwnerRequestApproved){
          this.everythingIsCompliantEVOwner = true;
        }

        this.coreService.requestChargeRate('cs', this.eMSPCompanyName).then((data1: any) => {
          console.log(data1);
        });
      });
    });
  }

  obtainChargeRate(): void {
    this.coreService.obtainChargeRate('cs').then((data2: any) => {
      this.chargingRate = data2.charging_rate;
    });
  }

  connectToEVAndSendPresentationRequest(): void {

    //this.coreService.connectToEV('ev', 'connect-cs').then((data: any) => {
    //  this.requestedProofsEV = true;
    //});

    this.coreService.requestProofsNoConnectionID('cs', 'request-rdw-registration-electricvehicle').then((data: any) => {
      this.requestedProofsEV = true;
      this.rdwRegistrationEVRequestSent = false;
      this.rdwRegistrationEVRequestWaiting = true;
    });
  

  }

  verifyEVProofs(): void {
    this.coreService.verifyProofs('cs', 'verify-presentation-rdw-registration-electricvehicle').then((dataRDW: any) => {

      if(dataRDW.state == 'verified'){
        this.rdwRegistrationEVRequestWaiting = false;
        this.rdwRegistrationEVRequestApproved = true;
        this.rdwRegistrationEVID = dataRDW.presentation.requested_proof.revealed_attrs.registration_ID.raw; 
      }

      if(this.rdwRegistrationEVOwnerID == this.rdwRegistrationEVID){
        this.everythingIsCompliantEV = true;
      }

   })
  }

  startCharging(): any {
    alert('Charging is Starting');
    alert('Charging is done');
    this.chargingDone = true;
  }

  issueCredential(): any {
    this.coreService.issueCredentialWithFields('cs', this.connectionId, 'receipt', this.eMSPContractID);
  }

}
