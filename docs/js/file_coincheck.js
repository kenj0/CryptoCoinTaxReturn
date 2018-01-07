function formatCoincheckDateTime(datetime) {
  // console.log(datetime);
  dateObj = new Date(datetime);  // convert to Local time
  buff = dateObj.getFullYear();
  buff += "/" + ('0' + (dateObj.getMonth() + 1)).slice(-2);
  buff += "/" + ('0' + dateObj.getDate()).slice(-2);
  buff += " " + ('0' + dateObj.getHours()).slice(-2);
  buff += ":" + ('0' + dateObj.getMinutes()).slice(-2);
  buff += ":" + ('0' + dateObj.getSeconds()).slice(-2);
  // console.log(buff);
  return buff;
};

function listupCoincheckCanceledHistory(history) {
  for (var i=0; i<history.length; ++i) {
    if (history[i].Action == "指値注文をキャンセル") {
      var pair_found = false;
      for (var j=i-1; 0<=j; --j) {  // search pair info
        if ((history[j].Action == "指値注文") && (history[j].opponent == "") &&
            (parseFloat(history[i].Amount) + parseFloat(history[j].Amount) == 0) &&
            (history[i].Coin == history[j].Coin)) {
          history[i].opponent = history[j].ID;
          history[j].opponent = history[i].ID;
          history[i].comment = "Cancel for " + history[j].ID;
          history[j].comment = "Canceled by " + history[i].ID;
          pair_found = true;
          break;
        }
      }
      if (!pair_found) {
        // console.log("Warning: ID(" + history[i].ID + ")の指値注文キャンセルと対となる注文が見つかりませんでした。");
        alert("Warning: ID(" + history[i].ID + ")の指値注文キャンセルと対となる注文が見つかりませんでした。");
      }
    }
  }
  return history;
}

function listupCoincheckBuySellHistory(history) {
  for (var i=0; i<history.length; ++i) {
    var j = i+1;
    if (j < history.length) {
      if (history[i].comment.indexOf("Cancel") != -1) { continue; }
      if (history[j].comment.indexOf("Cancel") != -1) { continue; }
      if ((history[i].Action == "購入") && (history[i].Coin == "JPY") && (history[i].Amount < 0)) {
        if (history[j].Action == "購入") {
          history[i].opponent = history[j].ID;
          history[j].opponent = history[i].ID;
          history[i].rate = -1 * parseFloat(history[i].Amount) / parseFloat(history[j].Amount);
          history[i].comment = "Buy: " + history[j].Coin + "/" + history[i].Coin + ", Opponent=" + history[j].ID + ", rate=" + history[i].rate;
          history[j].comment = "Buy: " + history[j].Coin + "/" + history[i].Coin + ", Opponent=" + history[i].ID + ", rate=" + history[i].rate;
        } else {
          alert("Warning: ID(" + history[i].ID + ")の購入と対となる購入記録が見つかりませんでした。");
        }
      }
      if ((history[i].Action == "売却") && (history[i].Coin == "JPY") && (history[i].Amount > 0)) {
        if (history[j].Action == "売却") {
          history[i].opponent = history[j].ID;
          history[j].opponent = history[i].ID;
          history[i].rate = -1 * parseFloat(history[i].Amount) / parseFloat(history[j].Amount);
          history[i].comment = "Sell: " + history[j].Coin + "/" + history[i].Coin + ", Opponent=" + history[j].ID + ", rate=" + history[i].rate;
          history[j].comment = "Sell: " + history[j].Coin + "/" + history[i].Coin + ", Opponent=" + history[i].ID + ", rate=" + history[i].rate;
        } else {
          alert("Warning: ID(" + history[i].ID + ")の売却と対となる売却記録が見つかりませんでした。");
        }
      }
    }
  }
  return history;
}

