#!/bin/bash

# check path
path_unix=`pwd`/scripts/path_unix

if [[ $PATH == *"$path_unix"* ]]
then
  echo ""
else
  export PATH="`pwd`/scripts/path_unix":$PATH
fi

touch scripts/doNotUseDlint.txt
rm -rf instrumentFF_tmp
rm -rf websites
mkdir websites
javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar ./src/java/evaluation/JalangiFirefoxRunner.java

echo "####################################"
java -cp thirdparty/selenium-server-standalone-2.41.0.jar:thirdparty/ evaluation.JalangiFirefoxRunner --url ${bm}


window.count = 0;
J$.analysis = {};
J$.analysis.read = function(iid, name, value) {
	if((window.count++)%1000 ===1) {
		console.log(name);
	}
	return value;
};