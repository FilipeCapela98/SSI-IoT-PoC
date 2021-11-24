import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { coreService } from 'src/app/services/core.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rdw',
  templateUrl: './rdw.component.html',
  styleUrls: ['./rdw.component.css'],
  providers: [coreService]
})
export class RdwComponent implements OnInit {
    private readonly deployedUrl: string = environment.rdwUrl;
    public rdwQRCode: string;
    private connectionId = '';
  
    constructor(private coreService: coreService, private route: ActivatedRoute) {
      this.rdwQRCode = 'Your QR code data-keeper string';
    }
    ngOnInit(): void {
      this.coreService.createInvitation(true, this.deployedUrl).then((data: any) => {
        this.rdwQRCode = data.invitation_url;
        this.connectionId = data.connection_id;
      });
    }
    issueCredential(): any {
      this.coreService.issueCredential('rdw', this.connectionId, 'send-credential-evowner');
    }
}
