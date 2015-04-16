This document records information and instructions to run experiments for Dlint.
Git markdown online editor: http://jbt.github.io/markdown-editor/


Experimental Configuration
--------------------------
Set environment variable:
```
export PATH="`pwd`/scripts/path_unix":$PATH
```

Run DLint Analysis on Websites
-------------------------------
```
./scripts/dlint_websites.sh
node src/js/experiment/exp-analysis.js
```

Websites urls are listed in ```tests/dlint/urls.txt```.
This will generate all raw experimental data in ```website``` directory in the dlint repository.

Run JSHint Analysis
--------------------------
This command will collect all JSHint warnings for each website collected under the ```website``` directory.
```
node src/js/experiment/runExp.js
```
Due to limited memory (8G) of our current machine,
JSHint results are stored separatedly into each Dlint's 
raw dataset sub-directory (corresponding to each benchmark).

Collect Statistics of JSHint Warnings
--------------------------
This command will collect all JSHint warning distribution information.
```
node src/js/experiment/JSHintStatistics.js
```
Manully organized result is in ```exp/JSHint-statistics.xlsx```

Collect Statistics of DLint Warnings
--------------------------
This command will collect all DLint warning distribution information.
```
node src/js/experiment/DLintStatistics.js
```
Manully organized result is in ```exp/DLint-statistics.xlsx```

Analyzing Warning Matching Statistics for Each Warning Type
--------------------------
This command collects warning matching information for each warning type (Figure 4 in the paper).
```
node src/js/experiment/Experiment1.js
node src/js/experiment/dataAnalysis/WarningTypeStatistics.js
```
Matching statistics will be stored in ```exp/JSHint-DLint-statistics.csv```

Collect Source File Statistics
--------------------------
This command collects those source file statistics listed in the paper.
```
node src/js/experiment/dataAnalysis/SourceFileStatistics.js
```
JavaScript source file statistics will be stored in ```exp/Source-statistics.csv```

Analyzing Warnings Matching Statistics for Each Site:
--------------------------
This command collects warning matching information for each website (Figure 3a in the paper).
```
node src/js/experiment/Experiment1.js
node src/js/experiment/dataAnalysis/WarningPerSiteStatistics.js
```
Matching statistics will be stored in ```exp/Warning-statistics-per-site.csv```


Analyzing Warnings Matching Statistics for Each Site (only for matched warnings):
--------------------------
This command collects warning matching information for each website (Figure 3a, Figure 3b in the paper).
```
node src/js/experiment/Experiment1.js
node src/js/experiment/dataAnalysis/MatchedWarningPerSiteStatistics.js
```
Matching statistics will be stored in ```exp/Matched-Warning-statistics-per-site.csv```
and ```exp/Matched-analysis.json```

Analyzing Warnings Matching Statistics for Each Site and Each Analysis Type:
--------------------------
This command collects warning matching information for each website (Figure 3a, Figure 3b in the paper).
```
node src/js/experiment/Experiment1.js
node src/js/experiment/dataAnalysis/WarningPerTypePerSiteStatistics.js
```
Matching statistics will be stored in ```exp/Warning-statistics-per-analysis-per-site.csv```

Collect Runtime Statistics:
--------------------------
This command collects coverage statisitcs (Figure 3c in the paper).
```
node src/js/experiment/dataAnalysis/RuntimeSourceStatistics.js
```
Result will be stored in ```exp/Runtime-statistics.csv```

Collect Timing Statistics:
--------------------------
This command collects running time of DLint on each website (Figure 3d in the paper).
```
node src/js/experiment/dataAnalysis/TimeStatistics.js
```
Result will be stored in ```exp/Time-statistics.csv```


Analyze JShint warning to static source information:
--------------------------
```
node src/js/experiment/dataAnalysis/JSHint2SourceStatistics.js
```
Result will be stored in ```exp/JSHint-Source-statistics.csv```


