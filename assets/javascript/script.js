$(document).ready(function(){
// Google Places API
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=bujumbura&apikey=2c06a535e69ae4772b8caa3ca865dc4e"

// Google Places API Key: AIzaSyAb-0Pdg5FAuE2FKaehXYjFX3sjhvyyQto

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    $(".city").text("Bujumbura");
    $(".wind").text(response.wind.speed + " mph");
    $(".humidity").text(response.main.humidity + "%");
    $(".temp").text((response.main.temp - 273) + " C");
  })

    $('select').formSelect();
  });