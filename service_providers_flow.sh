#!/bin/bash

#Issue Contract with CPO to CPO from EMSP (CREDENTIAL 5)
curl -s -XPOST -H "Content-type: application/json" 'localhost:9229/emsp/issue-credential/cpo' > /tmp/output.html

printf '\nCredential is being issued from EMSP to CPO...\n'
sleep 2
printf '\nDone\n'


#Issue Ownership of CS to CS from CPO (CREDENTIAL 6)
curl -s -XPOST -H "Content-type: application/json" 'localhost:9229/cpo/issue-credential/ownership-cs' > /tmp/output.html

printf '\nCredential is being issued from CPO to CS...\n'
sleep 2
printf '\nDone\n'


#Issue Contract with CPO to CPO from EP (CREDENTIAL 8)
curl -s -XPOST -H "Content-type: application/json" 'localhost:9229/ep/issue-credential/contract-cpo' > /tmp/output.html

printf '\nCredential is being issued from EP to CPO...\n'
sleep 2
printf '\nDone\n'