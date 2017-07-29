
function loadData() {

    //declare variables
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $( ".bgimg" ).remove();

    //delcare & instantiate input variables
    var $street = $('#street').val();
    var $city = $('#city').val();
    var address = $street + ", " + $city;

    //update greeting text with message
    $greeting.text('So you want to live at ' + address +"?");

    //set background image to google streetview image of place
    var imageSrc = 'http://maps.googleapis.com/maps/api/streetview?size=600x450&location=' + address +'';

    $body.append('<img class="bgimg" src="' + imageSrc + '">');

    //set variables for NY times API
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
    var query = address;

    //get NY Times articles using API to get JSON
    $.getJSON( url + address + '', {
        'api-key': "f0d6fef6e2734650a109e854e65e048d"})

            //if successful procees JSON & append to relevant part of page
            .done(function(data){

                $nytHeaderElem.text("NY Times articles about " + address +'');
                console.log(data);

                var articles = data.response.docs;
                $.each( articles, function(key, val) {

                    $nytElem.append( "<li class='article'><a href='" + val.web_url + "'>" + val.headline.main +
                    "</a><p>" + val.snippet + "</p></li>" );

                })
            })
            //if request fails print message to let user know
            .fail(function(){
                $nytHeaderElem.text("No NY Times articles found.");
            });

    //set variables for Wikipedia
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + $city + '&format=json&callback=wikiCallback';

    //wiki request error handling
    var wikiRequestTimeout = setTimeout(function(){

        $wikiElem.text('Failed to get Wikipedia resources');
        }, 8000);

    // Using jQuery to get Wikipedia article list based on input
    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        success: function(response) {
            //log to console to understand data structure
            console.log(response);

            //set variables to handle response
            var articleList = response[1];
            var url = 'http://en.wikipedia.org/wiki/';

            //iterate through the list & append them to the page
            $.each(articleList, function(i, val) {

                $wikiElem.append( "<li><a href='" + url + val + "'>" + val + "</a></li>" );

           })
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
