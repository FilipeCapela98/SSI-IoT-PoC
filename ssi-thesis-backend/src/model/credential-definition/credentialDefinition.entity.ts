export class CredentialDefinition {
    public constructor(public revocation_registry_size: number,
                       public schema_id: string,
                       public support_revocation: boolean,
                       public tag: string){
    }
  }