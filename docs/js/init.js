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
  // $('#datetime-trans').val(today.toString());
  var date = new Date();
  date.setYear(2017);
  date.setMonth(1-1);
  date.setDate(1);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  $('#datetime-profit-from').val(date.toString());
  date.setMonth(12-1);
  date.setDate(31);
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  $('#datetime-profit-to').val(date.toString());

  updateInputDataList();
});
