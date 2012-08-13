

//  var regexp = new RegExp(/^https?:\/\/(www|encrypted)\.google\..*\/.*&sky=ee(.*|)$/);
//  if (regexp.test(window.location.href)) {

//  }

$(document).ready(function(){
    //console.log(results);
    var query = $("[name='q']").val();
    console.log(query);
    
    getAOLResults(query, function(r){
        
        var cleanResults = [];

        r.children().filter('.result').each(function(){
            var url = $(this).find('a').attr('href');
            var matches = url.match(/&s_cu=(.*?)&/);

            cleanResults.push(decodeURIComponent(matches[1]));
        });
        console.log(cleanResults);

        var results = $('#ires li.g:not(#newsbox):not(.noknav)');
        var iter = 0;
        results.each(function(){
            var url = $(this).find('a').attr('href');
            var index = cleanResults.indexOf(url);
            var span = $('<span>').attr('style', 'color:red;padding-left:5px');

            if (index != -1) {
                if (index != iter) {
                    if (index > iter) {
                        span.html('&#9650;');
                    } else {
                        span.html('&#9660;');
                    }
                }
                iter += 1;
            } else {
                span.append($('<small>').text('Added result'));
            }
            $(this).find('h3').append(span);
        });
    });
});


function getAOLResults(query, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://m.aol.com/search/default/search.do?query=' + encodeURIComponent(query) + '&invocationType=topsearchbox.waphome&sources=google_websearch&first=0', true);

    req.onreadystatechange = function(data) {
        if (req.readyState != 4)  { return; } 
        var r = $('div', req.responseText);
        r = r.filter('.resultlist:first');
        callback(r);
    }

    req.send(null);
}


