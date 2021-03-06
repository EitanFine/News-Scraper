// // Grab the articles as a json
// $.getJSON("/articles", function(data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       // Display the apropos information on the page
//       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     }
//   });
  
  
  // Whenever someone clicks a p tag
//   $('.btn-success').on("click", function(event) {
//       event.preventDefault();
//     // Empty the notes from the note section
//     // $("#notes").empty();
//     // Save the id from the p tag
//     var thisId = $(this).attr("data-id");
  
//     // Now make an ajax call for the Article
//     $.ajax({
//       method: "GET",
//       url: "/articles/" + thisId
//     })
//       // With that done, add the note information to the page
//       .then(function(data) {
//         console.log(data);
//         // The title of the article
//         $("#notes").append("<h2>" + data.title + "</h2>");
//         // An input to enter a new title
//         $("#notes").append("<input id='titleinput' name='title' >");
//         // A textarea to add a new note body
//         $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//         // A button to submit a new note, with the id of the article saved to it
//         $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
//         // If there's a note in the article
//         if (data.note) {
//           // Place the title of the note in the title input
//           $("#titleinput").val(data.note.title);
//           // Place the body of the note in the body textarea
//           $("#bodyinput").val(data.note.body);
//         }
//       });
//   });
  
//   // When you click the savenote button
//   $(document).on("click", "#savenote", function() {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");
  
//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//       method: "POST",
//       url: "/articles/" + thisId,
//       data: {
//         // Value taken from title input
//         title: $("#titleinput").val(),
//         // Value taken from note textarea
//         body: $("#bodyinput").val()
//       }
//     })
//       // With that done
//       .then(function(data) {
//         // Log the response
//         console.log(data);
//         // Empty the notes section
//         $("#notes").empty();
//       });
  
//     // Also, remove the values entered in the input and textarea for note entry
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
//   });

// When you click the delArticle button
$(".delArticle").on("click", function () {
    console.log("delArticle button clicked");
    // Run a POST request to delete
    $.ajax({
        method: "POST",
        url: "/delArticle/" + $(this).attr("data-id")
    }).then(function(data){
        window.location.reload();
    })
});

// When you click the Scrape button
$("#scrape").on("click", function () {
    console.log("scraping...");
    // Run a GET request to scrape
    $.ajax({
        method: "GET",
        url: "/scrape"
       
    }).then(function(data){
        window.location.reload();
    })
});

$(".saveArticle").on("click", function() {
    console.log("Article Saved");
    // Run a POST request to saveArticle
    $.ajax({
        method: "PUT",
        url: "/saveArticle/" + $(this).attr("data-id")
    }).then(function(data){
        // window.location.replace("/saved");
        window.location.reload();

        // window.location.reload();

    })
});

$(".addNote").on("click", function () {
    console.log("addNote button clicked");
    // Run a Get request to Page
    $.ajax({
        method: "GET",
        url: "/usercomments/" + $(this).attr("data-id")
    }).then(function(data){
        window.location.replace("/usercommentsform");
    })
});

$("#userSubmit").on("click", function () {
    console.log("submit button clicked");
   var content = $("#message_id").val().trim()
   console.log(content)

    // Run a Get request to Page
    // $.ajax({
    //     method: "GET",
    //     url: "/usercomments/" + $(this).attr("data-id")
    // }).then(function(data){
    //     window.location.replace("/usercommentsform");

    // });
});


$("#sArticles").on("click", function () {
    console.log("redirect");
    window.location.replace("/saved");
    // Run a Get request to Page
    // $.ajax({
    //     method: "GET",
    //     url: "/saveArticle/" + $(this).attr("data-id")
    // }).then(function(data){
        
    //     // window.location.reload();
    // });
});

$("#home").on("click", function () {
    console.log("redirect home");
    window.location.replace("/");
    // Run a Get request to Page
    // $.ajax({
    //     method: "GET",
    //     url: "/saveArticle/" + $(this).attr("data-id")
    // }).then(function(data){
        
    //     // window.location.reload();
    // });
});
