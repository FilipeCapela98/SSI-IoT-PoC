export class ProofRequest {
constructor(private connection_id: string,
            private proof_request: {
  name: string,
  requested_attributes: {
    name: string, value: {
      name: string, value: string,
      'restrictions': {
        'schema_id': string,
        'cred_def_id': string
      }[]
    }
  },
  requested_predicates: string, value: {
    name: string, value: {
      name: string,
      p_type: string,
      p_value: string,
      restrictions: {
        schema_id: string,
        cred_def_id: string
      }[]
    }
  },
  'version': '1.0'
}) {
}
}
