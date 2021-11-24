import { ISettings } from 'src/interfaces/ISettings';

export class DefaultConfig {
  public static get settings(): ISettings {
    return {
      apiPath: '/api',
      env: process.env.NODE_ENV,
      host: '0.0.0.0',
      port: '8080',

      schema_version: "10.7",

      oemAdminApi: 'http://host.docker.internal:8006/',
      rdwAdminApi: 'http://host.docker.internal:8008/',
      cpoAdminApi: 'http://host.docker.internal:8018/',
      evAdminApi: 'http://host.docker.internal:8014/',
      epAdminApi: 'http://host.docker.internal:8010/',
      eMSPAdminApi: 'http://host.docker.internal:8016/',
      csAdminApi: 'http://host.docker.internal:8012/',

      oemDID: 'LvfqLyz4jQyKdv5CM1JuiC',
      emspDID: '2EVtqWYsnKJUoDVTLjLYsS',
      evDID: 'WAZb6BJ15xENcjtBRKwpQz',
      rdwDID: '2MkXwbfeWLkNg5jghm3qP4',
      csDID: '3eEtYsMAWeYZXtv7fXuBti',
      cpoDID: '9hnFjSC2F3Jf5XAdwjEmik',
      epDID: '82jd2w4D6pd5o1irspjmF5',

      credential1ID: 'LvfqLyz4jQyKdv5CM1JuiC:2:Vehicle_Birth_ID:10.7',
      credential1CD: 'LvfqLyz4jQyKdv5CM1JuiC:3:CL:136176:Vehicle_Birth_ID', 
      credential2ID: '2MkXwbfeWLkNg5jghm3qP4:2:Transportation_Agency_Vehicle_Registration_Credential:10.7',
      credential2CD: '2MkXwbfeWLkNg5jghm3qP4:3:CL:136182:Transportation_Agency_Vehicle_Registration_Credential', 
      credential3ID: '2MkXwbfeWLkNg5jghm3qP4:2:Transportation_Agency_Vehicle_Ownership_Credential:10.7',
      credential3CD: '2MkXwbfeWLkNg5jghm3qP4:3:CL:136187:Transportation_Agency_Vehicle_Ownership_Credential', 
      credential5ID: '2EVtqWYsnKJUoDVTLjLYsS:2:Contract_with_Charging_Point_Operator:10.7',
      credential5CD: '2EVtqWYsnKJUoDVTLjLYsS:3:CL:136193:Contract_with_Charging_Point_Operator', 
      credential4ID: '2EVtqWYsnKJUoDVTLjLYsS:2:Contract_with_eMobility_Service_Provider:10.7', 
      credential4CD: '2EVtqWYsnKJUoDVTLjLYsS:3:CL:136199:Contract_with_eMobility_Service_Provider', 
      credential6ID: '9hnFjSC2F3Jf5XAdwjEmik:2:Ownership_Proof_of_CS:10.7',
      credential6CD: '9hnFjSC2F3Jf5XAdwjEmik:3:CL:136206:Ownership_Proof_of_CS', 
      credential7ID: '3eEtYsMAWeYZXtv7fXuBti:2:Charging_Session_Receipt:10.7',
      credential7CD: '3eEtYsMAWeYZXtv7fXuBti:3:CL:136212:Charging_Session_Receipt', 
      credential8ID: '82jd2w4D6pd5o1irspjmF5:2:Contract_with_Charging_Point_Operator:10.7',
      credential8CD: '82jd2w4D6pd5o1irspjmF5:3:CL:136218:Contract_with_Charging_Point_Operator',

      connectionEMSPCPO: '27f55a78-4f1c-4fa6-9d0e-65b82f9a23b9',
      connectionCPOEMSP: 'b290fc3c-6098-43c6-8b0f-c8f9a156d422',
    
      connectionCPOCS: 'af2d65d4-8765-4ad7-b5e5-efea5706b8d8',
      connectionCSCPO: '240203e9-6f4a-4ae5-a628-58570ebc104c',
    
      connectionEPCPO: '7f5d7523-fbe6-4ab4-ab55-f642f9b5a280',
      connectionCPOEP: '7b386718-24c2-4a0e-8a36-825f3cff9b35',
    
      connectionEVOEM: 'b075c0b7-018c-4c70-be1e-69431ec7f1b1',
      connectionOEMEV: 'ecde7ae3-6b74-4ec8-a260-75167aeef1d5',
    
      connectionEVRDW: '19350f78-0915-41a7-bd01-e650a84f609f',
      connectionRDWEV: '9f8f9e91-5d3f-4ab3-af8f-f6dadf7210bd',
    
      connectionEVCS: '1d2581ec-7786-45a9-8fb7-38b3a20085b3',
      connectionCSEV: '027a6a47-d58e-45ec-90c9-781ee73a05d0',

    };
  }
}
/* 

CREDENTIALS MAPPING 

Credential1: OEM to EV with VIN
Credential2: RDW to EV with registration
Credential3: RDW to EV Owner with registration
Credential4: eMSP to EV Owner with contract
Credential5: eMSP to CPO with Contract
Credential6: CPO to CS with Contract
Credential7: CS to EVOwner with Receipt
Credential8: EP to CPO with Contract 

*/
