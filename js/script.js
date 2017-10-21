
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

    var imgUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location='
                + location;

    // Set the street view image on background
    $body.append('<img class="bgimg" src="' + imgUrl + '">');

    return false;
};

$('#form-container').submit(loadData);
