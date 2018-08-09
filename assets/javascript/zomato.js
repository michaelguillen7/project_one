// API credentials dd34ea771e5ad9ba983a9a24f13f5416
// Austin coordinates 30.2672° N, 97.7431° W


// https://developers.zomato.com/api/v2.1/search?apikey=dd34ea771e5ad9ba983a9a24f13f5416&

var lat, lon;
navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    findRestaurant();

  });


function findRestaurant(){
    var restaurantName = "Terry Black's";
    var queryURL = "https://developers.zomato.com/api/v2.1/search?apikey=dd34ea771e5ad9ba983a9a24f13f5416&q=" + restaurantName + "&lat=" + lat + "&lon=" + lon;
    var restaurantID = "";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        restaurantID = response.restaurants[0].restaurant.id;
        console.log(response);
        var queryURL2 = "https://developers.zomato.com/api/v2.1/restaurant?apikey=dd34ea771e5ad9ba983a9a24f13f5416&res_id=" + restaurantID;
        // console.log(queryURL2);
        // $.ajax({
        //     url: queryURL2,
        //     method: "GET"
        // }).then(function(response){
        //     console.log(response);
        // });
        getRestaurant(queryURL2);
    });
}


function getRestaurant(url) {
    $.ajax({
        url: url,
        method: "GET"
    }).then(function(response){
        var box = $("#displayBox");
        console.log(response);
        var name = $("<h1>").text(response.name);
        var rating = $("<h3>").text(response.user_rating.aggregate_rating + " out of 5 stars");
        // var reviews = $("")
        box.append(name);
        box.append(rating);
        box.append($("<h3>").text("Reviews:"));

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
        var box = $("#displayBox");
        for(var i = 0; i < 5; i++){
            // console.log(response.user_reviews[i].review.rating);
            box.append($("<h5>").text("Rating: " + response.user_reviews[i].review.rating + " out of 5 stars"));
            box.append($("<h7>").text(response.user_reviews[i].review.review_text));

        }
    });
}