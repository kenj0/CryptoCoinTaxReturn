function updateInputDataList()
{
  var datalist = document.createElement('datalist');
  datalist.id = 'coin-type-list';
  $('#coin-type-list').remove();
  g_coinList.forEach(function(coin) {
    var option = document.createElement('option');
    option.value = coin;
    datalist.appendChild(option);
  });
  document.body.appendChild(datalist);

  var datalist2 = document.createElement('datalist');
  datalist2.id = 'marketplace-list';
  $('#marketplace-list').remove();
  g_marketplaceList.forEach(function(marketplace) {
    var option = document.createElement('option');
    option.value = marketplace;
    datalist2.appendChild(option);
  });
  document.body.appendChild(datalist2);
}

$(function() {
  clearHistory();
  $('#flag-trans-isAltAlt').prop("checked", false);
  $('#flag-trans-isAltAlt').trigger("change");

  var today = new Date();
  $('#datetime-trans').val(today.toString());
  $('#datetime-profit-to').val(today.toString());
  today.setMonth(0);
  today.setDate(1);
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  $('#datetime-profit-from').val(today.toString());

  updateInputDataList();
});
