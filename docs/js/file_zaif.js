var g_zaif_coin_list = ["JPY", "BTC", "BCH", "ETH", "XEM", "MONA", "ZAIF", "XCP", "BCY", "SJCX", "FSCC", "PEPECASH", "CICC", "NCXC", "JPYZ"]

function formatZaifDateTime(datetime) {
  // console.log(datetime);
  datetime = datetime.replace(/\.[0-9]+$/, "");  // trim under second
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
};

function loadZaifHistory(zaif_history) {
  var l_history = [];
  var first_alert = true;
  for (var i=0; i<zaif_history.length; ++i) {
    // console.log(zaif_history[i]);
    var transaction = {
      "datetime" : formatZaifDateTime(zaif_history[i].日時),
      "buyCoin" :"",
      "buyAmount" : 0,
      "sellCoin" : "",
      "sellAmount" : 0,
      "isAltTrade" : false,
      "altJPY" : "---",
      "marketplace" : "Zaif",
      "isShopping" : false,
      "productName" : "",
      "productJPY" : 0.0,
      "isWithdrawal" : false,
      "withdrawalJPY" : 0.0,
      "comment" : ""
    };
    var target_coin = zaif_history[i].マーケット.toUpperCase().match(/^[A-Z\.]+/)[0];
    var target_amount = parseFloat(zaif_history[i].数量);
    var key_coin = zaif_history[i].マーケット.toUpperCase().match(/[A-Z\.]+$/)[0];
    var key_amount = parseFloat(zaif_history[i].価格);
    if (g_zaif_coin_list.indexOf(target_coin) == -1 && first_alert) {
      alert("Error: Could not parse 数量 column."); first_alert = false;
    }
    if (g_zaif_coin_list.indexOf(key_coin) == -1 && first_alert) {
      alert("Error: Could not parse 価格 column."); first_alert = false;
    }

    if (getCoinAlias(target_coin) != null) {
      target_coin = getCoinAlias(target_coin);
    }
    if (getCoinAlias(key_coin) != null) {
      key_coin = getCoinAlias(key_coin);
    }

    var rate = key_amount;
    if (zaif_history[i].取引種別 == "bid") {  // buy
      transaction["buyCoin"] = target_coin;
      transaction["buyAmount"] = target_amount;
      transaction["sellCoin"] = key_coin;
      transaction["sellAmount"] = target_amount * rate;
      transaction["comment"] = "rate=" + rate;

    } else if (zaif_history[i].取引種別 == "ask") {  // sell
      transaction["buyCoin"] = key_coin;
      transaction["buyAmount"] = target_amount * rate;
      transaction["sellCoin"] = target_coin;
      transaction["sellAmount"] = target_amount;
      transaction["comment"] = "rate=" + rate;
    } else {
      if (first_alert) {
        alert("Error: Could not parse 取引種別 column."); first_alert = false;
      }
    }

    if (key_coin != "JPY") {
      var key_coin_price = getJpyPrice(key_coin, transaction["datetime"].split(" ")[0]);
      if (key_coin_price != null) {
        transaction["isAltTrade"] = true;
        if (zaif_history[i].取引種別 == "bid") {  // buy
          transaction["altJPY"] = key_coin_price * transaction["sellAmount"];
        } else if (zaif_history[i].取引種別 == "ask") {  // sell
          transaction["altJPY"] = key_coin_price * transaction["buyAmount"];
        }
        transaction["comment"] += " " + key_coin + "/JPY=" + key_coin_price;
      } else {
        if (first_alert) {
          alert("Error: Could not apply " + key_coin + " price."); first_alert = false;
        }
      }
    }

    // console.log(transaction);
    l_history.push(transaction);
  }
  return l_history;
}

function loadZaifWithdrawalHistory(withdrawal_history, filename) {
  var l_history = [];
  var first_alert = true;
  // console.log(filename);
  for (var i=0; i<withdrawal_history.length; ++i) {
    var transaction = {
      "datetime" : formatZaifDateTime(withdrawal_history[i]["日時"]),
      "buyCoin" : "",
      "buyAmount" : 0.0,
      "sellCoin" : "",
      "sellAmount" : parseFloat(withdrawal_history[i]["手数料"]),
      "isAltTrade" : false,
      "altJPY" : "---",
      "marketplace" : ("from zaif to " + withdrawal_history[i]["アドレス"]),
      "isShopping" : false,
      "productName" : "",
      "productJPY" : 0.0,
      "isWithdrawal" : true,
      "withdrawalJPY" : 0.0,
      "comment" : "WithdrawalAmount=" + withdrawal_history[i]["金額"]
    };
    var fee_coin = null;
    for (var j=0; j<g_zaif_coin_list.length; ++j) {
      var result = filename.toUpperCase().match(g_zaif_coin_list[j]);
      if (result != null) {
        fee_coin = result[0];
      }
    }
    var fee_coin_price = getJpyPrice(fee_coin, transaction["datetime"].split(" ")[0]);
    if (fee_coin_price != null) {
      transaction["sellCoin"] = fee_coin;
      transaction["withdrawalJPY"] = fee_coin_price * transaction["sellAmount"];
      transaction["comment"] += ", " + transaction["sellCoin"] + "/JPY=" + fee_coin_price;
      // console.log(withdrawal_history[i]);
      // console.log(transaction);
      l_history.push(transaction);
    }
    else {
      if (first_alert) {
        alert("Error: 価格情報を参照できないため、基軸通貨情報を追加してください。(" + (withdrawal_history[i].__rowNum__ + 1) + "行目)"); first_alert = false;
      }
    }
  }
  return l_history;
}
