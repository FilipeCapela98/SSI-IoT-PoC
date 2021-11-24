import { ConnectionInvitation } from './ConnectionInvitation.entity';

export class InvitationResult {
  public connection_id: string;
  public invitation: ConnectionInvitation;
  public invitation_url: string;
  public alias: string;
}
