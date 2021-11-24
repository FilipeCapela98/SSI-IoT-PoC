# SSI-thesis-backend

This folder contains the backend of the Veriafiable Electric Vehicle Charging System, with the logic to power such use-case.

## Folder Structure

Below a description of the most relevant components of the source code are highlighted:

1. src - The source code of the system
  1. common - Contains the Configuration File from which the controllers extract information contained inside the agents (connection IDs, endpoints, Schema and Credential Definition IDs).
  2. controllers - contains a sub-folder for each agent's controller logic.
  3. core - contains general-purpose service that is used by the controllers to reach the documented endpoints supported by the agents implementation.
  4. enums - contains enum objects used in the project.
  5. interfaces - contains interfaces used in the project.
  6. model - contains all the model objects that are needed for agent interactions.
  7. scripts - contains scripts to automate deployment of postgres instance.
2. Dockerfile and docker-compose file - contain Docker instructions to deploy the backend.