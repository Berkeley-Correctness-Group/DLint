var isVis = true;
function f() {
  var p = document.getElementById("p");
  console.log("XX: "+p.style.constructor);
  var newStyle = isVis ? "hidden" : "visibile";  // bug: should be "visible"
  p.style.visibility = newStyle;
  console.log("Changed visibility to "+newStyle+" -- now it is "+p.style.visibility);
  isVis = !isVis
}
