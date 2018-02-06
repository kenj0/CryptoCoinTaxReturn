/*
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
*/

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
    var balance = (transactionCalc["buyCoin"] == "JPY" || transactionCalc["buyCoin"] == "") ? ""
                 : transactionCalc["buyCoin"] + ": " + transactionCalc["balance_" + transactionCalc["buyCoin"]].toLocaleString("ja-JP", {minimumSignificantDigits : 5}) + "\n";
    balance    += (transactionCalc["sellCoin"] == "JPY") ? ""
                 : transactionCalc["sellCoin"] + ": " + transactionCalc["balance_" + transactionCalc["sellCoin"]].toLocaleString("ja-JP", {minimumSignificantDigits : 5});
    var value = (transactionCalc["buyCoin"] == "JPY" ||transactionCalc["buyCoin"] == "") ? ""
               : transactionCalc["buyCoin"] + ": " + Math.round(transactionCalc["value_" + transactionCalc["buyCoin"]]).toLocaleString() + "\n";
    value    += (transactionCalc["sellCoin"] == "JPY") ? ""
               : transactionCalc["sellCoin"] + ": " + Math.round(transactionCalc["value_" + transactionCalc["sellCoin"]]).toLocaleString();
    var averageAcquisitionPrice = (transactionCalc["buyCoin"] == "JPY" || transactionCalc["buyCoin"] == "") ? ""
                                 : transactionCalc["buyCoin"] + ": " + transactionCalc["averageAcquisitionPrice_" + transactionCalc["buyCoin"]].toLocaleString() + "\n";
    averageAcquisitionPrice    += (transactionCalc["sellCoin"] == "JPY") ? ""
                                 : transactionCalc["sellCoin"] + ": " + transactionCalc["averageAcquisitionPrice_" + transactionCalc["sellCoin"]].toLocaleString();
    var altJpy = isNaN(transactionCalc["altJPY"]) ? "---" : Number(transactionCalc["altJPY"]).toLocaleString("ja-JP", {minimumSignificantDigits : 5});
    var marketplace = transactionCalc["marketplace"];
    if (transactionCalc["isShopping"]) {
      marketplace = transactionCalc["productName"];
    }

    g_historyStr.push({
      "index": index,
      "datetime": transactionCalc["datetime"],
      "marketplace": marketplace,
      "comment": transactionCalc["comment"],
      "buyCoin": transactionCalc["buyCoin"],
      "buyAmount": Number(transactionCalc["buyAmount"]).toLocaleString("ja-JP", {minimumSignificantDigits : 5}),
      "sellCoin": transactionCalc["sellCoin"],
      "sellAmount": Number(transactionCalc["sellAmount"]).toLocaleString("ja-JP", {minimumSignificantDigits : 5}),
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

function generateHistoryCSV() {
  var buff = "#,日時,取引所,購入通貨名,購入通貨数量,売却通貨名,売却通貨数量,仮想通貨間取引,売却通貨の時価[円],残高,簿価 [円],平均取得価額 [円],利益 [円],備考\n";
  for (i=0; i<g_historyStr.length; i++) {
    buff += g_historyStr[i].index;
    buff += "," + g_historyStr[i].datetime;
    buff += "," + g_historyStr[i].marketplace;
    buff += "," + g_historyStr[i].buyCoin;
    buff += "," + g_historyStr[i].buyAmount.replace(/,/g, "");
    buff += "," + g_historyStr[i].sellCoin;
    buff += "," + g_historyStr[i].sellAmount.replace(/,/g, "");
    buff += "," + ((g_historyStr[i].isAltTrade) ? "Yes" : "No");
    buff += "," + g_historyStr[i].altJPY.replace(/,/g, "");
    buff += "," + g_historyStr[i].balance.replace(/\n/g, "  ").replace(/,/g, "");
    buff += "," + g_historyStr[i].value.replace(/\n/g, "  ").replace(/,/g, "");
    buff += "," + g_historyStr[i].averageAcquisitionPrice.replace(/\n/g, "  ").replace(/,/g, "");
    buff += "," + g_historyStr[i].profit;
    buff += "," + g_historyStr[i].comment.replace(/,/g, "、") + "\n";
  }
  return buff;
}

var g_calc_one_transaction_first_alert = true;

/* 1つのトランザクションに対して、平均取得価格などを計算して返す */
function calcOneTransaction(coinList, transactionStr, previousTransactionCalc) {
  var transaction = JSON.parse(transactionStr);
  var transactionCalc = transaction;

  /* 全通貨に対して明細を作る。取引していない通貨に対しても処理するので遅い(todo) */

  if (transaction["isShopping"]) {
    transactionCalc["trade_" + "JPY"] = Number(transaction["productJPY"]);
  }
  else if (transaction["isWithdrawal"]) {
    transactionCalc["trade_" + "JPY"] = Number(transaction["withdrawalJPY"]);
  }
  else if (transaction["isAltTrade"]) {
    transactionCalc["trade_" + "JPY"] = Number(transaction["altJPY"]);
  } else {
    if (transaction["buyCoin"] == "JPY") {
      transactionCalc["trade_" + "JPY"] = Number(transaction["buyAmount"]);
    } else if (transaction["sellCoin"] == "JPY") {
      transactionCalc["trade_" + "JPY"] = Number(transaction["sellAmount"]);
    } else if (g_calc_one_transaction_first_alert) {
      alert("Error: Need to set JPY Amount for Altcoin trade.");
      g_calc_one_transaction_first_alert = false;
    }
  }

  coinList.forEach(function(coin) {
    /* 保有量の更新 */
    if (coin == transaction["buyCoin"]) {
      transactionCalc["balance_" + coin] = (previousTransactionCalc == null ? 0 : Number(previousTransactionCalc["balance_" + coin])) + Number(transaction["buyAmount"]);
    } else if (coin == transaction["sellCoin"]) {
      transactionCalc["balance_" + coin] = (previousTransactionCalc == null ? 0 : Number(previousTransactionCalc["balance_" + coin])) - Number(transaction["sellAmount"]);
    } else {
      transactionCalc["balance_" + coin] = (previousTransactionCalc == null ? 0 : Number(previousTransactionCalc["balance_" + coin]));
    }

    /* 平均取得価格の更新(買いの場合のみ) */
    if (coin == transaction["buyCoin"]) {
      /* 平均取得価額(t) = (平均取得価額(t-1)*保有量(t-1)+取得価額(t)) / 保有量(t) */
      var previousValue = (previousTransactionCalc == null ? 0 : (Number(previousTransactionCalc["averageAcquisitionPrice_" + coin]) * Number(previousTransactionCalc["balance_" + coin])));
      transactionCalc["averageAcquisitionPrice_" + coin] = (previousValue + Math.abs(transactionCalc["trade_" + "JPY"])) / transactionCalc["balance_" + coin];
    } else {
      transactionCalc["averageAcquisitionPrice_" + coin] = (previousTransactionCalc == null ? 0 : previousTransactionCalc["averageAcquisitionPrice_" + coin]);
    }

    /* 簿価の更新 */
    /* 簿価(t) = 平均取得価額(t) * 保有量(t) */
    transactionCalc["value_" + coin] = transactionCalc["averageAcquisitionPrice_" + coin] * transactionCalc["balance_" + coin];
  });

  /* 利益の更新 */
  /* 利益 = 売却価額 - 平均取得価格 * 取引量 */
  transactionCalc["profit"] = 0;
  if ((transaction["isAltTrade"] == false) && (transaction["isShopping"] == false) && (transaction["isWithdrawal"] == false)) {
    /* 基軸通貨がJPYの時は、売却される仮想通貨に対してのみ利益計算 */
    if (transaction["buyCoin"] == "JPY") {
      transactionCalc["profit"] = transactionCalc["trade_" + "JPY"] - transactionCalc["averageAcquisitionPrice_" + transaction["sellCoin"]] * Math.abs(Number(transaction["sellAmount"]));
    }
  } else {
    /* 基軸通貨が仮想通貨の時は、売却される通貨に対してのみ利益計算 */
    transactionCalc["profit"] = transactionCalc["trade_" + "JPY"] - transactionCalc["averageAcquisitionPrice_" + transaction["sellCoin"]] * Math.abs(Number(transaction["sellAmount"]));
  }

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
    if (transaction["buyCoin"] != "" && g_usedCoinList.indexOf(transaction["buyCoin"]) == -1) {
      g_usedCoinList.push(transaction["buyCoin"]);
    }
    if (transaction["sellCoin"] != "" && g_usedCoinList.indexOf(transaction["sellCoin"]) == -1) {
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
