#!/bin/bash
# 
# uname table copied from:
# http://stackoverflow.com/questions/3466166/how-to-check-if-running-in-cygwin-mac-or-linux
# Operating-System------------------| uname -s
# Mac OS X                            Darwin
# Cygwin (Windows XP)                 CYGWIN_NT-5.1
# Cygwin (Windows 7 32-bit)           CYGWIN_NT-6.1
# Cygwin (Windows 7 64-bit)           CYGWIN_NT-6.1-WOW64
# Cygwin 64 bit (Windows 7 64-bit)    CYGWIN_NT-6.1
# MinGW                               MINGW32_NT-6.1
# Interix (Windows Services for UNIX) Interix
# MSYS                                MSYS_NT-6.1
# Android                             Linux
# coreutils                           Linux
# CentOS                              Linux
# Fedora                              Linux
# Gentoo                              Linux
# Red Hat Linux                       Linux
# Linux Mint                          Linux
# openSUSE                            Linux
# Ubuntu                              Linux
# Unity Linux                         Linux
# Manjaro Linux                       Linux
# OpenWRT Barrier Breaker r40420      Linux
# Debian (Linux)                      Linux
# Debian (GNU Hurd)                   GNU
# Debian (kFreeBSD)                   GNU/kFreeBSD
# FreeBSD                             FreeBSD
# NetBSD                              NetBSD
# DragonFlyBSD                        DragonFly
# Haiku                               Haiku
# NonStop                             NONSTOP_KERNEL
# QNX                                 QNX
# ReliantUNIX                         ReliantUNIX-Y
# SINIX                               SINIX-Y
# Tru64                               OSF1
# Ultrix                              ULTRIX
# IRIX 32 bits                        IRIX
# IRIX 64 bits                        IRIX64
# MINIX                               Minix
# Solaris                             SunOS
# UWIN (64 bit Windows 7)             UWIN-W7
# SYS$UNIX:SH on OpenVMS              IS/WB
# z/OS USS                            OS/390
# Cray                                sn5176
# (SCO) OpenServer                    SCO_SV
# (SCO) System V                      SCO_SV
# (SCO) UnixWare                      UnixWare
# IBM AIX                             AIX
# IBM i with QSH                      OS400
# HP-UX                               HP-UX
# 
# author: Liang Gong (gongliang13@cs.berkeley.edu)
#

if [ "$(uname)" == "Darwin" ]; then
    # Do something under Mac OS X platform
    if [ "$(uname -m)" == "x86_64" ]; then
		echo 'Platform: Mac OS 64bit. Proceeding...'
	else
		echo 'Sorry, currently DLint does not fully support Linux. Please use Mac OS 10+ (64bit).'
		exit
	fi
	echo '[Step-1]: Start downloading jalangi...' 
    # install jalangi
	node src/js/install.js
	npm install cli
	npm install stats
	npm install jshint
	npm install xmldom
	npm install doctrine
	npm install jsdom@3.1.2
	npm install node-js-beautify
	# npm install google-search-scraper
	export PATH="`pwd`/scripts/path_unix":$PATH

	# download firefox binary
	echo '[Step-2]: Start downloading instrumented Firefox...' 
	curl -O http://www.eecs.berkeley.edu/~gongliang13/files/Nightly.app.mac.64.zip
	eho 'Start installing instrumented Firefox...'
	# decompress the file
	unzip Nightly.app.mac.64.zip -d thirdparty
	# remove the zip file
	rm Nightly.app.mac.64.zip
	rm -rf thirdparty/__MACOSX

	# compile java code
	echo '[Step-3]: Start compiling Java code...' 
	javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar `pwd`/src/java/evaluation/ExperimentRunner.java
	javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar `pwd`/src/java/evaluation/JalangiFirefoxRunner.java
	javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar `pwd`/src/java/evaluation/OctaneExperimentRunner.java

	# install modified noide
	echo '[Step-4]: Start intalling noide...' 
	cd ..
	git clone https://github.com/JacksonGL/noide.git
	cd noide
	npm install ncp
	npm install less
	npm install vash
	npm install rimraf
	npm install express
	npm install morgan
	npm install chokidar
	npm install socket.io
	npm install browserify
	npm install js-beautify
	npm install body-parser
	npm install cookie-parser
	npm install static-favicon
	npm install emitter-component
	npm run build
	cd ../DLint  
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # Do something under Linux platform
    echo 'Sorry, currently DLint does not fully support Linux. Please use Mac OS 10+ (64bit).'
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    # Do something under Windows NT platform
    echo 'Sorry, currently DLint does not fully support Windows. Please use Mac OS 10+ (64bit).'
else
	echo 'Sorry, currently DLint does not fully support your platform. Please use Mac OS 10+ (64bit).'
fi