import { IndyProofRequest } from "./indyProofRequest.entity";

export class PresentationSendRequest {

    public constructor(
        public comment: string,
        public connection_id: string,
        public proof_request: {},
        public trace: boolean){

    }
}