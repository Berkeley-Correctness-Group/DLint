#!/bin/bash

# annex calculator

rm scripts/doNotUseDlint.txt
rm -rf instrumentFF_tmp
rm -rf webapps
mkdir webapps
javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar ./src/java/evaluation/ExperimentRunner.java
for bm in annex calculator tenframe todolist 
do
  echo "####################################"
  echo ${bm}
  java -cp thirdparty/selenium-server-standalone-2.41.0.jar:thirdparty/ evaluation.ExperimentRunner ${bm}
  mkdir webapps/${bm}
  mv /tmp/analysisResults.json webapps/${bm}/analysisResults.json
  mkdir webapps/${bm}/src
  mv instrumentFF_tmp/*.js webapps/${bm}/src/
done