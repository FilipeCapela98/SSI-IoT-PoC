#!/bin/bash

# Deploy Tails Server for Revocation
cd indy-tails-server/docker
./manage down
./manage start

cd ..
cd ..

# Deploy Agents with the Exception of the EV Agent
cd aries-cloudagent-containers
docker-compose down
docker-compose up --build --detach oem-agent rdw-agent ep-agent cs-agent emsp-agent cpo-agent evmediator-agent 

sleep 5

# Call EV Mediator Agent to create invitation to add to EV mediation configuration
curl -XPOST -H "Content-type: application/json" -d '{
  "alias": "EVMediator",
  "handshake_protocols": [
    "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/didexchange/1.0"
  ],
  "metadata": {},
  "my_label": "Mediation to EV",
  "use_public_did": false
}' 'http://localhost:8020/out-of-band/create-invitation?auto_accept=true&multi_use=true'

# Copy the invitation url and paste it in the EV agent 
read -n 1 -s -r -p "Copy Invitation Url to field 'mediatior-invitation on ev.config.yml, then press enter"

# Deploy EV Agent
docker-compose up --build --detach ev-agent

cd ..

# Deploy Backend Container
cd ssi-thesis-backend
docker-compose down
docker-compose build 
docker-compose up --detach

# Deploy Postgres Instance
sh src/scripts/start-db.sh

cd ..

# Deploy frontend containers
cd ssi-thesis-frontend
docker-compose down
docker-compose build
docker-compose up --detach

echo 
echo 
echo "===================================================="
echo "Ready to start demonstrating Self-Sovereign Identity"
echo "===================================================="
echo 
echo