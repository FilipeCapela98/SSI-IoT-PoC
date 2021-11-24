import { IndyProofReqAttrSpec } from "./indyProofReqAttrSpec.entity";
import { IndyProofReqNonRevoked } from "./indyProofReqNonRevoked.entity";
import { IndyProofReqPredSpec } from "./indyProofReqPredSpec.entity";

export class IndyProofRequest {

    name: string;
    non_revoked: IndyProofReqNonRevoked;
    requested_attributes: { string : IndyProofReqAttrSpec};
    requested_predicates: { string : IndyProofReqPredSpec};
    version: string


    public constructor(name, non_revoked, requested_attributes, requested_predicates, version){

    }

}