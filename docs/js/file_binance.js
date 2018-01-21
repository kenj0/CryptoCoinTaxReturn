var g_binance_bnb_trade_list = ["NULSBNB", "VENBNB", "ADXBNB", "AIONBNB", "AMBBNB", "BATBNB", "BCCBNB", "BCPTBNB", "BRDBNB", "BTSBNB", "CMTBNB", "CNDBNB", "DLTBNB", "GTOBNB", "ICXBNB", "IOTABNB", "LSKBNB", "MCOBNB", "NAVBNB", "NEBLBNB", "NEOBNB", "OSTBNB", "POWRBNB", "QSPBNB", "RCNBNB", "RDNBNB", "WABIBNB", "WAVESBNB", "WTCBNB", "XLMBNB", "XZCBNB", "YOYOBNB"]
var g_binance_btc_trade_list = ["BNBBTC", "NULSBTC", "CTRBTC", "NEOBTC", "LINKBTC", "SALTBTC", "IOTABTC", "ETCBTC", "KNCBTC", "WTCBTC", "SNGLSBTC", "GASBTC", "SNMBTC", "BQXBTC", "QTUMBTC", "LTCBTC", "ETHBTC", "STRATBTC", "ZRXBTC", "BCCBTC", "OMGBTC", "MCOBTC", "ADABTC", "ADXBTC", "AIONBTC", "AMBBTC", "ARKBTC", "ARNBTC", "ASTBTC", "BATBTC", "BCDBTC", "BCPTBTC", "BNTBTC", "BRDBTC", "BTGBTC", "BTSBTC", "CDTBTC", "CMTBTC", "CNDBTC", "DASHBTC", "DGDBTC", "DLTBTC", "DNTBTC", "EDOBTC", "ELFBTC", "ENGBTC", "ENJBTC", "EOSBTC", "EVXBTC", "FUELBTC", "FUNBTC", "GTOBTC", "GVTBTC", "GXSBTC", "HSRBTC", "ICNBTC", "ICXBTC", "KMDBTC", "LENDBTC", "LRCBTC", "LSKBTC", "LUNBTC", "MANABTC", "MDABTC", "MODBTC", "MTHBTC", "MTLBTC", "NAVBTC", "NEBLBTC", "OAXBTC", "OSTBTC", "POEBTC", "POWRBTC", "PPTBTC", "QSPBTC", "RCNBTC", "RDNBTC", "REQBTC", "SNTBTC", "STORJBTC", "SUBBTC", "TNBBTC", "TNTBTC", "TRXBTC", "VENBTC", "VIBBTC", "WABIBTC", "WAVESBTC", "WINGSBTC", "XLMBTC", "XMRBTC", "XRPBTC", "XVGBTC", "XZCBTC", "YOYOBTC", "ZECBTC"]
var g_binance_eth_trade_list = ["NULSETH", "ASTETH", "EOSETH", "SNTETH", "MCOETH", "OAXETH", "OMGETH", "BQXETH", "WTCETH", "QTUMETH", "BNTETH", "DNTETH", "ICNETH", "SNMETH", "SNGLSETH", "NEOETH", "KNCETH", "STRATETH", "ZRXETH", "FUNETH", "LINKETH", "XVGETH", "IOTAETH", "CTRETH", "SALTETH", "ADAETH", "ADXETH", "AIONETH", "AMBETH", "ARKETH", "ARNETH", "BATETH", "BCCETH", "BCDETH", "BCPTETH", "BNBETH", "BRDETH", "BTGETH", "BTSETH", "CDTETH", "CMTETH", "CNDETH", "DASHETH", "DGDETH", "DLTETH", "EDOETH", "ELFETH", "ENGETH", "ENJETH", "ETCETH", "EVXETH", "FUELETH", "GTOETH", "GVTETH", "GXSETH", "HSRETH", "ICXETH", "KMDETH", "LENDETH", "LRCETH", "LSKETH", "LTCETH", "LUNETH", "MANAETH", "MDAETH", "MODETH", "MTHETH", "MTLETH", "NAVETH", "NEBLETH", "OSTETH", "POEETH", "POWRETH", "PPTETH", "QSPETH", "RCNETH", "RDNETH", "REQETH", "STORJETH", "SUBETH", "TNBETH", "TNTETH", "TRXETH", "VENETH", "VIBETH", "WABIETH", "WAVESETH", "WINGSETH", "XLMETH", "XMRETH", "XRPETH", "XZCETH", "YOYOETH", "ZECETH"]
var g_binance_usdt_trade_list = ["BTCUSDT", "BCCUSDT", "LTCUSDT", "NEOUSDT", "BNBUSDT", "ETHUSDT"]


function formatBinanceDateTime(datetime, delay = 0) {
  // console.log(datetime);
  dateObj = new Date(datetime + " UTC");  // convert to Local time
  dateObj.setTime(dateObj.getTime() + delay * 1000);
  buff = dateObj.getFullYear();
  buff += "/" + ('0' + (dateObj.getMonth() + 1)).slice(-2);
  buff += "/" + ('0' + dateObj.getDate()).slice(-2);
  buff += " " + ('0' + dateObj.getHours()).slice(-2);
  buff += ":" + ('0' + dateObj.getMinutes()).slice(-2);
  buff += ":" + ('0' + dateObj.getSeconds()).slice(-2);
  // console.log(buff);
  return buff;
};

