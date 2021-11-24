
# Repository for Verifiable Electric Vehicle Charging System

## Overview

This repository contains the components to demonstrate an Electric Vehicle Charging Network powered by Self-Sovereign Identity.
This repository is part of the delivery of the Master Thesis project conducted by Filipe Capela, under the supervision of IBM CIC and the University of Groningen.

## List of Software and Versions

Below it is possible to see a list of the utilized software, together with their respective versions:

Software | Version | Repository
------------ | ------------- | --------------
Operating System | macOS Big Sur 11.3 | - 
Docker Engine | 20.10.5 | https://docs.docker.com/engine/install/
Tails Server | - | https://github.com/bcgov/indy-tails-server
Aries Cloud Agent - Python  | 0.6.0 | https://github.com/hyperledger/aries-cloudagent-python
Trinsic Wallet Mobile Agent | 3.2.1 | - 
pgrok | 3.2.0 | https://github.com/jerson/pgrok
NestJS | 7.5.0 | https://github.com/nestjs/nest
AngularJS | 12.0.4 | https://github.com/angular/angular

## Folder Structure

1. aries-cloud-agent-containers (implemented)
    1. Folder that contains configuration files for each of the agents in the system, as well as a docker-compose file to deploy the agents.
2. pgrok_3.2.0 (cloned from original repository), README found [here](pgrok_3.2.0/README.md)
3. indy-tails-server (cloned from original repository), README found [here](indy-tails-server/README.md)
4. ssi-thesis-backend (implemented), README found [here](ssi-thesis-backend/README.md)
5. ssi-thesis-frontend (implemented), README found [here](ssi-thesis-frontend/README.md)
6. Scripts
    1. register_agents.sh - Script to register agents to Indy network
    2. <span>deployment.sh</span> - Script to deploy components of the system 
    3. establish_connections.sh - Script to establish connections between agents
    4. deploy_schemas_and_credential_definitions.sh - Script to deploy schemas and credential definitions to ledger
    5. ev_interactions.sh - Script to automate part of use-case (Electric Vehicle Interactions)
    6. service_providers_flow.sh - Script to automate part of use-case (Service Providers Flow)
7. pgrok.yml - Configuration file for pgrok tunneling.


## How to Deploy System

In order to deploy the system components the following steps are required:

1. Execute *sh register_agents.sh*
    1. Registers the agent seeds in the BCovrin Test Network (if, and only if, the agents have not yet been registered to the Hyperledger Indy network);
2. Execute pgrok deployment command: *pgrok -config=pgrok.yml start oemagent epagent evmediatoragent rdwagent csagent evagent emspagent cpoagent*
    1. This should be ran in a different terminal instance, and be kept running for the time the system is meant to be used.
3. Execute *sh <span>deployment.sh</span>*
    1. Deploys tails-server container;
    2. Deploys ACA-Py agents containers;
        1. All agents with the exception of the EV agent are deployed.
        2. A POST call is made to the EV Mediator agent to create a mediation request.
        3. This mediation invitation url is printed on the screen, __it is the responsibility of the developer__ to copy this url and paste it [here](aries-cloudagent-containers/config/ev.config.yml) in the *mediator-invitation* field.
        4. Press any key on the console after pasting the mediation invitation and the script resumes, deploying the EV agent.
    3. Deploys Backend container;
    4. Deploys Postgres container;
    5. Deploys Frontend containers;

## Installing the Trinsic Wallet App 

For information on how to setup the Trinsic Wallet App agent, refer to the documentation found [here](docs/trinsic_installation/README.md).


## Connect agents and deploy schemas/credential definitions

In order to make use of the agents to demonstrate the use-case, the following flow should be followed:

1. Execute *sh establish_connections.sh*
    1. This script calls for backend endpoints and establishes the connections between the agents, also, it outputs the connection IDs for each connection needed in this system. These need to be copy and pasted following the order they appear on the screen into the Configuration file [here](ssi-thesis-backend/src/common/config/DefaultConfig.ts).
2. Change the **schema_version** field in the Configuration file [here](ssi-thesis-backend/src/common/config/DefaultConfig.ts) to a version number greater than the current one.
3. Execute *sh deploy_schemas_and_credential_definitions.sh*
    1. This script calls for backend endpoints that trigger agent actions to deploy the schemas and credential definitions for the credentials used in the system. Similar to the former script, the output schemaIDs and CredentialDefinitionIDs need to be copy and pasted to the Configuration file [here](ssi-thesis-backend/src/common/config/DefaultConfig.ts).


## Demonstrate the Use-Case Flows

In order to demonstrate the flows of the system, two additional scripts need to be ran:

1. run *sh service_providers_flow.sh* 
    1. This script will trigger the Service Providers flow, following the comments in the script.
2. run *sh ev_interactions.sh* 
    1. This script will trigger the EV Interactions flow, following the comments in the script.
3. At this point onwards, the system can be used from the Frontend to demonstrate the rest of the use-cases.

## Frontends

4 different frontends are deployed. 
Three demonstrate the state of three of the agents, namely the Charging Point Operator, Electric Vehicle and Transportation Agency agents. These are present in [here](ssi-thesis-frontend/cpo-dashboard/README.md), [here](ssi-thesis-frontend/ev-dashboard/README.md) and [here](ssi-thesis-frontend/rdw-dashboard/README.md). These frontends are deployed to http://localhost:4201, http://localhost:4202 and http://localhost:4203, respectively.
The frontend responsible for all of the Electric Vehicle Owner interactions is contained [here](ssi-thesis-frontend/client/README.md), and the web interface is deployed to http://localhost:4200. It contains indications on how to perform each of the end-users use-cases.

## Benchmark tests to ACA-Py agents

The tests used to assess the performance of the ACA-Py agents are stored in the *docs/aca-py_benchmark_runs*.

## License

### Copyright IBM Corp. All Rights Reserved.