Count the souce code in DLint
--------------------------
These commands collect source code statistics of DLint.
The following command counts JavaScript code:
```
find . -regex '.*\.js' -a ! -name '*_jalangi_*.js' -a ! -path '*octane*.js' -a ! -path '*sunspider*.js' -a ! -path '*tizen_firefox*' -a ! -path '*sunspider*' -a ! -path '*octane*' -a ! -path '*jslint/JSLint*' -a ! -path '*jquery_test*' -a ! -path '*websites_stored_code*' ! -path '*webLintTest*' | xargs wc -l
``` 
result: 28694 total

The following command counts Java code:
```
find . -regex '.*\.java' | xargs wc -l
``` 
result: 814 total

The following command counts bash code:
```
find . -regex '.*\.sh' | xargs wc -l
``` 
result: 100 total

Generate documentation of dlint checkers
----------------------------------------
This commands generate Table 1-5 in the paper. 
To generate a file that summarizes all dlint checkers, run the following from the jalangi-dlint directory:
```
node scripts/generate_dlint_readme.js
```
It creates ```README_DLint_Checkers.md``` and ```.tex``` files (for the paper) in the DLint project root directory.



Websites Checked So Far
--------------------------
```
http://www.tacklewarehouse.com/Fat_Sack_Tackle_Company_Fizzle_Jig/descpage-FSTCFJ.html
https://niagarafallshilton.com/ratesCalendar/
http://seattletimes.com/html/localpages/2018327065_seattle-liquor-price-changes.html?cmpid=2628
http://investor.apple.com/stockquote.cfm
http://www.rampubcompany.co.uk/apply-online
http://data.cnbc.com/quotes/JRCC
http://money.cnn.com/data/markets/
http://finance.yahoo.com/
http://live.com
http://www.capetownlodge.co.za/restaurant/
http://www.ssbadger.com/
http://www.nasdaq.com/quotes/stock-charts.aspx
http://money.cnn.com/data/markets/
http://www.investopedia.com/university/stocks/stocks4.asp
http://www.google.com/finance
http://investor.shareholder.com/JPMorganChase/stocklookup.cfm
http://ir.teslamotors.com/stocklookup.cfm
http://www.dailyfinance.com/stock-quotes/
http://semantic-ui.com/
http://facebook.github.io/react/docs/getting-started.html
http://facebook.github.io/react/index.html
https://cloud.google.com/appengine/docs
http://webix.com/
http://www.hongkiat.com/blog/google-labs-experiments/
http://www.technologyreview.com/tagged/javascript/
http://vk.com/
http://www.nielsen.com/us/en.html
https://www.bauermedia.com/en/company/
http://www.google.com/chrome/
https://www.google.com/intx/en/work/apps/business/index.html?utm_source=google_products&utm_medium=et&utm_campaign=smb_apps
http://news.google.com/nwshp?hl=en
https://play.google.com/store
http://www.google.com/trends/?hl=en
https://www.mozilla.org/en-US/
https://angularjs.org/
https://github.com/
http://emberjs.com/
http://ace.c9.io/#nav=about
http://repl.it/languages/Python
http://madebyevan.com/webgl-water/
http://linkedin.com
http://ebay.com
http://www.craiglist.org/about/sites
http://bl.ocks.org/mbostock/raw/4061502/
http://mbostock.github.io/d3/talk/20111116/airports.html
http://bl.ocks.org/mbostock/raw/4060606/
http://mbostock.github.io/d3/talk/20111018/tree.html
http://mbostock.github.io/d3/talk/20111018/treemap.html​
http://www.google.com
http://www.amazon.com
http://www.yahoo.com
http://www.baidu.com
https://www.wikipedia.org/
http://twitter.com/
http://linkedin.com
http://taobao.com
http://blogspot.com
http://tmall.com
http://vk.com
http://ebay.com
http://bing.com
https://www.polymer-project.org/
http://beta.unity3d.com/jonas/AngryBots/
https://www.flickr.com/explore/
http://www.youtube.com/
http://www.disneystore.com/toys/mn/1000208/
http://www.comscore.com/
http://www.similarweb.com/
http://www.similarweb.com/website/yelp.com
https://www.airbnb.com/
http://www.twitch.tv/
https://www.quora.com/
https://instagram.com/accounts/login/
https://www.uber.com/en-US/
http://www.memsql.com/?gclid=CMO89qfV3cECFUeBfgodII4AZA
http://captricity.com/
http://www.papyrusly.com/books
http://www.papyrusly.com/
http://www.dotandbo.com/
https://www.doordash.com/
http://sobrr.me
https://www.bitcasa.com/
https://www.dropbox.com/business
https://www.affirm.com/
http://turnitin.com/
https://www.okta.com/product/
http://www.bloomberg.com/markets/stocks/world-indexes/americas/
http://www.bloomberg.com/markets/stocks/
http://www.bloomberg.com/markets/stocks/
http://dictionary.reference.com/browse/un+ingestive
http://www.thefreedictionary.com/parodic
http://en.wikipedia.org/wiki/Armrest
http://archaeology.about.com/od/upperpaleolithic/qt/Azilian-Culture.htm
http://www.thesaurus.com/browse/bestrewing
https://www.linkedin.com/pub/bessye-adams/7/71a/165
http://www.merriam-webster.com/dictionary/oftenness
http://en.wiktionary.org/wiki/idiomatic
http://www.topmastresort.com/
http://www.alahns.org/
http://www.scrabblefinder.com/word/rewetted/
http://www.prout.org/
http://www.nature.com/scitable/topicpage/polyploidy-1552814
http://www.brazzers.com/
http://www.solverscrabble.com/words-ending-with-isochronise/
http://www.handonline.org/
http://www.cockneyrhymingslang.co.uk/slang/boracic_lint
http://www.collinsdictionary.com/dictionary/english/whinnied
http://www.city-data.com/forum/renting/961441-pre-rental-application-info-concern.html
http://www.mayoclinic.org/diseases-conditions/dysarthria/basics/definition/con-20035008
http://www.howmanysyllables.com/words/unconvenable
http://www.imdb.com/title/tt0477071/
http://www.banyanmedicalsystems.com/controlor.html
http://www.burtsbees.com/Soap-Bark-Chamomile-Deep-Cleansing-Cream/88999-00-1,default,pd.html
http://www.medicinenet.com/script/main/art.asp?articlekey=25486
http://dictionary.infoplease.com/interfluent
http://www.goltzjudo.com/
http://mnemonicdictionary.com/word/scarabaeid%20beetle
http://www.edmunds.com/
http://www.nutrition.gov/
http://shop.lululemon.com/products/clothes-accessories/tanks-no-support/105-F-Singlet-Silver
http://www.sunsetviewcemetery.com/
http://www.baniyamatrimony.com/
http://www.ohcomely.co.uk/
http://www.dslreports.com/forum/r23164790-No-marette-connecting-ground-wires-is-this-dangerous-
http://billcosby.com/
http://prince.org/
http://kennythejetsmith.com/
http://www.mcdonalds.ca/ca/en/menu/full_menu/sandwiches/mcchicken.html
http://www.nba.com/bulls/
http://www.ianmclagan.com/
http://www.cesarsway.com/dog-whisperer/Dog-Whisperer-with-Cesar-Millan-Final-Season
http://www.samueladams.com/
http://www.goldenglobes.com/
http://www.nascaperu.com/es/turismo-peru-nasca/lineas-de-nasca-peru
http://www.leafly.com/hybrid/pineapple-express
http://www.baseball-reference.com/players/k/kempma01.shtml
http://www.bbc.co.uk/programmes/b006t1q9
http://www.buzzfeed.com/matthewzeitlin/scott-rudin-on-obama-i-bet-he-likes-kevin-hart
http://www.bluespringwellness.com/Testimonials
http://www.ikea.com/ms/en_SG/campaigns/2015/evenlowerprices.html
http://www.ebay.com/itm/Matte-Black-PVD-Shark-Mesh-Watch-Band-Strap-fits-Seiko-18mm-20mm-22mm-24mm-/161475533202
http://spinellissauceco.com/?page_id=80
http://www.codeuridea.com/package/order
http://p2pool.palim.eu:9555/static/
https://www.ccnex.com/
http://www.bloomberg.com/quote/AFIMOFC:FP
https://www.ccnex.com/trade/MCL/quick
http://www.uconnhuskies.com/sports/m-baskbl/recaps/112113aaa.html
http://hazentech.com/about-us-facts
```

