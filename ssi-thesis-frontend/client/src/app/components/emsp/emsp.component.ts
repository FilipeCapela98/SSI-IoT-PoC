import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { coreService } from 'src/app/services/core.service';
import { environment } from 'src/environments/environment';
/**/
@Component({
  selector: 'app',
  templateUrl: './emsp.component.html',
  styleUrls: ['./emsp.component.css'],
  providers: [coreService]
})
export class EmspComponent implements OnInit {
  private readonly deployedUrl: string = environment.emspUrl;
  public emspQRCode: string;
  private connectionId = '';

  constructor(private coreService: coreService, private route: ActivatedRoute) {
    this.emspQRCode = 'Your QR code data-keeper string';
  }
  ngOnInit(): void {
    this.coreService.createInvitation(true, this.deployedUrl).then((data: any) => {
      this.emspQRCode = data.invitation_url;
      this.connectionId = data.connection_id;
    });
  }
  issueCredential(): any {
    this.coreService.issueCredential('emsp', this.connectionId, 'evowner');
  }
}
