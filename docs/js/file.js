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

function downloadCSV() {
  var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  // var blob = new Blob([ bom, convertJsonToCsv(g_historyStr) ], { "type" : "text/csv" });
  var blob = new Blob([ bom, generateHistoryCSV() ], { "type" : "text/csv" });
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, "tax_return_2017.csv");
    window.navigator.msSaveOrOpenBlob(blob, "tax_return_2017.csv");
  } else {
    document.getElementById("download").href = window.URL.createObjectURL(blob);
  }
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
        case 4: l_history = loadOthersHistory(convertCsvToJson(reader.result)); break;
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
          case 4: l_history = loadOthersHistory(imported_history); break;
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
  csv_str = csv_str.replace(/"/g, "");  // at first, delete "
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

function convertJsonToCsv(json) {
  var header = Object.keys(json[0]).join(',') + "\n";
  var body = json.map(function(d){
    return Object.keys(d).map(function(key) {
      return d[key];
    }).join(',');
  }).join("\n");
  return header + body;
}
