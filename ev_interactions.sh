#!/bin/bash

#Issue VIN Credential to EV from OEM (CREDENTIAL 1)
curl -s -XPOST -H "Content-type: application/json" 'localhost:9229/oem/issue-credential/send' > /tmp/output.html
printf '\nCredential is being issued from OEM to EV...\n'
sleep 2
printf '\nDone\n'


#RDW Verify VIN Credential and Issue EV Registration to EV from RDW (CREDENTIAL 2)
printf '\nRDW is requesting VIN credential from EV\n'
curl -s -XPOST -H "Content-type: application/json" 'localhost:9229/rdw/present-proof/send-request'  > /tmp/output.html
printf '\nRequest sent, waiting for reply from EV\n'

printf '\nEV is generating proof...\n'
sleep 1
printf '\nEV generated proof...\n'
sleep 1
printf '\nRDW received proof...\n'
sleep 1
printf '\nRDW verifies proof...\n'
sleep 1 
printf '\nRDW will now issue a credential to the EV to attest its registration\n'
sleep 2
printf '\nDone\n'

#RDW Verify VIN Credential and Issue EV Registration to EV from RDW (CREDENTIAL 2)
curl -s -XPOST -H "Content-type: application/json" 'localhost:9229/rdw/present-proof/send-request'  > /tmp/output.html