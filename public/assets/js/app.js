

$(function () {


  $("#scrape").on("click", function () {

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
      // With that done, add the note information to the page
      .then(function (data) {
        window.location.replace('/articles/new')
  
      });
  });

  

  $(".btn.btn-mysave").on("click", function () {
    var id = $(this).data("id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "PUT",
      url: "/articles/" + id
    }).then(function (data) {
      {location.reload()}
    });

  });


  $(".article-note").on("click", function () {
    var id = $(this).data("id")
    var newel = "#noteForm-" + id

    var notetext = $(newel).val()
    var data = { 'body': notetext }
    
    // Now make an ajax call for the Article
    $.ajax({
      data: data,
      method: "POST",
      url: "/articles/" + id
    }).then(function (data) {
      {location.reload()}
    });

  });


  $(".deleteNote").on("click", function () {
    var id = $(this).data("id")
    
    // Now make an ajax call for the Article
    $.ajax({
      method: "DELETE",
      url: "/notes/" + id
    }).then(function (data) {
      {location.reload()}
    });

  });

  $(".article-delete").on("click", function () {
    var id = $(this).data("id")
    // Now make an ajax call for the Article
    $.ajax({
      method: "DELETE",
      url: "/articles/" + id
    }).then(function (data) {
      {location.reload()}
    });

  });

});
