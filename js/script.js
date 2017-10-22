
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // Get the street name from the textbox
    var street = $('#street').val();

    // Get the name of the city from the textbox
    var city = $('#city').val();

    var location = street + ', ' + city;
    $greeting.text('So, you want to live at ' + location + '?');

    var imgUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location='
                + location;

    // Set the street view image on background
    $body.append('<img class="bgimg" src="' + imgUrl + '">');

    // Load the NYTimes artices based on the location
    $nytHeaderElem.text('New York Times Articles for ' + city);

    // NyTimes REST API base url
    var nytimesurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

    // Use jquery's getJSON() method to send AJAX request and get
    // NYTimes articles
    // .getJSON() is simply a wrapper around .ajax() but it provides a
    // simpler method signature as some of the settings are defaulted
    // e.g dataType to json, type to get etc
    $.getJSON( nytimesurl,
      {
        // Specify all the query parameters here for GET request
        'api-key' : '<enter-your-api-key-for-nytimes>',
        'q'       : location,
        'sort'    : 'newest'
      })
      .done(function(json) {
        // Looping through all the docs received in json response
        $.each( json.response.docs, function( i, item ) {
            // Insert list element for each NYTimes article
            // Include url and snippet of the article
            $nytElem.append('<li class="article">' +
                             '<a href="' + item.web_url + '">'
                             + item.headline.main + '</a>'
                             + '<p>' + item.snippet + '</p></li>');
        });
      })
      .fail(function( jqxhr, textStatus, error ) {
        // Provide a failure/error message here
        $nytHeaderElem.text('New York Times Articles could not be loaded');
      }
    );

    return false;
};

$('#form-container').submit(loadData);
