function addTransaction() {
  var transaction = {
    "datetime": new Date($.trim($("#datetime-trans").val())).toLocaleString(),
    "buyCoin": $.trim($("#text-trans-buycoin").val()),
    "buyAmount": Math.abs($.trim($("#num-trans-buyamount").val())),
    "sellCoin": $.trim($("#text-trans-sellcoin").val()),
    "sellAmount": Math.abs($.trim($("#num-trans-sellamount").val())),
    "isAltTrade": $("#flag-trans-isAltAlt").is(':checked'),
    "altJPY": Math.abs($.trim($("#text-trans-AltAltJPY").val())),
    "marketplace": $.trim($("#text-trans-marketplace").val()),
    "comment": $.trim($("#text-trans-comment").val()),
  };

  if ((transaction["buyCoin"]) == "" || (transaction["sellCoin"]) == ""
      || isNaN(transaction["buyAmount"]) || transaction["buyAmount"] == "" || isNaN(transaction["sellAmount"]) || transaction["sellAmount"] == ""
      || (transaction["isAltTrade"] && (isNaN(transaction["altJPY"]) || transaction["altJPY"] == ""))) {
    alert("入力値が不正です");
    return;
  }

  if (g_coinList.indexOf(transaction["buyCoin"]) == -1) {
    alert("新しいコインを登録します。スペルミスではないか、確認してください。");
    g_coinList.push(transaction["buyCoin"]);
    updateInputDataList();
  }
  if (g_coinList.indexOf(transaction["sellCoin"]) == -1) {
    alert("新しいコインを登録します。スペルミスではないか、確認してください。");
    g_coinList.push(transaction["sellCoin"]);
    updateInputDataList();
  }
  if (g_marketplaceList.indexOf(transaction["marketplace"]) == -1) {
    alert("新しい取引所を登録します。");
    g_marketplaceList.push(transaction["marketplace"]);
    updateInputDataList();
  }

  if (!transaction["isAltTrade"]){
    transaction["altJPY"] = "---";
  }

  g_history.push(transaction);

  // console.log(g_history);
}

function clearTransaction() {
  $("#datetime-trans").val("");
  $("#text-trans-buycoin").val("");
  $("#num-trans-buyamount").val("");
  $("#text-trans-sellcoin").val("");
  $("#num-trans-sellamount").val("");
  $('#flag-trans-isAltAlt').prop("checked", false);
  $('#flag-trans-isAltAlt').trigger("change");
  $("#text-trans-AltAltJPY").val("");
  $("#text-trans-marketplace").val("");
  $("#text-trans-comment").val("");
}

function clearHistory() {
  // g_history = [
  //    {"datetime": "0000-01-01T00:00:00.000Z", "buyCoin": "", "buyAmount": 0, "sellCoin": "", "sellAmount": 0, "isAltTrade": false, "altJPY": 0, "marketplace": "", "comment": ""}
  // ];
  g_history =[];
}

/* g_historyCalcを入力として、表示用文字列(g_historyStr)を作る */
function generateHistoryStr()
{
  // g_historyStr = [
  //    {index: 0, datetime: "0000-01-01T00:00:00.000Z", marketplace: "", buyCoin: "", buyAmount: 0, sellCoin: "", sellAmount: 0, isAltTrade: "No", altJPY: "-", balance: "", value: "", averageAcquisitionPrice: "", profit: "0"},
  // ];
  var index = 0;
  g_historyStr = [];
  g_historyCalc.forEach(function(transactionCalc) {
    var balance = transactionCalc["buyCoin"] == "JPY" ? "" : transactionCalc["buyCoin"] + ": " + transactionCalc["balance_" + transactionCalc["buyCoin"]].toLocaleString() + "\n";
    balance    += transactionCalc["sellCoin"] == "JPY" ? "" : transactionCalc["sellCoin"] + ": " + transactionCalc["balance_" + transactionCalc["sellCoin"]].toLocaleString();
    var value = transactionCalc["buyCoin"] == "JPY" ? "" : transactionCalc["buyCoin"] + ": " + Math.round(transactionCalc["value_" + transactionCalc["buyCoin"]]).toLocaleString() + "\n";
    value    += transactionCalc["sellCoin"] == "JPY" ? "" : transactionCalc["sellCoin"] + ": " + Math.round(transactionCalc["value_" + transactionCalc["sellCoin"]]).toLocaleString();
    var averageAcquisitionPrice = transactionCalc["buyCoin"] == "JPY" ? "" : transactionCalc["buyCoin"] + ": " + transactionCalc["averageAcquisitionPrice_" + transactionCalc["buyCoin"]].toLocaleString() + "\n";
    averageAcquisitionPrice    += transactionCalc["sellCoin"] == "JPY" ? "" : transactionCalc["sellCoin"] + ": " + transactionCalc["averageAcquisitionPrice_" + transactionCalc["sellCoin"]].toLocaleString();
    var altJpy = isNaN(transactionCalc["altJPY"]) ? "---" : Number(transactionCalc["altJPY"]).toLocaleString();

    g_historyStr.push({
      "index": index,
      "datetime": transactionCalc["datetime"],
      "marketplace": transactionCalc["marketplace"],
      "comment": transactionCalc["comment"],
      "buyCoin": transactionCalc["buyCoin"],
      "buyAmount": Number(transactionCalc["buyAmount"]).toLocaleString(),
      "sellCoin": transactionCalc["sellCoin"],
      "sellAmount": Number(transactionCalc["sellAmount"]).toLocaleString(),
      "isAltTrade": transactionCalc["isAltTrade"],
      "altJPY": altJpy,
      "balance": balance,
      "value": value,
      "averageAcquisitionPrice": averageAcquisitionPrice,
      "profit": parseInt(transactionCalc["profit"])
    });
    index++;
  });
}

