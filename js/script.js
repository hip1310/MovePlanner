
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

    // Get the wikipedia links for the specified location by user

    // JSONP (JSON with Padding) is a method commonly used to bypass the cross-domain policies in web browsers.
    // You are not allowed to make AJAX requests to a web page perceived to be on a different server by the browser.
    // JSON and JSONP behave differently on the client and the server.
    // JSONP requests are not dispatched using the XMLHTTPRequest and the associated browser methods.
    // Instead a <script> tag is created, whose source is set to the target URL.
    // This script tag is then added to the DOM (normally inside the <head> element).

    // Workaround for error handling with JSONP
    // As with the JSONP we can't use .error() jquery method because of the
    // limitation of the underltying implementation of JSONP
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get Wikipedia resources");
    }, 8000);

    $.ajax({
        url: "https://en.wikipedia.org/w/api.php",

        // The name of the callback parameter
        jsonp: "callback",

        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // Specify the query parameters
        data: {
            "action": "opensearch",
            "search": city,
            "format": "json"
        },

        // Work with the response
        success: function( response ) {
            var wikiTextList = response[1];
            var wikiLinksList = response[3];

            if(wikiTextList !== undefined){
                for(var i=0; i<wikiLinksList.length; i++){
                    var wikiLinkText = wikiTextList[i];
                    var wikiLink = wikiLinksList[i];
                    $wikiElem.append('<li><a href="' + wikiLink + '">'
                                     + wikiLinkText + '</a></li>')
                }
            }

            // If we reach here, it means we successfully got the wikipedia
            // links. Clear the timeout we set before to prevent displaying
            // error message.
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
