function loadHistory(e, callback) {
  var selectedFile = e.target.files[0];
  var reader = new FileReader();
  reader.readAsText(selectedFile);
  reader.addEventListener("load", function() {
    // console.log(reader.result);
    g_history = JSON.parse(reader.result)
    // console.log(g_history);
    callback();
  })
}

function saveHistory() {
  var jsonString = JSON.stringify(g_history);
  var blob = new Blob([jsonString],{type:"text/plain"});
  window.URL = window.URL || window.webkitURL;
  var saveElem = document.getElementById("btn-history-save");
  saveElem.setAttribute("href", window.URL.createObjectURL(blob));
  saveElem.setAttribute("download", "History_" + new Date());
}

function loadMarketHistory(e, callback) {
  var selectedFile = e.target.files[0];
  var reader = new FileReader();
  reader.readAsText(selectedFile);
  reader.addEventListener("load", function() {
    l_history = null;
    switch (document.getElementById("sel-market-file-type").selectedIndex) {
    case 0: l_history = loadCoincheckHistory(reader.result); break;
    case 1: l_history = loadZaifHistory(reader.result); break;
    case 2: l_history = loadBinanceHistory(reader.result); break;
    default: alert("Error: Illigal selection.");
    };
    if (l_history != null && 0 < l_history.length) {
      // console.log(l_history);
      g_history = g_history.concat(l_history);
      // console.log(g_history);
    } else {
      alert("Error: Could not import input file.")
    }
    callback();
  })
}
