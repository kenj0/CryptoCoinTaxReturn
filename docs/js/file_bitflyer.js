var g_bitflyer_jpy_trade_list = ["BTC/JPY", "ETH/JPY", "ETC/JPY", "LTC/JPY", "BCH/JPY", "MONA/JPY"]

function formatBitflyerDateTime(datetime) {
  // console.log(datetime);
  dateObj = new Date(datetime);
  buff = dateObj.getFullYear();
  buff += "/" + ('0' + (dateObj.getMonth() + 1)).slice(-2);
  buff += "/" + ('0' + dateObj.getDate()).slice(-2);
  buff += " " + ('0' + dateObj.getHours()).slice(-2);
  buff += ":" + ('0' + dateObj.getMinutes()).slice(-2);
  buff += ":" + ('0' + dateObj.getSeconds()).slice(-2);
  // console.log(buff);
  return buff;
}

function getBitflyerTargetCoin(coin_pair, first_alert) {
  var target_coin = null;
  if (g_bitflyer_jpy_trade_list.indexOf(coin_pair) != -1) {
    target_coin = coin_pair.substring(0, coin_pair.indexOf("/JPY"));
    if (getCoinAlias(target_coin) != null) {
      target_coin = getCoinAlias(target_coin);
    }
  } else {
    if (first_alert) {
      alert("Error: Could not parse 通貨 column."); first_alert = false;
    }
  }
  return target_coin;
}

function loadBitflyerHistory(bitflyer_history) {
  var l_history = [];
  var first_alert = true;
  for (var i=0; i<bitflyer_history.length; ++i) {
    var transaction = {
      "datetime" : formatBitflyerDateTime(bitflyer_history[i].取引日時),
      "buyCoin" :"",
      "buyAmount" : 0,
      "sellCoin" : "",
      "sellAmount" : 0,
      "isAltTrade" : false,
      "altJPY" : "---",
      "marketplace" : "Bitflyer",
      "comment" : ("[" + bitflyer_history[i]["注文 ID"] + "]")
    };

    if (bitflyer_history[i].取引種別 == "買い") {
      var key_coin = "JPY";
      var target_coin = getBitflyerTargetCoin(bitflyer_history[i].通貨, first_alert);
      if (target_coin != null) {
        transaction["buyCoin"] = target_coin;
        transaction["sellCoin"] = key_coin;
        transaction["buyAmount"] = bitflyer_history[i][target_coin] + bitflyer_history[i]["手数料(" + target_coin + ")"];
        transaction["sellAmount"] = -1 * bitflyer_history[i][key_coin];
        transaction["comment"] += ", " + "rate=" + bitflyer_history[i].価格;
        if (0 < -1 * bitflyer_history[i]["手数料(" + target_coin + ")"]) {
          transaction["comment"] += ", fee=" + (-1 * bitflyer_history[i]["手数料(" + target_coin + ")"]) + target_coin;
        }
        // console.log(bitflyer_history[i]);
        // console.log(transaction);
        l_history.push(transaction);
      }
    } else if (bitflyer_history[i].取引種別 == "売り") {
      var key_coin = "JPY";
      var target_coin = getBitflyerTargetCoin(bitflyer_history[i].通貨, first_alert);
      if (target_coin != null) {
        transaction["buyCoin"] = key_coin;
        transaction["sellCoin"] = target_coin;
        transaction["buyAmount"] = bitflyer_history[i][key_coin];
        transaction["sellAmount"] = -1 * (bitflyer_history[i][target_coin] + bitflyer_history[i]["手数料(" + target_coin + ")"]);
        transaction["comment"] += ", " + "rate=" + bitflyer_history[i].価格;
        if (0 < -1 * bitflyer_history[i]["手数料(" + target_coin + ")"]) {
          transaction["comment"] += ", fee=" + (-1 * bitflyer_history[i]["手数料(" + target_coin + ")"]) + target_coin;
        }
        // console.log(bitflyer_history[i]);
        // console.log(transaction);
        l_history.push(transaction);
      }
    } else if (bitflyer_history[i].取引種別 == "預入") {
      // TODO
    } else if (bitflyer_history[i].取引種別 == "送付") {
      // TODO
    } else {
      if (first_alert) {
        alert("Error: Could not parse 取引種別 column."); first_alert = false;
      }
    }
  }
  return l_history;
}
