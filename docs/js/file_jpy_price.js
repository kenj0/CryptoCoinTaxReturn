var g_coin_jpy_price_log = null

function loadJpyPriceData(path) {
  g_coin_jpy_price_log = new Array();
  $.get(path, function(csv_str) {
    // console.log(csv_str);
    var lines = csv_str.split(/\r\n|\r|\n/);
    for (var i = 1; i < lines.length; ++i) {  // skip first caption line
      var cells = lines[i].split(",");
      //console.log(cells.length);
      if (16 <= cells.length) {
        var price_data = {
          "date" : cells[0],
          "BTC" : cells[1],
          "ETH" : cells[2],
          "ETC" : cells[3],
          "LSK" : cells[4],
          "FCT" : cells[5],
          "XMR" : cells[6],
          "REP" : cells[7],
          "XRP" : cells[8],
          "ZEC" : cells[9],
          "XEM" : cells[10],
          "LTC" : cells[11],
          "DASH" : cells[12],
          "BCH" : ((cells[13] != "") ? cells[13] : 0),
          "BNB" : ((cells[14] != "") ? cells[14] : 0),
          "USDT" : cells[15]
        };
        g_coin_jpy_price_log.push(price_data);
      }
    }
    // console.log(g_coin_jpy_price_log)
  });
}

window.onload = function() {
  // TODO: support realtime price data applying
  // Note: [{BTC,ETH,ETC,LSC,FCT,XMR,REP,XRP,ZEC,XEM,LTC,DASH,BCH}/JPY] https://coincheck.com/ja/exchange/closing_prices
  // Note: [USD/JPY] https://www.myfxbook.com/ja/forex-market/currencies/USDJPY-historical-data
  // Note: [BNB/USD] https://coinmarketcap.com/currencies/binance-coin/historical-data/?start=20170101&end=20171231
  // Note: [USDT/USD] https://coinmarketcap.com/currencies/tether/historical-data/?start=20170101&end=20171231
  loadJpyPriceData("data/coin_jpy_price_log.csv");
};

function searchJpyPriceData(date) {
  var filtered_data = g_coin_jpy_price_log.filter(function(item, index) {
    if (item.date == date) { return true; }
  });
  if (filtered_data.length == 1) {
    return filtered_data[0];  // found
  }
  return null;  // not found
}

var g_first_alert_for_getJpyPrice = true;

function getJpyPrice(coin, date) {
  search_result = searchJpyPriceData(date);
  if(search_result != null) {
    switch(coin) {
    case "BTC" : return search_result.BTC; break;
    case "ETH" : return search_result.ETH; break;
    case "ETC" : return search_result.ETC; break;
    case "LSK" : return search_result.LSK; break;
    case "FCT" : return search_result.FCT; break;
    case "XMR" : return search_result.XMR; break;
    case "REP" : return search_result.REP; break;
    case "XRP" : return search_result.XRP; break;
    case "ZEC" : return search_result.ZEC; break;
    case "XEM" : return search_result.XEM; break;
    case "LTC" : return search_result.LTC; break;
    case "DASH" : return search_result.DASH; break;
    case "BCH" : return search_result.BCH; break;
    case "BNB" : return search_result.BNB; break;
    case "USDT" : return search_result.USDT; break;
    default: return null;
    }
  } else {
    if (g_first_alert_for_getJpyPrice) {
      alert("Error: Support only 2017/01/01 to 2017/12/31.");
      g_first_alert_for_getJpyPrice = false;
    }
  }
  return null;
};
