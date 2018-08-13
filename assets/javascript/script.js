$(document).ready(function () {

  // Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyCvJGim2sDJ7_V7IHYZOPSSNis3OsPu2pM",
  //   authDomain: "tender-1533827992506.firebaseapp.com",
  //   databaseURL: "https://tender-1533827992506.firebaseio.com",
  //   projectId: "tender-1533827992506",
  //   storageBucket: "tender-1533827992506.appspot.com",
  //   messagingSenderId: "647175454840"
  // };
  // firebase.initializeApp(config);

  // var db = firebase.database();
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
  var userCuisine = "food";
  var userRating;
  var choiceList = [];
  var returnChoice;
  var randomIndex;
  var recallList = [];
  var recallChoice;

  // Zomato API

  function findRestaurant(name){
    var queryURL = "https://developers.zomato.com/api/v2.1/search?apikey=dd34ea771e5ad9ba983a9a24f13f5416&q=" + name + "&lat=" + lat + "&lon=" + lng;
    // + "&sort=real_distance";
    var restaurantID = "";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        restaurantID = response.restaurants[0].restaurant.id;
        // console.log(response);
        var queryURL2 = "https://developers.zomato.com/api/v2.1/restaurant?apikey=dd34ea771e5ad9ba983a9a24f13f5416&res_id=" + restaurantID;
        getRestaurant(queryURL2);
    });
  }


  function getRestaurant(url) {
    $.ajax({
        url: url,
        method: "GET"
    }).then(function(response){
        $("#result-website-link").attr("href", response.url);
        var box = $("#reviewBox");
        var restaurantImg = $("<img>");
        restaurantImg.attr("alt", "restaurant image");
        restaurantImg.attr("src", response.featured_image);
        restaurantImg.addClass("restaurantImage");
        $("#restaurantImg").append(restaurantImg);
        console.log(response);
        var rating = $("<h5>").text("Zomato Overall Rating: " + response.user_rating.aggregate_rating + " out of 5 stars");
        box.append(name);
        box.append(rating);
        box.append($("<h5>").text("Reviews:"));

        var ID = response.id;
        var nextURL = "https://developers.zomato.com/api/v2.1/reviews?apikey=dd34ea771e5ad9ba983a9a24f13f5416&res_id=" + ID;
        getReviews(nextURL);
    });

  }

  function getReviews(url){
    $.ajax({
        url: url,
        method: "GET"
    }).then(function(response){
        // console.log(response);
        var box = $("#reviewBox");
        for(var i = 0; i < response.user_reviews.length; i++){
            // console.log(response.user_reviews[i].review.rating);
            // console.log(response.user_reviews[i].review.user);
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
    $("body:not('#loading')").removeClass("fuzzy-background");
    $("#loading").removeClass("visible");
    //Insert query results onto Restaurant Details page
    recallChoice = localStorage.getItem("returnChoice");
    console.log(returnChoice);
    // $("#result-images").html(returnChoice.photos[0].html_attributions[0]);
    $("#result-name").text(returnChoice.name);
    $("#result-rating").text(returnChoice.rating + "/5");
    $("#result-price").empty();
    for (i = 1; i <= returnChoice.price_level; i++) {
      $("#result-price").append("$");
    };
    // $("#result-website-link").attr("href", (returnChoice);
    // $("#result-website-link").text((returnChoice.name);
    $("#result-description").text(returnChoice.types[0]);
    $("#google-map").attr("src", ("https://www.google.com/maps/embed/v1/place?q=place_id:" + returnChoice.place_id + "&key=AIzaSyBdNXU7ThPd1gzJmEKMQdOjDscIHbrurm4"));
    // Zomato API call for the reviews
    findRestaurant(returnChoice.name);
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

    $("body:not('#loading')").addClass("fuzzy-background");
    $("#loading").addClass("visible");

    localStorage.setItem("cuisine", JSON.stringify(userCuisine));
    localStorage.setItem("distance", JSON.stringify(userDistance));
    localStorage.setItem("rating", JSON.stringify(userRating));
    localStorage.setItem("price", JSON.stringify(userPrice));
    localStorage.setItem("lat", JSON.stringify(lat));
    localStorage.setItem("lng", JSON.stringify(lng));

    // Store search results in Firebase
    // db.ref().child("results").set(choiceList);

    queryURL3 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAnYeat-tcCr2A4o6cIs5OyW7zU3bg1cbk&location=" + lat + "," + lng + "&radius=" + userDistance + "&rankby=prominence&type=restaurant&opennow=true&maxprice=" + userPrice + "&keyword=" + userCuisine + "&rating=" + userRating;

    var targetUrl = queryURL3;

    $.get(proxyUrl + targetUrl, function (data) {
      console.log(data);
      for (item in data.results) {
        choiceList.push(data.results[item]);
      };
      randomIndex = Math.floor(Math.random() * choiceList.length);
      returnChoice = choiceList[randomIndex];
      choiceList.splice(randomIndex, 1);
      localStorage.setItem("returnChoice", JSON.stringify(returnChoice));
      localStorage.setItem("choiceList", JSON.stringify(choiceList));
      displayResults();
    });

    $(document).on("click", "#next-match", function () {
      returnChoice = choiceList[Math.floor(Math.random() * choiceList.length)];
      displayResults();
    });

    $(document).on("click", "#change-criteria", function () {
      choiceList = [];
    })

  });

  $('select').formSelect();
});