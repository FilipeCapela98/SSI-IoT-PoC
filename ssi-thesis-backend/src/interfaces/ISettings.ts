
export interface ISettings {
  apiPath?: string;
  env?: string;
  host: string;
  port?: number | string;

  schema_version?: string;

  oemAdminApi?:string;
  rdwAdminApi?: string;
  cpoAdminApi?: string;
  evAdminApi?: string;
  epAdminApi?: string;
  eMSPAdminApi?: string;
  csAdminApi?: string;

  oemDID?: string,
  emspDID?: string,
  evDID?: string,
  rdwDID?: string,
  csDID?: string,
  cpoDID?: string,
  epDID?: string,

  credential1ID?: string,
  credential1CD?: string,
  credential2ID?: string,
  credential2CD?: string,
  credential3ID?: string,
  credential3CD?: string,
  credential4ID?: string,
  credential4CD?: string,
  credential5ID?: string,
  credential5CD?: string,
  credential6ID?: string,
  credential6CD?: string,
  credential7ID?: string,
  credential7CD?: string,
  credential8ID?: string,
  credential8CD?: string, 


  connectionEMSPCPO?: string,
  connectionCPOEMSP?: string,

  connectionCPOCS?: string,
  connectionCSCPO?: string,

  connectionEPCPO?: string,
  connectionCPOEP?: string,

  connectionEVOEM?: string,
  connectionOEMEV?: string,

  connectionEVRDW?: string,
  connectionRDWEV?: string,

  connectionEVCS?: string,
  connectionCSEV?: string

}
