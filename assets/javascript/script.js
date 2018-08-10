var lat;
var lng;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;

  }, function () {
    handleLocationError(true);
  });
} else {
  // Browser doesn't support Geolocation
  handleLocationError(false);
};

$(document).ready(function () {
  var userDistance;
  var userPrice;
  var userCuisine;
  var userRating;
  var choiceList = [];

  // Google Places API
  var queryURL;
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';


  // Google Places API Key: AIzaSyAb-0Pdg5FAuE2FKaehXYjFX3sjhvyyQto
  $(document).on("click", "a", function () {

    userCuisine = $("#cuisine").val();
    userDistance = (parseInt($("#distance").val()) * 1609.344);
    userRating = $("#rating").val();
    userPrice = $("#price").val();

    queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAb-0Pdg5FAuE2FKaehXYjFX3sjhvyyQto&location=" + lat + "," + lng + "&radius=" + userDistance + "&rankby=prominence&type=restaurant&opennow&maxprice=" + userPrice + "&keyword=" + userCuisine + "%" + userRating;

    var targetUrl = queryURL;

    $.get(proxyUrl + targetUrl, function(data) {
      choiceList.push(data.results);
      console.log(choiceList);
    });
  });
  
  $('select').formSelect();
});