Websites from google top search results of random words and facebook trending terms:

```
http://dictionary.reference.com/browse/un+ingestive
http://www.thefreedictionary.com/parodic
http://en.wikipedia.org/wiki/Armrest
http://archaeology.about.com/od/upperpaleolithic/qt/Azilian-Culture.htm
http://www.thesaurus.com/browse/bestrewing
https://www.linkedin.com/pub/bessye-adams/7/71a/165
http://www.merriam-webster.com/dictionary/oftenness
http://en.wiktionary.org/wiki/idiomatic
http://www.topmastresort.com/
http://www.alahns.org/
http://www.scrabblefinder.com/word/rewetted/
http://www.prout.org/
http://www.nature.com/scitable/topicpage/polyploidy-1552814
http://www.brazzers.com/
http://www.solverscrabble.com/words-ending-with-isochronise/
http://it.wikipedia.org/wiki/Tirolo
http://www.vocabulary.com/dictionary/implore
http://www.urbandictionary.com/define.php?term=Erk
http://plato.stanford.edu/entries/phenomenology/
http://www.ncbi.nlm.nih.gov/pubmed/1815538
http://dictionary.cambridge.org/us/dictionary/british/on-under-pain-of-death
http://www.walmart.com/browse/food/cereal/976759_976783_1001339
http://www.menprovement.com/ass-pictures/
http://www.handonline.org/
http://www.cockneyrhymingslang.co.uk/slang/boracic_lint
https://plus.google.com/109265249603286971071/about?gl=us&hl=en
http://www.oxforddictionaries.com/definition/english/gewgaw
http://www.collinsdictionary.com/dictionary/english/whinnied
http://www.city-data.com/forum/renting/961441-pre-rental-application-info-concern.html
http://www.mayoclinic.org/diseases-conditions/dysarthria/basics/definition/con-20035008
http://www.howmanysyllables.com/words/unconvenable
http://www.imdb.com/title/tt0477071/
http://www.banyanmedicalsystems.com/controlor.html
http://www.burtsbees.com/Soap-Bark-Chamomile-Deep-Cleansing-Cream/88999-00-1,default,pd.html
http://www.medicinenet.com/script/main/art.asp?articlekey=25486
http://dictionary.infoplease.com/interfluent
http://www.commute.org/
http://www.goltzjudo.com/
http://www.yourdictionary.com/biannulate
http://mnemonicdictionary.com/word/scarabaeid%20beetle
http://medical-dictionary.thefreedictionary.com/refractional
http://www.edmunds.com/
http://www.nutrition.gov/
http://shop.lululemon.com/products/clothes-accessories/tanks-no-support/105-F-Singlet-Silver
http://www.sunsetviewcemetery.com/
http://www.baniyamatrimony.com/
http://www.ohcomely.co.uk/
http://www.dslreports.com/forum/r23164790-No-marette-connecting-ground-wires-is-this-dangerous-
http://billcosby.com/
http://prince.org/
http://kennythejetsmith.com/
http://www.mcdonalds.ca/ca/en/menu/full_menu/sandwiches/mcchicken.html
http://www.bbc.com/news/uk-england-london-30424338
http://www.cnn.com/2013/05/28/us/same-sex-marriage-fast-facts/
http://www.youtube.com/user/officialpsy
http://www.nba.com/bulls/
http://www.ianmclagan.com/
http://www.cesarsway.com/dog-whisperer/Dog-Whisperer-with-Cesar-Millan-Final-Season
http://www.samueladams.com/
http://www.dimitrid.com/
http://www.beverlyjohnson.com/
http://www.goldenglobes.com/
http://www.nascaperu.com/es/turismo-peru-nasca/lineas-de-nasca-peru
http://www.leafly.com/hybrid/pineapple-express
https://www.facebook.com/PixarInsideOut
http://www.baseball-reference.com/players/k/kempma01.shtml
http://www.bbc.co.uk/programmes/b006t1q9
http://www.buzzfeed.com/matthewzeitlin/scott-rudin-on-obama-i-bet-he-likes-kevin-hart
```
Analysis Data
----------------------
All experimental data is uploaded to Berkeley Box, which are availabe at the following link (only members of this project have access to the content in the following link):  
https://berkeley.app.box.com/files/0/f/2700044051/websites

