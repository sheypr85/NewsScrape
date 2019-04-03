

$(function () {


  $("#scrape").on("click", function () {

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
  
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
});
