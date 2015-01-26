#!/bin/bash

rm -rf instrumentFF_tmp
rm -rf webLintTest
mkdir webLintTest
javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar ./src/java/evaluation/ExperimentRunner.java
for bm in `ls tests/experiment/completeDLintTest/websites/ | xargs`
do
  echo "####################################"
  echo ${bm}
  bm_short=${bm}
  url="http://127.0.0.1:8000/tests/experiment/completeDLintTest/websites/"${bm}"/index.html"
  echo ${url}
  java -cp thirdparty/selenium-server-standalone-2.41.0.jar:thirdparty/ evaluation.ExperimentRunner --url ${url}
#  bm_short=`basename ${bm}`
  sleep 3
  mkdir webLintTest/${bm_short}
  mv /tmp/analysisResults.json webLintTest/${bm_short}/analysisResults.json
  mkdir webLintTest/${bm_short}/sourcemaps
  mv instrumentFF_tmp/*_jalangi_sourcemap.json webLintTest/${bm_short}/sourcemaps/
  mkdir webLintTest/${bm_short}/src
  mv instrumentFF_tmp/*.js webLintTest/${bm_short}/src/
done
