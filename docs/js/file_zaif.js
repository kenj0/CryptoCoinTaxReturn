var g_zaif_coin_list = ["JPY", "BTC", "BCH", "ETH", "XEM", "MONA", "ZAIF", "XCP", "BCY", "SJCX", "FSCC", "PEPECASH", "CICC", "NCXC", "JPYZ"]

function convertZaifMarketCsv(csv_str) {
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
  return buff;
}

function formatZaifDateTime(datetime) {
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

function loadZaifHistory(csv_str) {
  var zaif_history = JSON.parse(convertZaifMarketCsv(csv_str));
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
      "comment" : ""
    };
    var key_coin = zaif_history[i].価格.replace(/[0-9\.]+/, "");
    var key_amount = parseFloat(zaif_history[i].価格.replace(/[A-Z]+/, ""));
    var target_coin = zaif_history[i].数量.replace(/[0-9\.]+/, "");
    var target_amount = parseFloat(zaif_history[i].数量.replace(/[A-Z]+/, ""));
    if (g_zaif_coin_list.indexOf(key_coin) == -1 && first_alert) {
      alert("Error: Could not parse 価格 column."); first_alert = false;
    }
    if (g_zaif_coin_list.indexOf(target_coin) == -1 && first_alert) {
      alert("Error: Could not parse 数量 column."); first_alert = false;
    }

    if (getCoinAlias(key_coin) != null) {
      key_coin = getCoinAlias(key_coin);
    }
    if (getCoinAlias(target_coin) != null) {
      target_coin = getCoinAlias(target_coin);
    }

    var rate = key_amount;
    if (zaif_history[i].注文 == "買い") {
      transaction["buyCoin"] = target_coin;
      transaction["buyAmount"] = target_amount;
      transaction["sellCoin"] = key_coin;
      transaction["sellAmount"] = target_amount * rate;
      transaction["comment"] = "rate=" + rate;

    } else if (zaif_history[i].注文 == "売り") {
      transaction["buyCoin"] = key_coin;
      transaction["buyAmount"] = target_amount * rate;
      transaction["sellCoin"] = target_coin;
      transaction["sellAmount"] = target_amount;
      transaction["comment"] = "rate=" + rate;
    } else {
      if (first_alert) {
        alert("Error: Could not parse 注文 column."); first_alert = false;
      }
    }

    if (key_coin != "JPY") {
      var key_coin_price = getJpyPrice(key_coin, transaction["datetime"].split(" ")[0]);
      if (key_coin_price != null) {
        transaction["isAltTrade"] = true;
        if (zaif_history[i].注文 == "買い") {
          transaction["altJPY"] = key_coin_price * transaction["sellAmount"];
        } else if (zaif_history[i].注文 == "売り") {
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
