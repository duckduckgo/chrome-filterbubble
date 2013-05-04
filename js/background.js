/*
 * Copyright (C) 2012-2013 DuckDuckGo, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function Background()
{
    $this = this;
    chrome.extension.onMessage.addListener(function(request, sender, callback){
        console.log(request);
        if(request.query)
            $this.query(request.query, callback);
        if (request.newtab)
            $this.newtab(request.newtab);
    });


}

Background.prototype.query = function(query, callback) 
{
    var req = new XMLHttpRequest();
    req.open('GET', 'http://m.aol.com/search/default/search.do?query=' + encodeURIComponent(query) + '&invocationType=topsearchbox.waphome&sources=google_websearch&first=0', true);

    req.onreadystatechange = function(data) {
        if (req.readyState != 4)  { return; } 
        var r = $(req.responseText);
        callback(r);
    }

    req.send(null);
}

Background.prototype.newtab = function(tab)
{
    chrome.tabs.create({url: tab});
    return;
}

var background = new Background();
