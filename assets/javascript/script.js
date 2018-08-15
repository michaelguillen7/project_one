// This teeny thing takes you back to the top of the page on refresh.
// Code found here: https://stackoverflow.com/a/26837814 -Mandie
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

$(document).ready(function () {
  var userDistance;
  var userPrice;
  var userCuisine = "food";
  var userRating;
  var choiceList = [];
  var returnChoice;
  var randomIndex;
  var recallList = [];
  var recallChoice;
  var lat;
  var lng;
  $('.modal').modal();

  // get location for the specific device being used
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;

    }, function (error) {
      if (error.PERMISSION_DENIED) {
        $("#modal-trigger").trigger("click");
        $("#modal-btn").on("click", function () {
          location.reload()
        });
      };
    });
  } else {
    // Browser doesn't support Geolocation
  };

  // Localstorage handling for previous search results
  $("#previous-match").on("click", function(){
    var counter = parseInt(localStorage.getItem("counter")) - 1;
    if(counter >= 0){
      var previousItems = JSON.parse(localStorage.getItem("previousMatches"));
      returnChoice = previousItems[counter];
      localStorage.setItem("counter", counter);
      displayResults();
    }
  })

  // Zomato API /////////////////////////////////////////////////////////////////

  // ajax call to get the restaurant ID for zomato in order to get more specific data from zomato API
  function findRestaurant(name){
    var queryURL = "https://developers.zomato.com/api/v2.1/search?apikey=dd34ea771e5ad9ba983a9a24f13f5416&q=" + name + "&lat=" + lat + "&lon=" + lng;
    var restaurantID = "";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        restaurantID = response.restaurants[0].restaurant.id;

        var queryURL2 = "https://developers.zomato.com/api/v2.1/restaurant?apikey=dd34ea771e5ad9ba983a9a24f13f5416&res_id=" + restaurantID;
        getRestaurant(queryURL2);
    });
  }

  // ajax call for the specific restaurant information
  function getRestaurant(url) {
    $.ajax({
        url: url,
        method: "GET"
    }).then(function(response){
        $("#result-website-link").attr("href", response.url);
        var box = $("#reviewBox");
        box.empty();
        $("#restaurantImg").empty();

        // If zomato does not return an image, hide the div. Show div if zomato returns an image
        if(response.featured_image){
          var restaurantImg = $("<img>");
          restaurantImg.attr("alt", "restaurant image");
          restaurantImg.attr("src", response.featured_image);
          restaurantImg.addClass("restaurantImage");
          $("#restaurantImg").show();
          $("#restaurantImg").append(restaurantImg);
        }
        else{
          $("#restaurantImg").hide();
        }


        var rating = $("<h4>").text("Zomato Overall Rating: " + response.user_rating.aggregate_rating + " out of 5 stars");
        box.append(name);
        box.append(rating);
        box.append($("<h5>").text("Reviews:"));

        var ID = response.id;
        var nextURL = "https://developers.zomato.com/api/v2.1/reviews?apikey=dd34ea771e5ad9ba983a9a24f13f5416&res_id=" + ID;
        getReviews(nextURL);
    });

  }

  // ajax call to get the reviews for the restaurant. Zomato limits the calls to 5
  function getReviews(url){
    $.ajax({
        url: url,
        method: "GET"
    }).then(function(response){
        var box = $("#reviewBox");
        for(var i = 0; i < response.user_reviews.length; i++){
            var userImage = $("<img>");
            userImage.attr("src", response.user_reviews[i].review.user.profile_image);
            userImage.attr("alt", "User profile image");
            userImage.attr("class", "circle responsive-img");
            box.append(userImage);
            box.append($("<h6>").text("Reviewer Name: " + response.user_reviews[i].review.user.name));
            box.append($("<h7>").text("Rating: " + response.user_reviews[i].review.rating + " out of 5 stars"));
            box.append($("<p>").text(response.user_reviews[i].review.review_text));
        }
    });
  }



  // Google Places API
  var queryURL3;
  var proxyUrl = 'https://cors-ut-bootcamp.herokuapp.com/';

  function displayResults() {
    $("body").removeClass("fuzzy-background");
    //Insert query results onto Restaurant Details page
    $("#result-name").text(returnChoice[0].name);
    $("#result-rating").text(returnChoice[0].rating + "/5");
    $("#result-price").empty();
    for (i = 1; i <= returnChoice[0].price_level; i++) {
      $("#result-price").append("$");
    };
    $("#google-map").attr("src", ("https://www.google.com/maps/embed/v1/place?q=place_id:" + returnChoice[0].place_id + "&key=AIzaSyBdNXU7ThPd1gzJmEKMQdOjDscIHbrurm4"));

    // Zomato API call for the reviews
    findRestaurant(returnChoice[0].name);
  }


  // Google Places API Key: AIzaSyAnYeat-tcCr2A4o6cIs5OyW7zU3bg1cbk
  $("#submit-button").on("click", function () {

    userCuisine = $("#cuisine").val();
    if ($("#distance").val() > 0) {
      userDistance = (parseInt($("#distance").val()) * 1609.344);
    } else {
      userDistance = 16093.44;
    }
    userRating = $("#rating").val();
    userPrice = $("#price").val();

    $("body").addClass("fuzzy-background");

    localStorage.setItem("cuisine", JSON.stringify(userCuisine));
    localStorage.setItem("distance", JSON.stringify(userDistance));
    localStorage.setItem("rating", JSON.stringify(userRating));
    localStorage.setItem("price", JSON.stringify(userPrice));
    localStorage.setItem("lat", JSON.stringify(lat));
    localStorage.setItem("lng", JSON.stringify(lng));


    queryURL3 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAnYeat-tcCr2A4o6cIs5OyW7zU3bg1cbk&location=" + lat + "," + lng + "&radius=" + userDistance + "&rankby=prominence&type=restaurant&opennow=true&maxprice=" + userPrice + "&keyword=" + userCuisine + "&rating=" + userRating;

    var targetUrl = queryURL3;

    $.get(proxyUrl + targetUrl, function (data) {
      for (item in data.results) {
        choiceList.push(data.results[item]);
      };
      randomIndex = Math.floor(Math.random() * choiceList.length);
      returnChoice = choiceList.splice(randomIndex, 1);
      console.log(choiceList);
      console.log(returnChoice);

      // John's code for previous storage ///////////////////////////////
      localStorage.setItem("previousMatches", []);
      localStorage.setItem("counter", 0);
      var previousItems = [];
      previousItems.push(returnChoice);
      var counter = previousItems.length - 1;
      localStorage.setItem("counter", counter);
      localStorage.setItem("previousMatches", JSON.stringify(previousItems));
      ///////////////////////////////////////////////////////////////////

      displayResults();
    });

    $(document).on("click", "#next-match", function () {
      randomIndex = Math.floor(Math.random() * choiceList.length);
      returnChoice = choiceList.splice(randomIndex, 1);

      // John's code for previous storage ///////////////////////////////
      var previousItems = JSON.parse(localStorage.getItem("previousMatches"));
      previousItems.push(returnChoice);
      var counter = previousItems.length - 1;
      localStorage.setItem("counter", counter);
      localStorage.setItem("previousMatches", JSON.stringify(previousItems));
      ///////////////////////////////////////////////////////////////////

      displayResults();
    });

    $(document).on("click", "#change-criteria", function () {
      choiceList = [];
    })

  });

  $('select').formSelect();
});