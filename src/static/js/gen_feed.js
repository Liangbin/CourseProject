// Uses JQuery to pull the feed data and place it inside the div

// pullGenFeedsTo(divID)
//  gets the feed data from the server and sets the content 
//  of the given divID to the feed data
function pullGenFeedsTo(divID){
    $.get('/feedGen?', function(data) {
        $("div.#"+divID).html("<h1>Feeds</h1>" + data);
    });
}
