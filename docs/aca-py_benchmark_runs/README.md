# ACA-Py benchmark runs

In this folder it is possible to find the outputs from the tests performed on the ACA-Py agents, using the open-source *performance.py* script found on the original ACA-Py documentation.
More information can be found [here](https://github.com/hyperledger/aries-cloudagent-python/tree/main/demo) in the original ACA-Py repository. 

In order to run the tests the following commands were used:

1. ./demo/run_demo performance --count 1000 --revocation --tails-server-base-url http://host.docker.internal:6543 2>&1 | tee revocation_no_mediation_1000.txt 
2. ./demo/run_demo performance --count 1000 --revocation --tails-server-base-url http://host.docker.internal:6543 --mediation 2>&1 | tee revocation_mediation_1000.txt
3. ./demo/run_demo performance --count 1000 --mediation 2>&1 | tee no_revocation_mediation_1000.txt
4. ./demo/run_demo performance --count 1000 2>&1 | tee no_revocation_no_mediation_1000.txt