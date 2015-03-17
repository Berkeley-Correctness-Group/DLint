#!/bin/bash

touch scripts/doNotUseDlint.txt
rm -rf instrumentFF_tmp
rm -rf websites
mkdir websites
javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar ./src/java/evaluation/JalangiFirefoxRunner.java

echo "####################################"
java -cp thirdparty/selenium-server-standalone-2.41.0.jar:thirdparty/ evaluation.JalangiFirefoxRunner --url ${bm}