function convertBinanceTransaction(each_history, first_alert) {
  var transaction = {
    "datetime" : formatBinanceDateTime(each_history.Date),
    "buyCoin" : "",
    "buyAmount" : 0,
    "sellCoin" : "",
    "sellAmount" : 0,
    "isAltTrade" : true,  // allways true for binance market tradeing
    "altJPY" : "---",
    "marketplace" : "Binance",
    "comment" : ("rate=" + each_history.Price)
  };
  var market = "";
  if (g_binance_bnb_trade_list.indexOf(each_history.Market) != -1) {
    market = "BNB";
  } else if (g_binance_btc_trade_list.indexOf(each_history.Market) != -1) {
    market = "BTC";
  } else if (g_binance_eth_trade_list.indexOf(each_history.Market) != -1) {
    market = "ETH";
  } else if (g_binance_usdt_trade_list.indexOf(each_history.Market) != -1) {
    market = "USDT";
  } else {
    if (first_alert) {
      alert("Error: Could not parse Market column."); first_alert = false;
    }
  }
  var key_coin = market;
  var target_coin = each_history.Market.substring(0, each_history.Market.indexOf(market));
  if (getCoinAlias(target_coin) != null) {
    target_coin = getCoinAlias(target_coin);
  }
  var key_coin_price = getJpyPrice(key_coin, transaction["datetime"].split(" ")[0]);
  if (key_coin_price != null) {
    if (each_history.Type == "BUY") {
      transaction["buyCoin"] = target_coin;
      transaction["sellCoin"] = key_coin;
      transaction["buyAmount"] = each_history.Amount;
      transaction["sellAmount"] = each_history.Total;
      transaction["altJPY"] = key_coin_price * each_history.Total;
    } else if (each_history.Type == "SELL") {
      transaction["buyCoin"] = key_coin;
      transaction["sellCoin"] = target_coin;
      transaction["buyAmount"] = each_history.Total;
      transaction["sellAmount"] = each_history.Amount;
      transaction["altJPY"] = key_coin_price * each_history.Total;
    } else {
      if (first_alert) {
        alert("Error: Could not parse Type column."); first_alert = false;
      }
    }
    transaction["comment"] += ", " + key_coin + "/JPY=" + key_coin_price;
    // console.log(each_history);
    // console.log(transaction);
    return {transaction: transaction, first_alert: first_alert};
  } else {
    if (first_alert) {
      alert("Error: Could not apply " + key_coin + " price."); first_alert = false;
    }
    return {transaction: null, first_alert: first_alert};
  }
};

function convertBinanceFeeTransaction(datetime, mainTransaction, fee, feeCoin, first_alert) {
  var feeTransaction = {
    "datetime" : formatBinanceDateTime(datetime, 2),  // set after 2sec from mainTransaction
    "buyCoin" : mainTransaction["buyCoin"],
    "buyAmount" : 0,
    "sellCoin" : feeCoin,
    "sellAmount" : fee,
    "isAltTrade" : true,  // allways true for binance market tradeing
    "altJPY" : "---",
    "marketplace" : "Binance",
    "comment" : "[Transaction Fee]"
  };

  var fee_coin_price = getJpyPrice(feeCoin, mainTransaction["datetime"].split(" ")[0]);
  if (fee_coin_price != null) {
    if (mainTransaction["buyCoin"] == feeCoin) {
      mainTransaction["buyAmount"] -= fee;
      mainTransaction["comment"] += " (transaction fee=" + fee + feeCoin + " included.)";
      return {mainTransaction: mainTransaction, feeTransaction: null, first_alert: first_alert};
    }
    if (mainTransaction["sellCoin"] == feeCoin) {
      mainTransaction["sellAmount"] += fee;
      mainTransaction["comment"] += " (transaction fee=" + fee + feeCoin + " included.)";
      return {mainTransaction: mainTransaction, feeTransaction: null, first_alert: first_alert};
    }
    fee_rate = (fee * fee_coin_price) / (fee * fee_coin_price + mainTransaction["altJPY"]);
    feeTransaction["buyAmount"] = mainTransaction["buyAmount"] * fee_rate;
    mainTransaction["buyAmount"] = mainTransaction["buyAmount"] * (1 - fee_rate);
    feeTransaction["altJPY"] = mainTransaction["altJPY"] * fee_rate;
    mainTransaction["altJPY"] = mainTransaction["altJPY"] * (1 - fee_rate);
    feeTransaction["comment"] += " " + feeCoin + "/JPY=" + fee_coin_price;
    return {mainTransaction: mainTransaction, feeTransaction: feeTransaction, first_alert: first_alert};
  } else {
    if (first_alert) {
      alert("Error: Could not apply " + feeCoin + " price."); first_alert = false;
    }
    return {mainTransaction: null, feeTransaction: null, first_alert: first_alert};
  }
};

function loadBinanceHistory(binance_history) {
  var l_history = [];
  var first_alert = true;
  for (var i=0; i<binance_history.length; ++i) {
    var ret = convertBinanceTransaction(binance_history[i], first_alert);
    first_alert = ret.first_alert;
    if (ret.transaction != null) {
      var mainTransaction = ret.transaction;
      ret = convertBinanceFeeTransaction(binance_history[i].Date,
                                         mainTransaction,
                                         binance_history[i]["Fee"],
                                         binance_history[i]["Fee Coin"],
                                         first_alert);
      first_alert = ret.first_alert;
      if (ret.mainTransaction != null) {
        l_history.push(ret.mainTransaction);
      }
      if (ret.feeTransaction != null) {
        l_history.push(ret.feeTransaction);
      }
    }
  }
  return l_history;
}
