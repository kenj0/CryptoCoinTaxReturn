var g_binance_bnb_trade_list = ["NULSBNB", "VENBNB", "ADXBNB", "AIONBNB", "AMBBNB", "BATBNB", "BCCBNB", "BCPTBNB", "BRDBNB", "BTSBNB", "CMTBNB", "CNDBNB", "DLTBNB", "GTOBNB", "ICXBNB", "IOTABNB", "LSKBNB", "MCOBNB", "NAVBNB", "NEBLBNB", "NEOBNB", "OSTBNB", "POWRBNB", "QSPBNB", "RCNBNB", "RDNBNB", "WABIBNB", "WAVESBNB", "WTCBNB", "XLMBNB", "XZCBNB", "YOYOBNB"]
var g_binance_btc_trade_list = ["BNBBTC", "NULSBTC", "CTRBTC", "NEOBTC", "LINKBTC", "SALTBTC", "IOTABTC", "ETCBTC", "KNCBTC", "WTCBTC", "SNGLSBTC", "GASBTC", "SNMBTC", "BQXBTC", "QTUMBTC", "LTCBTC", "ETHBTC", "STRATBTC", "ZRXBTC", "BCCBTC", "OMGBTC", "MCOBTC", "ADABTC", "ADXBTC", "AIONBTC", "AMBBTC", "ARKBTC", "ARNBTC", "ASTBTC", "BATBTC", "BCDBTC", "BCPTBTC", "BNTBTC", "BRDBTC", "BTGBTC", "BTSBTC", "CDTBTC", "CMTBTC", "CNDBTC", "DASHBTC", "DGDBTC", "DLTBTC", "DNTBTC", "EDOBTC", "ELFBTC", "ENGBTC", "ENJBTC", "EOSBTC", "EVXBTC", "FUELBTC", "FUNBTC", "GTOBTC", "GVTBTC", "GXSBTC", "HSRBTC", "ICNBTC", "ICXBTC", "KMDBTC", "LENDBTC", "LRCBTC", "LSKBTC", "LUNBTC", "MANABTC", "MDABTC", "MODBTC", "MTHBTC", "MTLBTC", "NAVBTC", "NEBLBTC", "OAXBTC", "OSTBTC", "POEBTC", "POWRBTC", "PPTBTC", "QSPBTC", "RCNBTC", "RDNBTC", "REQBTC", "SNTBTC", "STORJBTC", "SUBBTC", "TNBBTC", "TNTBTC", "TRXBTC", "VENBTC", "VIBBTC", "WABIBTC", "WAVESBTC", "WINGSBTC", "XLMBTC", "XMRBTC", "XRPBTC", "XVGBTC", "XZCBTC", "YOYOBTC", "ZECBTC"]
var g_binance_eth_trade_list = ["NULSETH", "ASTETH", "EOSETH", "SNTETH", "MCOETH", "OAXETH", "OMGETH", "BQXETH", "WTCETH", "QTUMETH", "BNTETH", "DNTETH", "ICNETH", "SNMETH", "SNGLSETH", "NEOETH", "KNCETH", "STRATETH", "ZRXETH", "FUNETH", "LINKETH", "XVGETH", "IOTAETH", "CTRETH", "SALTETH", "ADAETH", "ADXETH", "AIONETH", "AMBETH", "ARKETH", "ARNETH", "BATETH", "BCCETH", "BCDETH", "BCPTETH", "BNBETH", "BRDETH", "BTGETH", "BTSETH", "CDTETH", "CMTETH", "CNDETH", "DASHETH", "DGDETH", "DLTETH", "EDOETH", "ELFETH", "ENGETH", "ENJETH", "ETCETH", "EVXETH", "FUELETH", "GTOETH", "GVTETH", "GXSETH", "HSRETH", "ICXETH", "KMDETH", "LENDETH", "LRCETH", "LSKETH", "LTCETH", "LUNETH", "MANAETH", "MDAETH", "MODETH", "MTHETH", "MTLETH", "NAVETH", "NEBLETH", "OSTETH", "POEETH", "POWRETH", "PPTETH", "QSPETH", "RCNETH", "RDNETH", "REQETH", "STORJETH", "SUBETH", "TNBETH", "TNTETH", "TRXETH", "VENETH", "VIBETH", "WABIETH", "WAVESETH", "WINGSETH", "XLMETH", "XMRETH", "XRPETH", "XZCETH", "YOYOETH", "ZECETH"]
var g_binance_usdt_trade_list = ["BTCUSDT", "BCCUSDT", "LTCUSDT", "NEOUSDT", "BNBUSDT", "ETHUSDT"]


