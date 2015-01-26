
  var completed = 0;
  var benchmarks = BenchmarkSuite.CountBenchmarks();
  var success = true;
  var latencyBenchmarks = ["Splay", "Mandreel"];
  var skipBenchmarks =
          typeof skipBenchmarks === "undefined" ? [] : skipBenchmarks;

  function ShowBox(name) {
    var box = document.getElementById("Box-" + name);
    box.style.visibility = 'visible';
    var bar = document.getElementById("progress-bar").style.width = ""
        + ((++completed) / benchmarks) * 100 + "%";
    latencyBenchmarks.forEach(function(entry) {
      if (name.valueOf() === entry.valueOf()) {
        var box1 = document.getElementById("Box-" + name + "Latency");
        box1.style.visibility = 'visible';
      }
    });
  }

  function AddResult(name, result) {
    console.log(name + ': ' + result);
    var box = document.getElementById("Result-" + name);
    box.innerHTML = result;
  }

  function AddError(name, error) {
    console.log(name + ": " + error.message);
    if (error == "TypedArrayUnsupported") {
      AddResult(name, '<b>Unsupported<\/b>');
    } else if (error == "PerformanceNowUnsupported") {
      AddResult(name, '<b>Timer error<\/b>');
    } else {
      AddResult(name, '<b>Error</b>');
    }
    success = false;
  }

  function AddScore(score) {
    var status = document.getElementById("main-banner");
    if (success) {
      status.innerHTML = "Octane Score: " + score;
    } else {
      status.innerHTML = "Octane Score (incomplete): " + score;
    }
    document.getElementById("progress-bar-container").style.visibility = 'hidden';
    document.getElementById("bottom-text").style.visibility = 'visible';
    document.getElementById("inside-anchor").removeChild(document.getElementById("bar-appendix"));
    document.getElementById("alertbox").style.visibility = 'hidden';
  }

  function Run() {
    document.getElementById("main-banner").innerHTML = "Running Octane...";
    // append the progress bar elements..
    document.getElementById("bar-appendix").innerHTML = "<br/><div class=\"progress progress-striped\" id=\"progress-bar-container\" style=\"visibility:hidden\"><div class=\"bar\"style=\"width: 0%;\" id=\"progress-bar\"></div></div>";
    var anchor = document.getElementById("run-octane");
    var parent = document.getElementById("main-container");
    parent.appendChild(document.getElementById("inside-anchor"));
    parent.removeChild(anchor);

    document.getElementById("startup-text").innerHTML="";

    document.getElementById("progress-bar-container").style.visibility = 'visible';

    BenchmarkSuite.RunSuites({
      NotifyStart : ShowBox,
      NotifyError : AddError,
      NotifyResult : AddResult,
      NotifyScore : AddScore
    },
    skipBenchmarks);
  }

  function CheckCompatibility() {
    // If no Typed Arrays support, show warning label.
    var hasTypedArrays = typeof Uint8Array != "undefined"
        && typeof Float64Array != "undefined"
        && typeof (new Uint8Array(0)).subarray != "undefined";

    if (!hasTypedArrays) {
      console.log("Typed Arrays not supported");
      document.getElementById("alertbox").style.display="block";
    }
    if (window.document.URL.indexOf('skip_zlib=1') >= 0)
      skipBenchmarks.push("zlib");
    if (window.document.URL.indexOf('auto=1') >= 0)
      Run();
  }

  function Load() {
    setTimeout(CheckCompatibility, 200);
  }
