$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCvJGim2sDJ7_V7IHYZOPSSNis3OsPu2pM",
    authDomain: "tender-1533827992506.firebaseapp.com",
    databaseURL: "https://tender-1533827992506.firebaseio.com",
    projectId: "tender-1533827992506",
    storageBucket: "tender-1533827992506.appspot.com",
    messagingSenderId: "647175454840"
  };
  firebase.initializeApp(config);

  var db = firebase.database();
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

  var userDistance;
  var userPrice;
  var userCuisine;
  var userRating;
  var choiceList = [];
  var returnChoice;

  // Google Places API
  var queryURL;
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';


  // Google Places API Key: AIzaSyAb-0Pdg5FAuE2FKaehXYjFX3sjhvyyQto
  $("#submit-button").on("click", function () {

    userCuisine = $("#cuisine").val();
    userDistance = (parseInt($("#distance").val()) * 1609.344);
    userRating = $("#rating").val();
    userPrice = $("#price").val();

    queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAb-0Pdg5FAuE2FKaehXYjFX3sjhvyyQto&location=" + lat + "," + lng + "&radius=" + userDistance + "&rankby=prominence&type=restaurant&opennow&maxprice=" + userPrice + "&keyword=" + userCuisine + "%" + userRating;

    var targetUrl = queryURL;

    $.get(proxyUrl + targetUrl, function (data) {
      for (item in data.results) {
        choiceList.push(data.results[item]);
      };
      returnChoice = choiceList[Math.floor(Math.random() * choiceList.length)];
      console.log(returnChoice);      
    });

    // Store search results in Firebase
    // db.ref().child("results").set(choiceList);

    //Insert query results onto Restaurant Details page
    $("#result-images").html(returnChoice.photos[0].html_attributions[0]);
    $("#result-name").text(returnChoice.name);
    $("#result-rating").text(returnChoice.rating);
    $("#result-price").text("$" * returnChoice.price_level);
    // $("#result-website-link").attr("href", returnChoice);
    // $("#result-website-link").text(returnChoice.name);
    $("#result-description").text(returnChoice.type[0]);
  });

  $('select').formSelect();
});