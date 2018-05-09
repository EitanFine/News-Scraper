var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var mongojs = require("mongojs");


// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();


//Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.Promise = Promise;

if (process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI)
}
else{
mongoose.connect("mongodb://localhost/newsscrapper");
}

// A GET route for scraping the NPR website
app.get("/scrape", function(req, res) {
    db.Article.remove({}).then(function() {
      // First, we grab the body of the html with request
      axios.get("https://www.npr.org/sections/news/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
  
         // Now, we grab every <div> with a class of "item-info", and do the following:
        $("div.item-info").each(function(i, element) {
          // Save an empty result object
          var result = {};
  
          // Add the text and href of every link, and save them as properties of the result object
          // result.title = $(this)
          // .children("h2.title")
          // .text();

          result.title = $(this)
          .find("h2.title")
          .text();
        
          result.link = $(this)
          .children("p.teaser")
          .children("a").attr("href");
       
          result.teaser = $(this)
          .find("p.teaser").find("a").text();
        
          // console.log($(this).find("p.teaser").find("a"))
        
          result.date = $(this)
            .children("p.teaser")
            .children("a")
            .children("time")
            .children("span.date")
            .text();

          console.log("DATE==============>>>>>>", result.date)

  
          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(function(dbArticle) {
            // View the added result in the console
            // console.log(dbArticle);
            // res.json(dbArticle)
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
              return res.json(err);
            });
        });
  
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
      });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
  });

  app.get("/", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        console.log(dbArticle)
        res.render("index", {data: dbArticle})    })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
      db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


// Route to delete a movie
app.post("/delArticle/:id", function(req, res) {
  // remove it from the db
  db.Article.findOneAndRemove({"_id": req.params.id})
  // db.movie.remove({review: req.params.id})
  .then(function(dbArticle) {
    res.send("Article has been deleted");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// app.put("/saveArticle/:id", function (req, res) {
//   db.Article
//   .findOneAndUpdate ({saved: true})
//   .then(function(dbArticle) {
//       res.render("saved", {data: dbArticle})
//   })
//   .catch(function(error) {
//     res.json(error);
//   });
// });

app.put("/saveArticle/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
  .update({ _id: req.params.id }, {$set: {saved:true}})
    .then(function(dbArticle) {
      res.send("Article has been saved");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/saved", function(req, res){
  db.Article.find({
    'saved' : true
  })
  .then(function(dbArticle) {
    // If we were able to successfully find Articles, send them back to the client
    console.log(dbArticle)
    res.render("saved", {data: dbArticle})    })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

app.get("/usercomments/:id", function(req, res) {
    
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      console.log("MADE IT HERE")
      res.send("-----");

      // res.render("/usercomments", {data: dbArticle})    
      // If we were able to successfully find an Article with the given id, send it back to the client
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


app.get("/usercommentsform", function(req, res){
  db.Article.findOne({ _id: req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  .then(function(dbArticle) {
    // console.log("MADE IT HERE")
    res.render("usercomments", {data: dbArticle})    
    // If we were able to successfully find an Article with the given id, send it back to the client
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});


  
  // Start the server
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  