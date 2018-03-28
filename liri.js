// import { userInfo } from "os";

require("dotenv").config();

var request = require("request");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var params = { screen_name: "nodejs" };
client.get("statuses/user_timeline", params, function(error, tweets, response) {
  if (!error) {
    // console.log(tweets);
  }
});

var userInput = process.argv[2];

switch (userInput) {
  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    var thisSong = "";
    for (var i = 3; i < process.argv.length; i++) {
      thisSong += process.argv[i] + " ";
    }
    thisSong.trim();
    spotifyThisSong(thisSong);
    break;

  case "movie-this":
    var movie = "";
    for (var i = 3; i < process.argv.length; i++) {
      movie += process.argv[i] + " ";
    }
    movie.trim();
    movieThis(movie);
    break;

  case "do-what-it-says":
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }
      var dataArr = data.split(",");
      spotifyThisSong(dataArr[1]);
    });

    break;

  default:
    console.log("Invalid Input");
}

function spotifyThisSong(thisSong) {
  spotify.search({ type: "track", query: thisSong, limit: 1 }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    // console.log(JSON.stringify(data,null,2));
    console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
    console.log("___________________________________");
    console.log(" ");
    console.log("Track: " + thisSong);
    console.log("___________________________________");
    console.log(" ");
    console.log("Preview URL: " + data.tracks.items[0].preview_url);
    console.log("___________________________________");
    console.log(" ");
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("___________________________________");
  });
}

function movieThis(movie) {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
      console.log(
        "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
      );
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
}

function myTweets() {
  client.get(
    "statuses/user_timeline",
    { user_id: "BillF_kinMurray", count: 20 },
    function(error, tweets, response) {
      if (!error) {
        for (var i = 0; i < tweets.length; i++) {
          console.log("Tweet: " + tweets[i].text);
          console.log(
            "Created At: " +
              moment(tweets[i].created_at).format("MMMM Do YYYY, h:mm:ss a")
          );
        }
      } else {
        console.log("error");
      }
    }
  );
}
