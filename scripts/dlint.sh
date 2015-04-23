#!/bin/bash

# check path
if [! "$PATH"|grep -q "`pwd`/scripts/path_unix"]; then
  export PATH="`pwd`/scripts/path_unix":$PATH  
fi

rm scripts/doNotUseDlint.txt
rm -rf instrumentFF_tmp
rm -rf websites
mkdir websites
javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar ./src/java/evaluation/ExperimentRunner.java
bm="http://"$1
  echo "####################################"
  echo ${bm}
  echo "Please do not interact with the DLint-started browser, DLint will automatically close the browser after analysis."
  bm_short=`echo ${bm} | sed s/http[s]*:\\\\/\\\\///g | sed s/\\\\//\\\\_/g`
  echo ${bm_short}
  mkdir websites/${bm_short}
  echo $((`date +%s`*1000+`date +%-N`/1000000)) > websites/${bm_short}/time.txt
  java -cp thirdparty/selenium-server-standalone-2.41.0.jar:thirdparty/ evaluation.ExperimentRunner --url ${bm}
#  bm_short=`basename ${bm}`
  echo $((`date +%s`*1000+`date +%-N`/1000000)) >> websites/${bm_short}/time.txt
  sleep 3
  node scripts/beautifyJSON.js /tmp/analysisResults.json
  mv /tmp/analysisResults.json websites/${bm_short}/analysisResults.json
  mkdir websites/${bm_short}/sourcemaps
  mv instrumentFF_tmp/*_jalangi_sourcemap.json websites/${bm_short}/sourcemaps/
  mkdir websites/${bm_short}/src
  mv instrumentFF_tmp/*.js websites/${bm_short}/src/
  echo "All executed files and analysis result will be dumped in websites\<URL> directory, in which analysis.json contains all DLint warnings."
  