Experiment Script
----------------------
Run the following script to collect all dataset:
```
./scripts/dlint_websites.sh
node exp/exp-analysis.js
mv websites ~/Box\ Sync/
node src/js/experiment/runExp.js
node src/js/experiment/JSHintStatistics.js
node src/js/experiment/DLintStatistics.js
node src/js/experiment/Experiment1.js
node src/js/experiment/AnalyseMatchingStatistics.js
```


Ranked Websites
----------------------
Data from: Alexa.com
and: https://www.quantcast.com/top-sites/US

Top 10 websites:
```
http://www.google.com
https://www.facebook.com/
https://www.youtube.com/
https://www.yahoo.com/
http://www.baidu.com/
http://www.amazon.com/
http://www.wikipedia.org/
http://www.taobao.com/
https://twitter.com/
http://www.qq.com/
```

Top 45-55 websites:
```
http://home.ijreview.com/
http://www.drugs.com/
https://vimeo.com/
http://www.usmagazine.com/
http://www.ask.com/
http://us.norton.com/
http://www.legacy.com/ns/
http://www.target.com/
http://www.ups.com/?Site=Corporate&cookie=us_en_home&inputImgTag=&setCookie=yes
https://www.wellsfargo.com/
```


Top 100-110 websites:
```
http://www.tudou.com/
http://www.china.com/
http://Indiatimes.com
http://Pixnet.net
http://Livedoor.com
http://Nytimes.com
http://Github.com
http://Dailymail.co.uk
http://Buzzfeed.com
http://Filmon.com
```