function listupCoincheckExchangeHistory(history) {
  // TODO: 取引の成立は直前の有効な（キャンセルされていない）指値注文に紐づく前提で実装している。
  //       注文の重複時の動作確認が必要。
  for (var i=0; i<history.length; ++i) {
    if (history[i].comment.indexOf("Cancel") != -1) { continue; }
    if ((history[i].Action == "取引が成約") && (history[i].Coin == "BTC")) {
      var pair_found = false;
      for (var j=i-1; 0<=j; --j) {  // search pair info
        if (history[j].comment.indexOf("Cancel") != -1) { continue; }
        if ((history[j].Action == "指値注文") && (history[j].Coin == "JPY")) {
          if (history[j].opponent == "") {
            history[i].opponent = history[j].ID;
            history[j].opponent = history[i].ID;
            history[i].comment = "Exchange: Buy BTC/JPY, Opponent=" + history[j].ID;
            history[j].comment = "Exchange: Buy BTC/JPY, Opponent=" + history[i].ID;
            history[j].btc_sum = parseFloat(history[i].Amount);
            pair_found = true;
            break;
          } else {
            history[i].opponent = history[j].ID;
            history[j].opponent += "," + history[i].ID;
            history[i].comment = "Exchange: Buy BTC/JPY, Opponent=" + history[j].ID;
            history[j].comment += ", " + history[i].ID;
            history[j].btc_sum += parseFloat(history[i].Amount);
            pair_found = true;
            break;
          }
        }
      }
      if (!pair_found) {
        //history[i].comment += "Warning: ID(" + history[i].ID + ")の取引成約と対となる指値注文が見つかりませんでした。";
        alert("Warning: ID(" + history[i].ID + ")の取引成約と対となる指値注文が見つかりませんでした。");
      }
    }
    if ((history[i].Action == "取引が成約") && (history[i].Coin == "JPY")) {
      var pair_found = false;
      for (var j=i-1; 0<=j; --j) {  // search pair info
        if (history[j].comment.indexOf("Cancel") != -1) { continue; }
        if ((history[j].Action == "指値注文") && (history[j].Coin == "BTC")) {
          if (history[j].opponent == "") {
            history[i].opponent = history[j].ID;
            history[j].opponent = history[i].ID;
            history[i].comment = "Exchange: Sell BTC/JPY, Opponent=" + history[j].ID;
            history[j].comment = "Exchange: Sell BTC/JPY, Opponent=" + history[i].ID;
            history[j].jpy_sum = parseFloat(history[i].Amount);
            pair_found = true;
            break;
          } else {
            history[i].opponent = history[j].ID;
            history[j].opponent += "," + history[i].ID;
            history[i].comment = "Exchange: Sell BTC/JPY, Opponent=" + history[j].ID;
            history[j].comment += ", " + history[i].ID;
            history[j].jpy_sum += parseFloat(history[i].Amount);
            pair_found = true;
            break;
          }
        }
      }
      if (!pair_found) {
        //history[i].comment += "Warning: ID(" + history[i].ID + ")の取引成約と対となる指値注文が見つかりませんでした。";
        alert("Warning: ID(" + history[i].ID + ")の取引成約と対となる指値注文が見つかりませんでした。");
      }
    }
  }
  for (var i=0; i<history.length; ++i) {
    if (0 < history[i].btc_sum) {
      history[i].rate = (-1 * parseFloat(history[i].Amount)) / history[i].btc_sum;
      history[i].comment += ", rate=" + history[i].rate
    }
    if (0 < history[i].jpy_sum) {
      history[i].rate = history[i].jpy_sum / (-1 * parseFloat(history[i].Amount));
      history[i].comment += ", rate=" + history[i].rate
    }
  }
  return history;
}