function convertBinanceMarketCsv(csv_str) {
  var buff = "[";
  var lines = csv_str.split(/\r\n|\r|\n/);
  if (0 < lines.length) {
    var labels = lines[0].split(',');
    for (var i=1; i<lines.length; ++i) {
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
  return buff;
}

function formatBinanceDateTime(datetime) {
  // console.log(datetime);
  dateObj = new Date(datetime + " UTC");  // convert to Local time
  buff = dateObj.getFullYear();
  buff += "/" + ('0' + (dateObj.getMonth() + 1)).slice(-2);
  buff += "/" + ('0' + dateObj.getDate()).slice(-2);
  buff += " " + ('0' + dateObj.getHours()).slice(-2);
  buff += ":" + ('0' + dateObj.getMinutes()).slice(-2);
  buff += ":" + ('0' + dateObj.getSeconds()).slice(-2);
  // console.log(buff);
  return buff;
};

function loadBinanceHistory(csv_str) {
  var binance_history = JSON.parse(convertBinanceMarketCsv(csv_str));
  // console.log(binance_history);
  var l_history = [];
  var first_alert = true;
  for (var i=0; i<binance_history.length; ++i) {
    var transaction = {
      "datetime" : formatBinanceDateTime(binance_history[i].Date),
      "buyCoin" :"",
      "buyAmount" : 0,
      "sellCoin" : "",
      "sellAmount" : 0,
      "isAltTrade" : true,  // allways true for binance market tradeing
      "altJPY" : "---",
      "marketplace" : "Binance",
      "comment" : ("rate=" + binance_history[i].Price)
    };
    var market = "";
    if (g_binance_bnb_trade_list.indexOf(binance_history[i].Market) != -1) {
      market = "BNB";
    } else if (g_binance_btc_trade_list.indexOf(binance_history[i].Market) != -1) {
      market = "BTC";
    } else if (g_binance_eth_trade_list.indexOf(binance_history[i].Market) != -1) {
      market = "ETH";
    } else if (g_binance_usdt_trade_list.indexOf(binance_history[i].Market) != -1) {
      market = "USDT";
    } else {
      if (first_alert) {
        alert("Error: Could not parse Market column."); first_alert = false;
      }
    }
    var key_coin = market;
    var target_coin = binance_history[i].Market.substring(0, binance_history[i].Market.indexOf(market));
    if (getCoinAlias(target_coin) != null) {
      target_coin = getCoinAlias(target_coin);
    }
    var key_coin_price = getJpyPrice(key_coin, transaction["datetime"].split(" ")[0]);
    if (key_coin_price != null) {
      if (binance_history[i].Type == "BUY") {
        transaction["buyCoin"] = target_coin;
        transaction["sellCoin"] = key_coin;
        transaction["buyAmount"] = binance_history[i].Amount;
        transaction["sellAmount"] = binance_history[i].Total;
        transaction["altJPY"] = key_coin_price * binance_history[i].Total;
      } else if (binance_history[i].Type == "SELL") {
        transaction["buyCoin"] = key_coin;
        transaction["sellCoin"] = target_coin;
        transaction["buyAmount"] = binance_history[i].Total;
        transaction["sellAmount"] = binance_history[i].Amount;
        transaction["altJPY"] = key_coin_price * binance_history[i].Total;
      } else {
        if (first_alert) {
          alert("Error: Could not parse Type column."); first_alert = false;
        }
      }
      transaction["comment"] += ", " + key_coin + "/JPY=" + key_coin_price;
      // console.log(binance_history[i]);
      // console.log(transaction);
      l_history.push(transaction);
    } else {
      if (first_alert) {
        alert("Error: Could not apply " + key_coin + " price."); first_alert = false;
      }
    }
  }
  return l_history;
}