Top 490-500
```
http://Ucoz.ru
http://Chip.de
http://Ink361.com
http://Detik.com
http://Gmarket.co.kr
http://Shopclues.com
http://www.aliexpress.com/
http://Cloudfront.net
http://Livedoor.biz
http://bttrack.com
```

Top 1000-1010
```
http://latinpost.com
http://recruitics.com
http://northerntool.com
http://liquor.com
http://crateandbarrel.com
http://karpacz.pl
http://reviewed.com
http://purplemath.com
http://ifbyphone.com
http://squaretrade.com
http://www.cafepress.com/
```

Top 5000-5010
```
https://us.axa.com/home.html
http://shanghaiist.com/
http://siouxcityjournal.com/
http://www.sheplers.com/
http://www.smarter.com/
http://www.kodak.com/ek/US/en/Home.htm
http://www.newportnaturalhealth.com/
http://www.guidingtech.com/
http://www.simpletruths.com/
http://torchmusic.fm/
```

Top 10000-10010
```
http://jessicalondon.com
http://dogfart.co
http://cdn-hotels.com
http://smartbargains.com
http://bevmo.com
http://truckpaper.com
http://vovici.com
http://mercedsunstar.com
http://salemnews.com
http://www.givemesport.com
http://www.mdlinx.com
```

Top 50000-50010
```
http://mexico.cnn.com/
http://cityads.ru/
http://www.cmbinfo.com/
http://cmumavericks.com/
http://www.clubinfernodungeon.com/
http://clubcrossdressing.com/
http://cnnw.com/
http://cloudstor.es/
http://www.claimsjournal.com/
http://cleansecaps.com/
http://christmastruce.co.uk/
http://www.christmaswow.com/

```

Top 100000-100010
```
http://ranaryan.com
http://britishmedicaljobs.com
http://brokenboxr.com
http://canadianobituaries.com
http://durhamrescuemission.org
http://leadermarket.net
http://lazyoaf.com
http://rapcoindustries.com
http://rapp.com
http://briovarx.com
```