function parseCoincheckMarketCsv(csv_str) {
  var history = []
  var lines = csv_str.split(/\r\n|\r|\n/);
  if (0 < lines.length) {
    for (var i=0; i<lines.length; ++i) {
      var cells = lines[i].split(',');
      if (cells.length == 5) {
        var input_data = {
          "ID" : cells[0],
          "datetime" : formatCoincheckDateTime(cells[1]),
          "Action" : cells[2],
          "Amount" : cells[3],
          "Coin" : cells[4],
          "opponent" : "",  // add for parse temporary info
          "comment" : "",   // add for parse temporary info
          "btc_sum" : 0.0,  // add for parse temporary info
          "jpy_sum" : 0.0,  // add for parse temporary info
          "rate" : 0.0      // add for parse temporary info
        };
        history.push(input_data);
      }
    }
  }
  history = listupCoincheckCanceledHistory(history);
  history = listupCoincheckBuySellHistory(history);
  history = listupCoincheckExchangeHistory(history);
  // for (var i=0; i<history.length; ++i) {
  //   console.log(history[i].ID + "," + history[i].Action + "[" + history[i].opponent + "]" + "[" + history[i].comment + "]" + "[" + history[i].rate + "]");
  // }
  return history;
}

function searchFirstOpponentData(history, opponent) {  // if case of (oppoent1,opponent2) returns first "opponent1" only.
  var splitted_opponent = opponent.split(",");
  if (0 < splitted_opponent.length) {
    for (var i=0; i<history.length; ++i) {
      if (history[i].ID == splitted_opponent[0]) {
        return history[i];
      }
    }
  }
  return null;
}

function loadCoincheckHistory(csv_str) {
  var coincheck_history = parseCoincheckMarketCsv(csv_str);
  var l_history = [];
  for (var i=0; i<coincheck_history.length; ++i) {
    // console.log(coincheck_history[i]);
    var transaction = {
      "datetime" : coincheck_history[i].datetime,
      "buyCoin" :"",
      "buyAmount" : 0,
      "sellCoin" : "",
      "sellAmount" : 0,
      "isAltTrade" : false,  // allways false for coincheck market tradeing
      "altJPY" : "---",
      "marketplace" : "coincheck",
      "comment" : ("[" + coincheck_history[i].ID + "]")
    };
    if ((coincheck_history[i].Action == "購入") && (coincheck_history[i].rate > 0.0)) {
      current_data = coincheck_history[i];
      opponent_data = searchFirstOpponentData(coincheck_history, coincheck_history[i].opponent);
      transaction["buyCoin"] = opponent_data.Coin;
      transaction["sellCoin"] = current_data.Coin;
      transaction["buyAmount"] = parseFloat(opponent_data.Amount);
      transaction["sellAmount"] = -1 * parseFloat(current_data.Amount);
      transaction["comment"] += " " + current_data.comment;
      l_history.push(transaction);
    }
    if ((coincheck_history[i].Action == "売却") && (coincheck_history[i].rate > 0.0)) {
      current_data = coincheck_history[i];
      opponent_data = searchFirstOpponentData(coincheck_history, coincheck_history[i].opponent);
      transaction["buyCoin"] = current_data.Coin;
      transaction["sellCoin"] = opponent_data.Coin;
      transaction["buyAmount"] = parseFloat(current_data.Amount);
      transaction["sellAmount"] = -1 * parseFloat(opponent_data.Amount);
      transaction["comment"] += " " + current_data.comment;
      l_history.push(transaction);
    }
    if ((coincheck_history[i].Action == "指値注文") && (coincheck_history[i].rate > 0.0)) {
      current_data = coincheck_history[i];
      opponent_data = searchFirstOpponentData(coincheck_history, coincheck_history[i].opponent);
      transaction["buyCoin"] = opponent_data.Coin;
      transaction["sellCoin"] = current_data.Coin;
      transaction["buyAmount"] = (opponent_data.Coin == "BTC") ? current_data.btc_sum : current_data.jpy_sum;
      transaction["sellAmount"] = -1 * parseFloat(current_data.Amount);
      transaction["comment"] += " " + current_data.comment;
      // console.log(current_data);
      // console.log(opponent_data);
      // console.log(transaction);
      l_history.push(transaction);
    }
  }
  // console.log(l_history);
  return l_history;
}
