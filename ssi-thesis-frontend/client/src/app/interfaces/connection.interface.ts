
export interface Connection {
  accept: string;
  alias: string;
  connection_id: string;
  error_msg: string;
  created_at: Date;
  inbound_connection_id: string;
  initiator: string;
  invitation_key: string;
  invitation_mode: string;
  my_did: string;
  request_id: string;
  routing_state: string;
  state: string;
  their_did: string;
  their_label: string;
  their_role: string;
  updated_at: Date;
}
