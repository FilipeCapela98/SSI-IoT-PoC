import { IndyProofReqPredSpecRestrictions } from "../credential-verification/indyProofReqPredSpecRestrictions.entity";
import { CredentialPreview } from "./credentialPreview.entity";

export class CredentialProposalRequestV1 {
    public constructor(
        private auto_remove: boolean,
        private comment: string,
        private connection_id: string,
        private credential_proposal: CredentialPreview,
        private filter: { dif: {some_dif_criterion: string}, indy: IndyProofReqPredSpecRestrictions},
    ){
    }
}
