var g_bitflyer_jpy_trade_list = ["BTC/JPY", "ETH/JPY", "ETC/JPY", "LTC/JPY", "BCH/JPY", "MONA/JPY"]

function formatOthersDateTime(datetime) {
  // console.log(datetime);
  dateObj = new Date(datetime);
  buff = dateObj.getFullYear();
  buff += "/" + ('0' + (dateObj.getMonth() + 1)).slice(-2);
  buff += "/" + ('0' + dateObj.getDate()).slice(-2);
  buff += " " + ('0' + dateObj.getHours()).slice(-2);
  buff += ":" + ('0' + dateObj.getMinutes()).slice(-2);
  // console.log(buff);
  return buff;
}

function getOthersTargetCoin(coin_pair, first_alert) {
  var target_coin = null;
  if (g_others_jpy_trade_list.indexOf(coin_pair) != -1) {
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

function loadOthersHistory(others_history) {
  var l_history = [];
  var first_alert = true;
  for (var i=0; i<others_history.length; ++i) {
    // console.log(others_history[i]);
    var transaction = {
      "datetime" : formatOthersDateTime(others_history[i].取引日時),
      "buyCoin" : others_history[i].購入通貨,
      "buyAmount" : others_history[i].購入通貨量,
      "sellCoin" : others_history[i].売却通貨,
      "sellAmount" : others_history[i].売却通貨量,
      "isAltTrade" : false,
      "altJPY" : "---",
      "marketplace" : others_history[i]["取引所名(or販売所名)"],
      "comment" : (others_history[i]["注文ID"] != undefined) ? ("[" + others_history[i]["注文ID"] + "]") : ""
    };

    if (transaction["buyCoin"] == "JPY") {
      if (transaction["comment"] != "") { transaction["comment"] += ", " }
      transaction["comment"] += "rate=" + (transaction["buyAmount"] / transaction["sellAmount"]);
      l_history.push(transaction);
    }
    else if (transaction["sellCoin"] == "JPY") {
      if (transaction["comment"] != "") { transaction["comment"] += ", " }
      transaction["comment"] += "rate=" + (transaction["sellAmount"] / transaction["buyAmount"]);
      l_history.push(transaction);
    }
    else {
      transaction["isAltTrade"] = true;
      if (others_history[i]["基軸通貨"] != undefined && others_history[i]["基軸通貨時価(JPY/基軸通貨)"] != undefined) {
        if (transaction["buyCoin"] == others_history[i]["基軸通貨"]) {
          transaction["altJPY"] = others_history[i]["基軸通貨時価(JPY/基軸通貨)"] * transaction["buyAmount"];
          if (transaction["comment"] != "") { transaction["comment"] += ", " }
          transaction["comment"] += transaction["buyCoin"] + "/JPY=" + others_history[i]["基軸通貨時価(JPY/基軸通貨)"];
          l_history.push(transaction);
        }
        else if (transaction["sellCoin"] == others_history[i]["基軸通貨"]) {
          transaction["altJPY"] = others_history[i]["基軸通貨時価(JPY/基軸通貨)"] * transaction["sellAmount"];
          if (transaction["comment"] != "") { transaction["comment"] += ", " }
          transaction["comment"] += transaction["sellCoin"] + "/JPY=" + others_history[i]["基軸通貨時価(JPY/基軸通貨)"];
          l_history.push(transaction);
        }
        else {
          if (first_alert) {
            alert("Error: 基軸通貨の指定が誤っています。(" + (others_history[i].__rowNum__ + 1) + "行目)"); first_alert = false;
          }
        }
      }
      else {
        var buy_coin_price = getJpyPrice(transaction["buyCoin"], transaction["datetime"].split(" ")[0]);
        var sell_coin_price = getJpyPrice(transaction["sellCoin"], transaction["datetime"].split(" ")[0]);
        if (buy_coin_price != null) {
          transaction["altJPY"] = buy_coin_price * transaction["buyAmount"];
          if (transaction["comment"] != "") { transaction["comment"] += ", " }
          transaction["comment"] += transaction["buyCoin"] + "/JPY=" + buy_coin_price;
          console.log(transaction);
          l_history.push(transaction);
        }
        else if (sell_coin_price != null) {
          transaction["altJPY"] = sell_coin_price * transaction["sellAmount"];
          if (transaction["comment"] != "") { transaction["comment"] += ", " }
          transaction["comment"] += transaction["sellCoin"] + "/JPY=" + sell_coin_price;
          l_history.push(transaction);
        }
        else {
          if (first_alert) {
            alert("Error: 価格情報を参照できないため、基軸通貨情報を追加してください。(" + (others_history[i].__rowNum__ + 1) + "行目)"); first_alert = false;
          }
        }
      }
    }
  }
  // console.log(l_history);
  return l_history;
}
