export class CredentialExchange {
    public auto_issue: boolean;
    public auto_offer: boolean;
    public auto_remove: boolean;
    public connection_id: string;
    public created_at: string;
    public credential: {
        description: string
    };
    public credential_definition_id: string;
    public credential_exchange_id: string;
    public credential_id: string;
    public credential_offer: {
        description: string
    };
    public credential_offer_dict: {
        description: string
    };
    public credential_proposal_dict: {
        description: string
    };
    public credential_request: {
        description: string
    };
    public credential_request_metadata: {
        description: string
    };
    public error_msg: string;
    public initiator: string;
    public parent_thread_id: string;
    public raw_credential: {};
    public revoc_reg_id: string;
    public revocation_id: string;
    public role: string;
    public schema_id: string;
    public state: string;
    public thread_id: string;
    public trace: boolean;
    public updated_at: string
}