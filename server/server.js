const express = require("express");
const path = require("path");

const fs = require("fs");

const app = express();

// PWAs want HTTPS!
function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
  if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    response.redirect("https://" + request.hostname + request.url);
  }
}

app.all("*", checkHttps);

// A test route to make sure the server is up.
app.get("/api/ping", (request, response) => {
  console.log("❇️ Received GET request to /api/ping");
  response.send("pong!");
});

// A mock route to return some data.
app.get("/api/movies", (request, response) => {
  console.log("❇️ Received GET request to /api/movies");
  
  // Parse the movie json file
  let allMovies = JSON.parse(fs.readFileSync("server/movies_metadata.json"));
  
  // Return it as a json object in the response body
  // This assumes that the API should send all information about all movies
  response.json(allMovies);
});

// Get single movie by id route
app.get("/api/movies/:id", (request, response) => {
  try{
    const { id } = request.params;
    // Parse movie json file
    let allMovies = JSON.parse(fs.readFileSync("server/movies_metadata.json"));
    
    // Go through array of jsons to look for the movie with the specified id
    allMovies.forEach((movie) => {
      if(movie.id == id){
        response.json(movie);
        return;
      }
    });
    
    // If failed to find, then send back an error message
    throw new Error(`Movie with id = ${id} not found`);
  }catch(err){
    response.status(404).json(err.message);
  }
  
});

// Express port-switching logic
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});
