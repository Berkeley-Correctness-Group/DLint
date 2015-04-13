// Author: Michael Pradel (michael@binaervarianz.de)
// Refactored: Liang Gong (gongliang13@cs.berkeley.edu)

/*
 * Generates a summary of all checkers (README_DLint_Checkers.md)
 * and a LaTeX table that summarizes all checkers.
 */

(function() {

    var fs = require('fs');
    var doctrine = require('doctrine');

    var analysesDir = "src/js/analyses/dlint/";
    var excludedFiles = ["utils", "analyses.txt", "DLintPre.js", "DLintPost.js", "ExeStat.js", "Timer.js", "files", "jsBuiltinFunctionChecker"];

    var readMeMDFile = "README_DLint_Checkers.md";
    var latexFilePrefix = "checkers_";
    var latexMacroFile = "checker_name_macros.tex";
    var footnoteOverallIdx = 1;

    function getNextFootNoteIdx() {
        return footnoteOverallIdx++;
    }

    var tagToMD = {
        "dlintNeedDynamic":"<span style='background-color:LawnGreen'>NeedDynamic</span>",
        "dlintMayNeedDynamic":"<span style='background-color:Gold'>MayNeedDynamic</span>",
        "dlintCanCheckStatically":"<span style='background-color:Coral'>CanCheckStatically</span>",
        "dlintObsolete":"<span style='background-color:IndianRed'>Obsolete</span>",
        "dlintSingleEventPattern":"<span style='background-color:LightBlue'>SingleEventPattern</span>",
        "dlintMultiEventPattern":"<span style='background-color:LightCyan'>MultiEventPattern</span>"
    };

    var tagToScore = {
        "dlintNeedDynamic":5,
        "dlintMayNeedDynamic":1,
        "dlintCanCheckStatically":-1,
        "dlintObsolete":-5,
        "dlintSingleEventPattern":0,
        "dlintMultiEventPattern":0
    };

    function CheckerDoc(name, shortName, shortDescr, longDescr, rule, pattern, tags, group) {
        this.name = name;
        this.shortName = shortName;
        this.shortDescr = shortDescr;
        this.longDescr = longDescr;
        this.rule = rule;
        this.pattern = pattern;
        this.tags = tags || {};
        this.group = group;
    }

    var groupToAbbreviation = {
        "UncommonValue":"V",
        "LanguageMisuse":"L",
        "APIMisuse":"A",
        "Inheritance":"I",
        "TypeError":"T"
    };

    function findCheckerFiles() {
        return fs.readdirSync(analysesDir).filter(function(name) {
            return excludedFiles.indexOf(name) === -1;
        });
    }

    function parseCheckerFile(fileName) {
        console.log(analysesDir + fileName);
        var code = fs.readFileSync(analysesDir + fileName, "utf8");
        var checkerDoc = new CheckerDoc(fileName.replace(/\.js$/, ""));
        var content;
        var footnotes = [];
        doctrine.parse(code, {
            unwrap:true
        }).tags.forEach(function(tag) {
                  if (tag.description) {
                      content = tag.description.slice(1, tag.description.length - 1);
                      content = processFootnote(content, footnotes);
                  }
                  if (tag.title === "dlintShort") {
                      checkerDoc.shortDescr = content;
                  } else if (tag.title === "dlintLong") {
                      checkerDoc.longDescr = content;
                  } else if (tag.title === "dlintPattern") {
                      checkerDoc.pattern = content;
                  } else if (tag.title === "dlintRule") {
                      checkerDoc.rule = content;
                  } else if (tag.title === "dlintShortName") {
                      checkerDoc.shortName = content;
                  } else if (tag.title === "dlintGroup") {
                      checkerDoc.group = content;
                  } else if (tag.title.indexOf("dlint") !== -1) {
                      checkerDoc.tags[tag.title] = true;
                  }
              });
        checkerDoc.footnotes = footnotes;
        return checkerDoc;
    }

    // added to support generating footnote in the latex table
    // if the content contains \tnote{} tags
    // preprocess it
    // \tnote{content} -> \tnote{x}  (x is calculated footnote index)
    // also add the following content behind the tabular if \tnote exists:
    /*
     \begin{tablenotes}
     \item [x] content
     \end{tablenotes}
     */
    function processFootnote(content, footnotes) {
        var beginPattern = '\\tnote\{',
              endPattern = '\}';
        var beginIdx, endIdx, footnoteContent, contentPrefix, contentSuffix;
        var footnoteIdx, idx = -1;
        while ((idx = content.indexOf(beginPattern, idx + 1)) >= 0) {
            beginIdx = content.indexOf(beginPattern, idx) + beginPattern.length;
            // search for ending }
            endIdx = getEndIdx(content, beginIdx);
            //endIdx = content.indexOf(endPattern, idx);
            footnoteContent = content.substring(beginIdx, endIdx);
            contentPrefix = content.substring(0, beginIdx);
            contentSuffix = content.substring(endIdx, content.length);
            footnoteIdx = getNextFootNoteIdx();
            // replace 'prefix \tnote{content} suffix' with 'prefix \tnote{x} suffix'
            content = contentPrefix + footnoteIdx + contentSuffix;
            footnotes.push({content:footnoteContent, index:footnoteIdx});
        }
        return content;
    }

    function getEndIdx(content, beginIdx) {
        var endIdx, bracketCnt = 0;
        var searchIdx = beginIdx, proceed = true;
        endIdx = content.length;
        while (proceed) {
            if (content[searchIdx] === '{') {
                bracketCnt++;
            } else if (content[searchIdx] === '}') {
                if (bracketCnt === 0) {
                    endIdx = searchIdx;
                    proceed = false;
                } else {
                    bracketCnt--;
                }
            } else if (content[searchIdx] === '\\') {
                searchIdx++;
            }
            if (++searchIdx >= content.length) {
                proceed = false;
            }
        }
        return endIdx;
    }

    /* unite test code for parsing footnote
     var content = "@dlintRule{Avoid multiple consecutive empty spaces in regular expressions, as they are hard to read\\tnote{Two consecutive empty spaces should be refactored as ``\\code{ \\{2\\}}}''.}";
     var footnote = [];
     processFootnote(content, footnote);
     */

    function generateReadMeMD(checkerDocs) {
        var result = "##DLint Checkers\n";
        result += "Generated on " + Date() + "\n\n";
        // summarize tags
        var tagToNb = {};
        checkerDocs.forEach(function(checkerDoc) {
            Object.keys(checkerDoc.tags).forEach(function(tag) {
                tagToNb[tag] = (tagToNb[tag] || 0) + 1;
            });
        });
        result += "**Summary**: ";
        result += Object.keys(tagToNb).map(function(tag) {
            return [tag, tagToNb[tag]];
        }).sort(function(a, b) {
            return tagToScore[b[0]] - tagToScore[a[0]];
        }).map(function(tagAndNb) {
            return tagAndNb[1] + "x " + tagToMD[tagAndNb[0]];
        }).join(", ") + "\n\n";

        var checkerID = 1;
        // main part: document each checker
        checkerDocs.forEach(function(checkerDoc) {
            result += "--------\n";
            result += "#### Chk-" + (checkerID++) + ". " + checkerDoc.name + "\n";
            if (checkerDoc.shortDescr)
                result += checkerDoc.shortDescr + "\n\n";
            if (checkerDoc.longDescr)
                result += checkerDoc.longDescr + "\n\n";
            if (checkerDoc.pattern)
                result += "*Pattern:*\n```\n" + checkerDoc.pattern.replace(/\$/g, "") + "\n```\n\n";
            result += Object.keys(checkerDoc.tags).map(function(tag) {
                if (tagToMD[tag]) return tagToMD[tag];
                else throw "Unexpected tag: " + tag;
            }).join(", ") + "\n\n";
        });
        fs.writeFileSync(readMeMDFile, result);
    }

    function toLaTeX(checkerDoc, id) {
        // insert camel case-based hyphenation hints to LaTeX
        var name = "";
        for (var i = 0; i < checkerDoc.shortName.length; i++) {
            var c = checkerDoc.shortName[i];
            if (c === c.toUpperCase()) {
                name += "\\-" + c;
            } else {
                name += c;
            }
        }

        var pattern = "$" + checkerDoc.pattern.
                    replace(/AND/g, "~\\wedge\\allowbreak~").
                    replace(/ORR/g, "\\linebreak").
                    replace(/OR/g, "~\\vee~").
                    replace(/WHERE/g, "~|~") + "$";

        return id + " & " + name + "&" + checkerDoc.rule + " & " + pattern;
    }

    function generateLaTeXSummaries(allCheckerDocs) {
        var checkerDocs = allCheckerDocs.filter(function(checkerDoc) {
            return (!("dlintObsolete" in checkerDoc.tags) && ("dlintSingleEventPattern" in checkerDoc.tags || "dlintMultiEventPattern" in checkerDoc.tags));
        }).sort(function(checkerDoc1, checkerDoc2) {
            if (checkerDoc1.shortName === undefined || checkerDoc2.shortName === undefined) throw "Short name is undefined";
            return checkerDoc1.shortName < checkerDoc2.shortName ? -1 : 1;
        });

        var latexMacros = ["% Generated from dlint checkers on " + Date()];
        var totalCheckers = 0;
        Object.keys(groupToAbbreviation).forEach(function(group) {
            var nbCheckers = generateLaTeXSummary(checkerDocs.filter(function(checkerDoc) {
                return checkerDoc.group === group;
            }), latexFilePrefix + group + ".tex", latexMacros, group);
            totalCheckers += nbCheckers;
        });
        latexMacros.push("\\newcommand{\\NumDLintRules}{" + totalCheckers + "}");
        fs.writeFileSync(latexMacroFile, latexMacros.join("\n"));
    }

    function generateLaTeXSummary(checkerDocs, latexFileName, latexMacros, group) {
        var singleEventCheckerDocs = checkerDocs.filter(function(checkerDoc) {
            return checkerDoc.tags.hasOwnProperty("dlintSingleEventPattern");
        });
        var multiEventCheckerDocs = checkerDocs.filter(function(checkerDoc) {
            return checkerDoc.tags.hasOwnProperty("dlintMultiEventPattern");
        });
        var hasBoth = singleEventCheckerDocs.length > 0 && multiEventCheckerDocs.length > 0;
        var footnotes = [];

        var idCtr = 0;
        var result = "% Generated from dlint checkers on " + Date() + "\n";
        result += "\\begin{tabular}{@{} l p{6em}>{\\raggedright\\arraybackslash}p{17em}>{\\raggedright\\arraybackslash} p{29em} @{}}\n";
        result += "\\toprule\n";
        result += "ID & Name & Code quality rule & Runtime event predicate(s) \\\\\n";
        result += "\\midrule\n";
        if (hasBoth) {
            result += "\\multicolumn{4}{@{}l@{}}{\\emph{Single-event patterns:}}\\\\\n";
            result += "\\midrule\n";
        }
        singleEventCheckerDocs.forEach(function(checkerDoc) {
            if (checkerDoc.footnotes) {
                footnotes = footnotes.concat(checkerDoc.footnotes);
            }
            var id = groupToAbbreviation[checkerDoc.group] + (++idCtr);
            result += toLaTeX(checkerDoc, id) + "\\\\\n";
            latexMacros.push("\\newcommand{\\" + checkerDoc.shortName + "}{Checker~" + id + "}");
        });
        if (hasBoth) {
            result += "\\midrule\n";
            result += "\\multicolumn{4}{@{}l@{}}{\\emph{Multi-event patterns:}}\\\\\n";
            result += "\\midrule\n";
        }
        multiEventCheckerDocs.forEach(function(checkerDoc) {
            if (checkerDoc.footnotes) {
                footnotes = footnotes.concat(checkerDoc.footnotes);
            }
            var id = groupToAbbreviation[checkerDoc.group] + (++idCtr);
            result += toLaTeX(checkerDoc, id) + "\\\\\n";
            latexMacros.push("\\newcommand{\\" + checkerDoc.shortName + "}{Checker~" + id + "}");
        });
        result += "\\bottomrule\n";
        result += "\\end{tabular}\n";
        // if exist, append footnotes to the table
        if (footnotes.length > 0) {
            result += "\\begin{tablenotes}\n";
            for (var i = 0; i < footnotes.length; i++) {
                result += "\\item [" + footnotes[i].index + "] " + footnotes[i].content + "\n";
            }
            result += "\\end{tablenotes}\n";
        }

        fs.writeFileSync(latexFileName, result);

        latexMacros.push("\\newcommand{\\Num" + group + "Checkers}{" + idCtr + "}");
        return idCtr;
    }

    function tagsToScore(tags) {
        var result = 0;
        Object.keys(tags).forEach(function(tag) {
            var score = tagToScore[tag];
            if (score !== undefined) result += score;
            else throw new Error("Unexpected tag: " + tag);
        });
        return result;
    }

    function sortDocs(checkerDocs) {
        return checkerDocs.sort(function(a, b) {
            var scoreOrder = tagsToScore(b.tags) - tagsToScore(a.tags);
            return scoreOrder !== 0 ? scoreOrder : (a.name < b.name ? -1 : 1);
        });
    }

    // main part
    var checkerDocs = [];
    findCheckerFiles().forEach(function(fileName) {
        var checkerDoc = parseCheckerFile(fileName);
        if (checkerDoc) {
            checkerDocs.push(checkerDoc);
        }
    });
    checkerDocs = sortDocs(checkerDocs);
    generateReadMeMD(checkerDocs);
    generateLaTeXSummaries(checkerDocs);


})();