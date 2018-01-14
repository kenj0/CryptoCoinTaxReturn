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
  var splitted_name = selectedFile.name.split('.');
  if (0 < splitted_name.length) {
    var file_type = splitted_name[splitted_name.length - 1].toLowerCase();
    if (file_type == "csv") {
      var l_history = null;
      var reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.addEventListener("load", function() {
        switch (document.getElementById("sel-market-file-type").selectedIndex) {
        case 0: l_history = loadCoincheckHistory(reader.result); break;
        case 1: l_history = loadZaifHistory(convertCsvToJson(reader.result)); break;
        case 2: l_history = loadBitflyerHistory(convertCsvToJson(reader.result)); break;
        case 3: l_history = loadBinanceHistory(convertCsvToJson(reader.result)); break;
        default: alert("Error: Illigal selection.");
        };
        if (l_history != null && 0 < l_history.length) {
          g_history = g_history.concat(l_history);
          callback();
        } else {
          alert("Error: Could not import input file.");
        }
      });
    } else if (file_type == "xls" || file_type == "xlsx") {
      var l_history = null;
      var er = new ExcelJs.Reader(selectedFile, function (e, xlsx) {
        workbook_sheets = xlsx.toJson();
        if (Object.keys(workbook_sheets).length == 1) {
          var imported_history = workbook_sheets[Object.keys(workbook_sheets)[0]];
          switch (document.getElementById("sel-market-file-type").selectedIndex) {
          case 0: l_history = null; /* not supported */ break;
          case 1: l_history = loadZaifHistory(imported_history); break;
          case 2: l_history = loadBitflyerHistory(imported_history); break;
          case 3: l_history = loadBinanceHistory(imported_history); break;
          default: alert("Error: Illigal selection.");
          };
        }
        if (l_history != null && 0 < l_history.length) {
          g_history = g_history.concat(l_history);
          callback();
        } else {
          alert("Error: Could not import input file.");
        }
      });
    } else {
      alert("Error: Input file ext type is not supported.");
    }
  }
}

function convertCsvToJson(csv_str) {
  // Note: asume to that first line is caption.
  var buff = "[";
  var lines = csv_str.split(/\r\n|\r|\n/);
  if (0 < lines.length) {
    var labels = lines[0].split(',');
    for (var i=1; i<lines.length; ++i) { // skip label line
      var cells = lines[i].split(',');
      if (cells.length == labels.length) {
        if (1 < i) { buff += "," }
        buff += "{";
        for (var j=0; j<cells.length; ++j) {
          if (0 < j) { buff += "," }
          buff += "\"" + labels[j] + "\"" + ":";
          if ((cells[j] != "" && isFinite(cells[j])) || cells[j] == "true" || cells[j] == "false") {
            buff += cells[j];
          } else {
            buff += "\"" + cells[j] + "\"";
          }
        }
        buff += "}";
      }
    }
  }
  buff += "]";
  return JSON.parse(buff);
}
