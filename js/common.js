

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

function updateResults() {
    var query = getQueryFromURL();
    console.log(query);
    
    getAOLResults(query, function(r){
        
        var cleanResults = [];
        var cleanResultsData = [];
        var dirtyResults = [];

        r.each(function(){
            var url = $(this).find('a').attr('href');
            var title = $(this).find('a').html();
            var desc = $(this).find('p:not(.find)').html();

            cleanResults.push(url);
            cleanResultsData.push({url:url, title:title, desc:desc});
        });


        var results = $('#ires li.g:not(#newsbox):not(.noknav)');
        results.each(function(){
            var url = $(this).find('a').attr('href');

            if (url.indexOf('http') !== -1)
                dirtyResults.push(url);
        });
        
      //r.children().filter('.result').each(function(){
      //    var url = $(this).find('a').attr('href');
      //    var matches = url.match(/&s_cu=(.*?)&/);

      //    cleanResults.push(decodeURIComponent(matches[1]));
      //});

        console.log(cleanResults);
        console.log(dirtyResults);


        var iter = 0;
        results.each(function(){
            var url = $(this).find('a').attr('href');
            if (url.indexOf('http') === -1)
                return;

            var index = cleanResults.indexOf(url);
            var span = $('<span>').css({
                'color': 'red',
                'padding-right': '5px',
                'font-size': 'small'
            });

            if (index != -1) {
                if (index != iter) {
                    //span.html('#' + (index + 1) + ' &#10132; ' + '#' + (iter + 1));
                    if (index > iter) {
                        span.html((index - iter)+ '&#8593;');
                    } else {
                        span.html((iter - index)+ '&#8595;');
                    } 
                } else {
                    span.css('padding-right', '0px');
                }
                $(this).find('h3').prepend(span);
            } else {
              //var div = $('<div>').css({
              //            'background-image': 'url(http://duckduckgo.com/assets/icon_plus.v103.png)',
              //            'height': '16px',
              //            'width': '16px',
              //            'float': 'left',
              //            'background-repeat': 'no-repeat',
              //            'padding-right': '2px'
              //            });
              //$(this).find('h3').prepend(div);
              span.css({ 
                'color': '#b8b8b8',
                'font-size': 'x-large',
                'font-weight': 'bold',
                'padding': '0 3px 0 0'
              });
              span.html('+');
              $(this).find('h3').prepend(span);

            }

            //console.log(cleanResults.indexOf(dirtyResults[iter]), dirtyResults[iter]);

            if (dirtyResults.indexOf(cleanResults[iter]) === -1) {
                
                // adds generated google result
                $(this).after(generateGoogleResult(cleanResultsData[iter]));
                //console.log(iter, cleanResults[iter], cleanResultsData[iter]);
                //console.log(generateGoogleResult(cleanResultsData[iter]));

            }

            iter += 1;



        });
    });

}


window.addEventListener("hashchange", updateResults, false);

$(document).ready(function(){
    //console.log(results);
    updateResults();
});


function generateGoogleResult(r) {
    var span = $('<span>').css({
                'color': 'red',
                'padding-right': '5px',
                'font-size': 'small'
            });
    span.css({ 
                'color': '#b8b8b8',
                'font-size': 'x-large',
                'font-weight': 'bold',
                'padding': '0 3px 0 0'
              });
    span.html('-');
 
    var resultDiv = $('<div>').attr('class', 'vsc');
    resultDiv.append($('<h3>').prepend(span).append(
                        $('<a>').attr({href: r.url, class: 'l'})
                                .html(r.title)));
    resultDiv.append($('<div>').attr('class', 's').append(
                        $('<div>').attr('class', 'f kv').append(
                            $('<cite>').html(r.url))).append(
                        $('<span>').attr('class', 'st').html(r.desc))
                    );
    return $('<li>').attr('class', 'g').append(resultDiv);
}

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


