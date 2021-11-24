import { Initiator } from "src/enums/Initiator.enum";
import { State } from "src/enums/State.enum";

export class Connection {
  public state: State;
  public updated_at: Date;
  public invitation_mode: string;
  public invitation_key: string;
  public routing_state: string;
  public initiator: Initiator;
  public created_at: Date;
  public their_did: Date;ß
  public accept: string;
  public my_did: string;
  public their_label: string;
  public connection_id: string
}