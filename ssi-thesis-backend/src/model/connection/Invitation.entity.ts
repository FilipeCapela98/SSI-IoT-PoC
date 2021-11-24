import { Initiator } from "src/enums/Initiator.enum";
import { State } from "src/enums/State.enum";

export class Invitation {
  private state: State;
  private updated_at: Date;
  private itation_key: string;
  private routing_state: string;
  private initiator: Initiator;
  private created_at: Date;
  private their_did: string;
  private accept: string;
  private my_did: string;
  private their_label: string;
  private connection_id: string
}
