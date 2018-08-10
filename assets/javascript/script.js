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
  var userDistance = 20000;
  var userPrice = 3;
  var userCuisine = "pizza";
  var userRating = 4;
  var choiceList = [];

  // Google Places API
  var queryURL;
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';


  // Google Places API Key: AIzaSyAb-0Pdg5FAuE2FKaehXYjFX3sjhvyyQto
  $(document).on("click", "a", function () {

    queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAb-0Pdg5FAuE2FKaehXYjFX3sjhvyyQto&location=" + lat + "," + lng + "&radius=" + userDistance + "&rankby=prominence&type=restaurant&opennow&maxprice=" + userPrice + "&keyword=" + userCuisine + "%" + userRating;

    var targetUrl = queryURL;

    $.get(proxyUrl + targetUrl, function(data) {
      choiceList.push(data.results);
      console.log(choiceList);
    });
  });
  
  $('select').formSelect();
});