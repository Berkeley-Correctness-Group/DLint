#!/bin/bash

# check path
path_unix=`pwd`/scripts/path_unix

if [[ $PATH == *"$path_unix"* ]]
then
  echo ""
else
  export PATH="`pwd`/scripts/path_unix":$PATH
fi

rm -rf instrumentFF_tmp
rm -rf websites
mkdir websites
javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar ./src/java/evaluation/ExperimentRunner.java
for bm in `cat tests/dlint/urls.txt | xargs`
do
  echo "####################################"
  echo ${bm}
  bm_short=`echo ${bm} | sed s/http[s]*:\\\\/\\\\///g | sed s/\\\\//\\\\_/g`
  echo ${bm_short}
  mkdir websites/${bm_short}
  echo $((`date +%s`*1000+`date +%-N`/1000000)) > websites/${bm_short}/time.txt
  java -cp thirdparty/selenium-server-standalone-2.41.0.jar:thirdparty/ evaluation.ExperimentRunner --url ${bm}
#  bm_short=`basename ${bm}`
  echo $((`date +%s`*1000+`date +%-N`/1000000)) >> websites/${bm_short}/time.txt
  sleep 3
  mv /tmp/analysisResults.json websites/${bm_short}/analysisResults.json
done

