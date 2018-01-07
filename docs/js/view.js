/*** グローバル変数 ***/
/* Note: 1つ1つの取引を"transaction"とする。"transaction"の履歴(配列)を"history"とする */

/* 素の取引情報をJSON形式で格納する変数。ファイルに保存するときはこの形式。「取引の入力」で新しい取引を追加したら、まずここに追加する */
var g_history = null;

/* g_historyを基に、各取引日における各通貨の平均取得価格や価値といった情報をJSON形式で格納する変数 */
var g_historyCalc = null;

/* g_historyStrを基に、「取引履歴」に表示する文字列情報をJSON形式で格納する変数 */
var g_historyStr = null;

/* 表示中のリストで使われているコインのリスト */
var g_usedCoinList = null

/* リスト表示の候補。g_coinListはユーザが新しいコインを自分で追加したら、動的に増える */
var g_coinList = ["JPY", "BTC", "BCH", "ETH", "XRP", "LTC", "XMR", "IOT", "DASH", "ADA", "NEO", "EOS", "XLM", "QTUM", "ETC", "LSK", "ZEC", "XVG", "SC", "DOGE", "WAVES", "GNT", "SNT", "REP", "STRAT", "BTS", "XEM", "DGB", "BTG", "GAS", "SBD", "VTC", "NXT", "FCT", "RDD", "XZC", "STEEM", "PIVX", "OMG", "KMD", "LBC", "STORJ", "MONA", "ZENY", "XP", "TRON"];
var g_marketplaceList = ["", "bitFlyer", "Zaif", "coincheck", "bitbank", "QUOINEX", "GMO", "POLONIEX", "BITTREX", "Liqui", "Cryptopia", "HitBTC", "CCEX", "Binance", "CryptoBridge", "CoinExchange"];

var g_coinAlias = {
  "BCC" : "BCH",
  "IOTA" : "IOT"
};

function getCoinAlias(coin) {
  for (key in g_coinAlias) {
    if (key == coin) {
      return g_coinAlias[key];
    }
  }
  return null;
};


/*** AngularJS ***/
/* g_historyStrを基にテーブル表示をするためだけにAngularJSを使う。 ひとまず、他の処理はAngularJS外とする。*/
/* そのため、AngularJS外の処理からテーブルの更新処理を読み出すために、updateHistoryDummyButton要素を経由している。これはもっとうまく実装できるはず。*/
var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) {
  $scope.updateHistory = function() {
    $scope.history = g_historyStr;

    var portfolio = [];
    g_usedCoinList.forEach(function(coin) {
      if(coin != "JPY") {
        portfolio.push({
          "coin": coin,
          "balance": g_historyCalc[g_historyCalc.length - 1]["balance_" + coin].toLocaleString(),
          "value": g_historyCalc[g_historyCalc.length - 1]["value_" + coin].toLocaleString(),
          "averageAcquisitionPrice": g_historyCalc[g_historyCalc.length - 1]["averageAcquisitionPrice_" + coin].toLocaleString(),
        });
      }
    });
    $scope.portfolio = portfolio;
  };
});


/*** イベントハンドラーの登録 ***/
/* 「取引履歴の管理」関連 */
$(function() {
  if(window.File && window.FileReader && window.FileList && window.Blob) {
    $('#file-history-load').on('change', function (e) {
      loadHistory(e, calcHistory);
    });

    $('#btn-history-save').on('click', function () {
      saveHistory();
    });

    $('#market-history-load').on('change', function (e) {
      loadMarketHistory(e, calcHistory);
    });

    $('#btn-history-clear').on('click', function () {
      clearHistory();
      calcHistory();
      $('#btn-update-history').click();
    });

    $('#btn-profit').on('click', function () {
      calcProfit();
    });
  } else {
    file.style.display = 'none';
    alert("ブラウザからのファイル制御を有効にしてください")
  }
});

/* 「取引の入力」関連 */
$(function() {
  $('#flag-trans-isAltAlt').on('change', function () {
    if ($(this).is(':checked')) {
      $('#text-trans-AltAltJPY').prop("disabled", false);
      $('#btn-trans-getcurrent').prop("disabled", false);
    } else {
      $('#text-trans-AltAltJPY').prop("disabled", true);
      $('#btn-trans-getcurrent').prop("disabled", true);
    }
  });

  $('#btn-trans-getcurrent').on('click', function () {
    // todo: 現在のJPY相当額をhttps://coinmarketcap.com/ から取得してtext-trans-AltAltJPYに設定する
  });

  $('#btn-transaction-submit').on('click', function () {
    addTransaction();
    calcHistory();
    $('#btn-update-history').click();
  });

  $('#btn-transaction-clear').on('click', function () {
    clearTransaction();
  });
});


/*** その他 ***/
/* カレンダー用 */
$(function () {
  // $.datetimepicker.setLocale('ja');  // todo: error occurs...
  $('#datetime-profit-from').datetimepicker();
  $('#datetime-profit-to').datetimepicker();
  $('#datetime-trans').datetimepicker();
});
