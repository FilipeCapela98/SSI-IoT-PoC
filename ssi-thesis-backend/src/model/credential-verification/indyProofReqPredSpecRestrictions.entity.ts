import { IndyProofReqNonRevoked } from "./indyProofReqNonRevoked.entity";

export class IndyProofReqPredSpecRestrictions {
    cred_def_id?: string;
    issuer_did?:	string;
    schema_id?:	string
    schema_issuer_did?:	string;
    schema_name?:	string;
    schema_version?:	string
}