

//  var regexp = new RegExp(/^https?:\/\/(www|encrypted)\.google\..*\/.*&sky=ee(.*|)$/);
//  if (regexp.test(window.location.href)) {

//  }

function getQueryFromURL() {
    var regex = new RegExp('[\?\&]q=([^\&#]+)');
    if(regex.test(window.location.href)) {
        var q = window.location.href.split(regex);
        q = q[q.length - 2].replace(/\+/g," ");

        return decodeURIComponent(q);
    }
}


$(document).ready(function(){
    //console.log(results);
    var query = getQueryFromURL();
    console.log(query);
    
    getAOLResults(query, function(r){
        
        var cleanResults = [];

        r.each(function(){
            var url = $(this).find('a').attr('href');
            cleanResults.push(url);
        });
        
      //r.children().filter('.result').each(function(){
      //    var url = $(this).find('a').attr('href');
      //    var matches = url.match(/&s_cu=(.*?)&/);

      //    cleanResults.push(decodeURIComponent(matches[1]));
      //});

        console.log(cleanResults);

        var results = $('#ires li.g:not(#newsbox):not(.noknav)');
        var iter = 0;
        results.each(function(){
            var url = $(this).find('a').attr('href');
            var index = cleanResults.indexOf(url);
            var span = $('<span>').attr('style', 'color:red;font-size:small;padding-left:5px');

            if (index != -1) {
                if (index != iter) {
                    span.html('#' + (index + 1) + ' &#10132; ' + '#' + (iter + 1));
                  //if (index > iter) {
                  //    span.html('&#9650;');
                  //} else {
                  //    span.html('&#9660;');
                  //}
                }
                $(this).find('h3').append(span);
            } else {
                var div = $('<div>').css({
                            'background-image': 'url(http://duckduckgo.com/assets/icon_plus.v103.png)',
                            'height': '16px',
                            'width': '16px',
                            'float': 'left'
                            });
                $(this).find('h3').prepend(div);
            }
            iter += 1;
        });
    });
});


function getAOLResults(query, callback) {
    var req = new XMLHttpRequest();
    //req.open('GET', 'http://search.aol.com/aol/search?enabled_terms=&count_override=200&s_it=comsearch51&q=' + encodeURIComponent(query), true);
    var url = 'http://search.aol.com/aol/search?enabled_terms=&s_it=comsearch51&q=' + encodeURIComponent(query);
    console.log(url);
    req.open('GET', url, true);

    req.onreadystatechange = function(data) {
        if (req.readyState != 4)  { return; } 
        console.log('response:', req.responseText);
        var r = $('div', req.responseText);

        r = r.find('.MSL li[about="null"]');
        console.log(r);
        callback(r);
    }

    req.send(null);
}


