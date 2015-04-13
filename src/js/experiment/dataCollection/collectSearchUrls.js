/*
 * Copyright (c) 2015, University of California, Berkeley
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


// Author: Liang Gong (gongliang13@cs.berkeley.edu)

/*
	Test for google search module
*/

(function() {
	var scraper = require('google-search-scraper');
	// words generated from http://listofrandomwords.com/index.cfm?blist
	/*var words = ['azilian','parodic','armrest','uningestive','bestrewing','bessye','topmast','oftenness','laryngology','idiomatic','prout','polyploid','rewetted','brazer','tirolese','isochronise','implore','erk','phenomenology','underpain','hemicranic','cereal','hand','asses','boracic','monopteros','prerental','gewgaw','whinnied','unconvenable','premention','dysarthric','controlor','soapbark','glossal','interfluent','singlet','goltz','commute','scarabaeid','biannulate','refractional','cemetery','nutrition','edmund','baniya','marette','comely','delphinia','labroid','pur','bertrand','copolymerized','enswathement','mongrelise','orthiconoscope','foeticide','denigration','checker','inhibition','urethan','gey','saltier','xeres','entomologising','perfective','grapier','uncombinative','cerebritis','ranchlike','unrotund','swiveltail','subsecretaries','moreen','apparel','compressively','accedence','erector','romish','handsomeness','coppelia','haver','reutilize','warta','wourali','osiered','citole','preexilic','hametz','penetrably','inexpert','niteri','unleavenable','recalk','staumeral','ninetieth','outbowl','noncapricious','interpolating','shabbiest'];*/
	var words = ['azilian', 'parodic', 'armrest', 'uningestive', 'bestrewing', 'bessye', 'topmast', 'oftenness', 'laryngology', 'idiomatic', 'prout', 'polyploid', 'rewetted', 'brazer', 'tirolese', 'isochronise', 'implore', 'erk', 'phenomenology', 'underpain', 'hemicranic', 'cereal', 'hand', 'asses', 'boracic', 'monopteros', 'prerental', 'gewgaw', 'whinnied', 'unconvenable', 'premention', 'dysarthric', 'controlor', 'soapbark', 'glossal', 'interfluent', 'singlet', 'goltz', 'commute', 'scarabaeid', 'biannulate', 'refractional', 'cemetery', 'nutrition', 'edmund', 'baniya', 'marette', 'comely'];
	// trending words from facebook
	var trendingWords = ['Prince', 'Bill Cosby', 'Kenny Smith', 'Death of Eric Garner', 'McChicken', 'Chicago Bulls', 'Psy', 'Same-sex marriage', 'Dog Whisperer with Cesar Millan', 'Ian McLagan', 'Bevely Johnson', 'Samuel Adams', 'Dimitri Diatchenko', 'Nazca Lines', 'Golden Globe Awards', 'Scott Rudin', 'Pineapple Express', 'Inside Out', 'Question Time', 'Matt Kemp'];
	words = words.concat(trendingWords);
	var resultArray = [];
	var numUrlsPerWord = 1;
	var fs = require('fs');
	var cwd = process.cwd();
	var path = require('path');
	var resFile = path.resolve(cwd + '/' + 'src/js/experiment/dataCollection/urls.txt');
	var totalURL;
	var count = {};
	var urlDB = {};
	var urlRegExp = /http(s)?:\/\/([^\/]+)\//;

	startCollectingUrls();

	function startCollectingUrls() {
		var word;
		resultArray = [];
		for (var i = 0; i < words.length; i++) {
			word = words[i];
			search(word, numUrlsPerWord);
		}
	}

	function writeResult() {
		console.log('Writing results into file:\r\n  ' + resFile);
		fs.writeFileSync(resFile, resultArray.join('\r\n'));
	}

	// search for result
	function search(word, num) {
		totalURL = words.length * num;
		var options = {
			query: word,
			limit: num * 10 // extra 10 to find unique urls
		};

		count[word] = (count[word] | 0);

		console.log('search for results under keyword: ' + word);
		scraper.search(options, function(err, url) {
			// This is called for each result
			if (err) throw err;
			if (count[word] >= numUrlsPerWord)
				return;

			var baseUrl = url.match(urlRegExp);
			// if this base url is already recorded, abandon
			if(urlDB[baseUrl]) return;

			urlDB[baseUrl] = true;
			count[word] ++;

			console.log(url);
			resultArray.push(url);
			console.log(resultArray.length);
			//if (resultArray.length >= totalURL) {
				writeResult();
			//}
		});
	}
})();