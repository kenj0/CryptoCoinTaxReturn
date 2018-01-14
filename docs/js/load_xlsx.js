// https://qiita.com/tomgoodsun/items/bc5f2db3c28e1a6525d2

(function (window, document) {
  window.ExcelJs = {};
  ExcelJs.File = function (_file, _workbook) {
    var that = this;
    var file = _file;
    var workbook = _workbook;

    return {
      getFile: function () {
        return file;
      },
      getWorkbook: function () {
        return workbook;
      },
      toJson: function () {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
          var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          if(roa.length > 0){
            result[sheetName] = roa;
          }
        });
        return result;
      },
      toCsv: function () {
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
          var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
          if(csv.length > 0){
            result.push('SHEET: ' + sheetName);
            result.push('');
            result.push(csv);
          }
        });
        return result.join("\n");
      },
      toFormulae() {
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
          var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
          if(formulae.length > 0){
            result.push('SHEET: ' + sheetName);
            result.push('');
            result.push(formulae.join("\n"));
          }
        });
        return result.join("\n");
      }
    };
  };

  ExcelJs.Reader = function (_file, onload) {
    var that = this;

    var file = _file;
    var reader = new FileReader();

    reader.onload = function(e) {
      var data = e.target.result;

      // データが多いとString.fromCharCode()でMaximum call stack size exceededエラーとなるので、
      // 別途関数で処理をする。
      //var arr = String.fromCharCode.apply(null, new Uint8Array(data));
      var arr = handleCodePoints(new Uint8Array(data));

      if (typeof onload == 'function') {
        onload(e, new ExcelJs.File(file, XLSX.read(btoa(arr), {type: 'base64'})));
      }
    };
    reader.readAsArrayBuffer(file);
  };
})(window, window.document);

// see: https://github.com/mathiasbynens/String.fromCodePoint/issues/1
function handleCodePoints(array) {
  var CHUNK_SIZE = 0x8000; // arbitrary number here, not too small, not too big
  var index = 0;
  var length = array.length;
  var result = '';
  var slice;
  while (index < length) {
    slice = array.slice(index, Math.min(index + CHUNK_SIZE, length)); // `Math.min` is not really necessary here I think
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return result;
}

function renderResult(name, content) {
  var elem = document.getElementById('result');
  var html = elem.innerHTML;
  html += '<h3>' + name + '</h3>';
  html += '<pre>' + content + '</pre>';
  elem.innerHTML = html;
}

/*
document.getElementById('import-excel').addEventListener('change', function (evt) {
  var files = evt.target.files;
  var i, f;
  for (i = 0, f = files[i]; i != files.length; ++i) {
    var er = new ExcelJs.Reader(f, function (e, xlsx) {
      renderResult(xlsx.getFile().name, JSON.stringify(xlsx.toJson(), null, 2));
    });
  }
}, false);
*/