/* 1つのトランザクションに対して、平均取得価格などを計算して返す */
function calcOneTransaction(coinList, transactionStr, previousTransactionCalc) {
  var transaction = JSON.parse(transactionStr);
  var transactionCalc = transaction;

  /* 全通貨に対して明細を作る。取引していない通貨に対しても処理するので遅い(todo) */
  coinList.forEach(function(coin) {
    /* 今回の取引内容を通貨別に分ける */
    if (coin == transaction["buyCoin"]) {
      transactionCalc["trade_" + coin] = Number(transaction["buyAmount"]);
    } else if (coin == transaction["sellCoin"]) {
      transactionCalc["trade_" + coin] = -1 * Number(transaction["sellAmount"]);
    } else {
      transactionCalc["trade_" + coin] = 0;
    }
  });
  if (transaction["isAltTrade"]) {
    transactionCalc["trade_" + "JPY"] = Number(transaction["altJPY"]);
  }

  coinList.forEach(function(coin) {
    /* 今回の残高 = 今回の取引量 + 前回までの残高 */
    transactionCalc["balance_" + coin] = transactionCalc["trade_" + coin]  + (previousTransactionCalc == null ? 0 : Number(previousTransactionCalc["balance_" + coin]));

    /* 今回の取引完了時の価値 */
    if (coin == transaction["buyCoin"]) {
      /* 買いの場合: 今回の取引完了時の価値 = 前回までの価値 + 今回の購入額(JPY相当) */
      transactionCalc["value_" + coin] = (previousTransactionCalc == null ? 0 : Number(previousTransactionCalc["value_" + coin])) + Math.abs(transactionCalc["trade_" + "JPY"]);
    } else if (coin == transaction["sellCoin"]) {
      /* 売りの場合: 今回の取引完了時の価値 = 前回までの平均取得価格 * 現時点で保有しているコイン数量 */
      transactionCalc["value_" + coin] = (previousTransactionCalc == null ? 0 : Number(previousTransactionCalc["averageAcquisitionPrice_" + coin])) * transactionCalc["balance_" + coin];
    } else {
      /* 取引がなかった通貨: 前回と同じ値 */
      transactionCalc["value_" + coin] = (previousTransactionCalc == null ? 0 : Number(previousTransactionCalc["value_" + coin]));
    }

    /* 今回の取引完了時の平均取得価格(移動平均) */
    transactionCalc["averageAcquisitionPrice_" + coin] = transactionCalc["balance_" + coin] == 0 ? 0 : transactionCalc["value_" + coin] / transactionCalc["balance_" + coin];
  });

  transactionCalc["profit"] = 0;
  coinList.forEach(function(coin) {
    /* 利益 = 今回の取得JPY - 平均取得価格*売却したコイン数 */
    if ((coin == transaction["sellCoin"]) && (coin != "JPY")) { /* JPYからの直接購入以外は全て利益を計算する */
      transactionCalc["profit"] = Math.abs(transactionCalc["trade_" + "JPY"]) - (previousTransactionCalc == null ? 0 : Number(previousTransactionCalc["averageAcquisitionPrice_" + coin])) * Number(transaction["sellAmount"]);
    }
  });

  return JSON.stringify(transactionCalc);
}

/* g_historyを入力として、g_historyCalcを作る */
/* note: 毎回、全トランザクションを再計算するので遅い(todo) */
function calcHistory() {
  // console.log(g_history);

  // 日付順に並べる
  g_history.sort(function(a,b) {
    return (new Date(a.datetime) <= new Date(b.datetime) ? -1 : 1);
  });

  /* 使用しているコインを全取得 */
  g_usedCoinList = [];
  g_history.forEach(function(transaction) {
    if (g_usedCoinList.indexOf(transaction["buyCoin"]) == -1) {
      g_usedCoinList.push(transaction["buyCoin"]);
    }
    if (g_usedCoinList.indexOf(transaction["sellCoin"]) == -1) {
      g_usedCoinList.push(transaction["sellCoin"]);
    }
  });

  g_historyCalc = [];
  var previousTransactionCalc = null;
  g_history.forEach(function(transaction) {
    var transactionCalc = calcOneTransaction(g_usedCoinList, JSON.stringify(transaction), previousTransactionCalc);
    previousTransactionCalc = JSON.parse(transactionCalc);
    g_historyCalc.push(previousTransactionCalc);
  });
  // console.log(g_historyCalc);
  generateHistoryStr();

  $('#btn-update-history').click();
}


/* g_historyCalcを基に指定期間の損益を計算する */
function calcProfit(){
  var profit = 0;
  var from = new Date($('#datetime-profit-from').val());
  var to = new Date($('#datetime-profit-to').val());
  g_historyCalc.forEach(function(transactionCalc) {
    var transactionDate = new Date(transactionCalc["datetime"]);
    if ((transactionDate.getTime() >= from.getTime()) && (transactionDate.getTime() <= to.getTime())) {
      profit += transactionCalc["profit"];
    }
  });
  $('#text-profit').text("対象期間の損益: " + profit.toLocaleString() + "円");
}
