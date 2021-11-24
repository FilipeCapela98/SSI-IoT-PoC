import { State } from "src/enums/State.enum";

export class MediationRecord {
    connection_id: string;
    created_at:	string;
    endpoint:	string;
    mediation_id:	string;
    mediator_terms: string[];
    recipient_terms: string[]
    role: string
    routing_keys: string[];
    state:	State;
    updated_at:	string;
}