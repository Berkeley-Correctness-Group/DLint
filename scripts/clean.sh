#!/bin/bash

# find . -regex '.*.jar' | xargs rm
find . -regex '.*.class' | xargs rm
find . -regex '.*._jalangi_.js' | xargs rm
find . -regex '.*.js_jalangi_sourcemap.json' | xargs rm
find . -regex '.*.js_jalangi_sourcemap.js' | xargs rm
rm -rf jalangi_tmp
rm -rf instrumentFF_tmp
rm -rf websites
rm *.tex
mv exp/ground-truth.json ground-truth.json
rm exp/*
mv ground-truth.json exp/ground-truth.json