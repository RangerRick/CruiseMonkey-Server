var CMUtils={getSummary:function(a){return $(a).find("div.summary").text()}};function Scroll(a,b){this.enabled=a;this.timeout=b}function ScrollManager(){var c=null,b=true,a=this;a.delay=500;a.onScrollStart=function(f){};a.onScrollStop=function(f){};a.disable=function(){console.log("ScrollManager::disable()");b=false};a.enable=function(){console.log("ScrollManager::enable()");b=true};var e=function(){var f=b;if(c===null){console.log("ScrollManager::onScrollStart(): scrolling started (enabled = "+f+")");a.onScrollStart(f);c=new Scroll(f,setTimeout(d,a.delay))}else{clearTimeout(c.timeout);c.timeout=setTimeout(d,a.delay)}},d=function(g){var f=c.enabled;console.log("ScrollManager::onScrollStop() (enabled = "+f+")");clearTimeout(c.timeout);c.timeout=null;c=null;a.onScrollStop(f)};$(window).scroll(e)};function PageElement(e,b,d){if(!e||!b||d===undefined){throw new TypeError("You must pass an element, element ID, and match index!")}var c=e,a=b,f=d;this.getElement=function(){return c};this.getId=function(){return a};this.getIndex=function(){return f};this.toString=function(){return a+" ("+f+")"}}function PageTracker(c,f){if(!c||!f){throw new TypeError("You must pass an Amplify storage class and an element match criteria!")}var a=c,g=f,d=this;d.getScrolledId=function(i){console.log("PageTracker::getScrolledId("+i+")");if(!i){throw new TypeError("You must specify a page!")}return e()[i]};d.setScrolledId=function(j,k){console.log("PageTracker::setScrolledId("+j+", "+k+")");if(!j){throw new TypeError("You must specify a page!")}var i=e();i[j]=k;h(i);return k};d.getTopElement=function(j){var i=b(j);if(i){return i}return null};d.isElementInViewport=function(j){var i=j.offsetTop,k=j.offsetHeight;while(j.offsetParent){j=j.offsetParent;i+=j.offsetTop}return(i>=window.pageYOffset&&(i+k)<=(window.pageYOffset+window.innerHeight))};var e=function(){var i=a.store("page_store_cache");if(!i){i={}}return i},h=function(i){a.store("page_store_cache",i)},b=function(j){var m=d.getScrolledId(j),k=$("#"+j),i=null,l=null;k.find(g).each(function(n,o){l=$(o).attr("id");if(l==m){i=new PageElement(o,l,n);console.log("PageTracker::getElementForPageId("+j+"): matched "+i.toString());return false}return true});return i}};function PageNavigator(a,c,d,f){if(!a||!c||!d||!f){throw new TypeError("You must specify an Amplify storage class, page tracker, default page, and an element criteria!")}var b=a,g=c,h=d,e=f,i=this;i.getCurrentPage=function(){var j=b.store("current_page");console.log("PageNavigator::getCurrentPage(): current_page = "+j);if(!j||j=="login"){j=h;a.store("current_page",j)}return j};i.findTopVisibleElement=function(){console.log("PageNavigator::findTopVisibleElement()");var j=null,k=i.getCurrentPage(),l=null;$("#"+k).find(e).each(function(n,o){if(g.isElementInViewport(o)){l=$(o).attr("id");if(l){var m=CMUtils.getSummary(o);console.log("PageNavigator::findTopVisibleElement(): first visible element on "+k+": "+m+" ("+l+")");g.setScrolledId(k,l);j=o;return false}}return true});return j}};if(!Array.prototype.indexOf){Array.prototype.indexOf=function(b){var a=this.length>>>0,c=Number(arguments[1])||0;c=(c<0)?Math.ceil(c):Math.floor(c);if(c<0){c+=a}for(;c<a;c++){if(c in this&&this[c]===b){return c}}return -1}}function TemplateLoader(e){var b=this,g=e||[],a=0,f=0,c=[],d=function(){if((a+f)==g.length){b.onFinished()}};f_onLoad=function(h,i){console.log("TemplateLoader::f_onLoad("+h+", <template>)");c[h]=i;a++;b.onLoad(h,i);d()},f_onFail=function(h){console.log("TemplateLoader::f_onFail("+h+")");f++;b.onFail(h);d()},f_loadTemplate=function(h){console.log("TemplateLoader::f_loadTemplate("+h+")");(function(){var j=function(k){f_onLoad(h,k)},i=function(){f_onFail(h)};$.ajax({url:h,success:j,error:i,dataType:"text"})})()};b.add=function(h){g.push(h)};b.remove=function(h){g.splice(g.indexOf(h),1)};b.clear=function(){g=[]};b.urls=function(){return g.slice(0)};b.getTemplate=function(h){return c[h]};b.renderTemplate=function(h,j){if(!j){j={}}var i=c[h];return Mustache.to_html(i,j)};b.load=function(){console.log("TemplateLoader::load()");for(var i in g){var h=g[i];console.log("TemplateLoader::load(): loading "+h);f_loadTemplate(h)}};b.onLoad=function(h){};b.onFail=function(h){};b.onFinished=function(){}};var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],months=["January","February","March","April","May","June","July","August","September","October","November","December"];function formatTime(e,c){var a,b;a=String("0"+(e.getHours()%12)).slice(-2);if(a=="00"){a="12"}b=a+":"+String("0"+e.getMinutes()).slice(-2);if(c===true){b+=":"+String("0"+e.getSeconds()).slice(-2)}if((e.getHours()%12)==e.getHours()){b+="am"}else{b+="pm"}return b}function formatDate(a){return days[a.getDay()]+", "+months[a.getMonth()]+" "+a.getDate()}function getDateFromString(d){if(d instanceof Date){return new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),0,0)}var b=d.split("T"),a=b[0].split("-"),c=b[1].split(":");return new Date(a[0],a[1]-1,a[2],c[0],c[1],0,0)}function padNumber(a){return(String("0"+a).slice(-2))}function getStringFromDate(a){return a.getFullYear()+"-"+padNumber(a.getMonth()+1)+"-"+padNumber(a.getDate())+"T"+padNumber(a.getHours())+":"+padNumber(a.getMinutes())+":"+padNumber(a.getSeconds())+"-00:00"};console.log("app.js loading");var eventsModel;ko.bindingHandlers.dateString={update:function(b,c,h,a){var f=c(),e=h();var g=ko.utils.unwrapObservable(f);var d=e.datePattern||"MM/dd/yyyy hh:mm:ss";$(b).text(g.toString(d))}};function Event(b){var a=this;a.id=ko.observable(b["@id"].replace(/[\W\@]+/g,""));a.summary=ko.observable(b.summary);a.description=ko.observable(b.description);a.start=ko.observable(new Date(b.start));a.end=ko.observable(new Date(b.end));a.location=ko.observable(b.location);a.createdBy=ko.observable(b["created-by"]);a.owner=ko.observable(b.owner);a.timespan=ko.computed(function(){var e=e===null?null:formatTime(a.start(),false);var c=c===null?null:formatTime(a.end(),false);var d="";if(e!=null){d+=e;if(c!=null){d+="-"+c}}return d},a)}var matchEventText=function(b,a){if(b.summary().toLowerCase().search(a)!=-1){return true}else{if(b.description().toLowerCase().search(a)!=-1){return true}else{return false}}};var onFilterChange=function(){};function ServerModel(){var a=this;a.cruisemonkey=ko.observable(amplify.store("cruisemonkey_url"));a.statusnet=ko.observable(amplify.store("statusnet_url"));a.username=ko.observable(amplify.store("username"));a.password=ko.observable(amplify.store("password"));a.reset=function(){a.cruisemonkey(amplify.store("cruisemonkey_url"));a.statusnet(amplify.store("statusnet_url"));a.username(amplify.store("username"));a.password(amplify.store("password"))};a.persist=function(){amplify.store("cruisemonkey_url",a.cruisemonkey());amplify.store("statusnet_url",a.statusnet());amplify.store("username",a.username());amplify.store("password",a.password())};if(!a.cruisemonkey()){a.cruisemonkey("http://localhost:8088")}if(!a.statusnet()){a.statusnet("http://localhost/statusnet")}}var serverModel=new ServerModel();function EventsViewModel(){var a=this;a.events=ko.observableArray();a.updateData=function(b){var c=$.map(b.event,function(g){var f=ko.utils.arrayFirst(a.events(),function(i){if(i){g["@id"]=g["@id"].replace(/[\W\@]+/g,"");if(i.id()==g["@id"]){return true}else{return false}}else{console.log("no entry")}});if(f){var d=new Date(g.start);var h=new Date(g.end);var e=g["created-by"];if(f.summary()!=g.summary){f.summary(g.summary)}if(f.description()!=g.description){f.description(g.description)}if(f.start().getTime()!=d.getTime()){f.start(d)}if(f.end().getTime()!=h.getTime()){f.end(h)}if(f.createdBy()!=e){f.createdBy(e)}if(f.owner()!=g.owner){f.owner(g.owner)}return f}else{return new Event(g)}});a.events(c);amplify.store("events",b)};a.updateDataFromJSON=function(){$.getJSON(serverModel.cruisemonkey()+"/rest/events?callback=?",a.updateData)};a.updateDataFromJSON()}eventsModel=new EventsViewModel();if(typeof(Storage)!=="undefined"){var restEvents=amplify.store("events");if(restEvents){console.log("loading stored ReST events");eventsModel.updateData(restEvents)}else{console.log("no stored ReST events")}}function OfficialEventsModel(){var a=this;a.filter=ko.observable("");a.events=eventsModel.events}var officialEventsModel=new OfficialEventsModel();officialEventsModel.filter.subscribe(onFilterChange,officialEventsModel);officialEventsModel.filteredEvents=ko.dependentObservable(function(){var b=this;var c=b.filter().toLowerCase();var a=ko.utils.arrayFilter(b.events(),function(d){if(d.owner()!="admin"){return false}return true});if(!c){return a}else{return ko.utils.arrayFilter(a,function(d){return matchEventText(d,c)})}},officialEventsModel);function MyEventsModel(){var a=this;a.filter=ko.observable("");a.events=eventsModel.events}var myEventsModel=new MyEventsModel();myEventsModel.filter.subscribe(onFilterChange,myEventsModel);myEventsModel.filteredEvents=ko.dependentObservable(function(){var b=this,c=b.filter().toLowerCase(),a=ko.utils.arrayFilter(b.events(),function(d){if(d.owner()=="admin"){return false}return true});if(!c){return a}else{return ko.utils.arrayFilter(a,function(d){return matchEventText(d,c)})}},myEventsModel);var navModel={signedIn:ko.observable(false)};navModel.notSignedIn=ko.dependentObservable(function(){var a=this;return !a.signedIn()},navModel);console.log("app.js loaded");console.log("init.js loading");var pages={};var page_scroll_element=[];var online=false;var scrollManager=new ScrollManager();scrollManager.delay=100;scrollManager.onScrollStart=function(a){if(a){console.log("scrolling started while enabled")}else{console.log("scrolling started while disabled")}};scrollManager.onScrollStop=function(a){if(a){var b=pageNavigator.findTopVisibleElement();if(b){console.log("visible element: "+CMUtils.getSummary(b)+" ("+$(b).attr("id")+")")}else{console.log("no elements visible!")}}else{console.log("scrolling stopped while disabled")}};var templates=["views/header.html","views/events.html","views/login.html"];var templateLoader=new TemplateLoader(templates);templateLoader.onLoad=function(a){switch(a){case"views/events.html":createOfficialEventsView();createMyEventsView();break;case"views/login.html":createLoginView();break}};templateLoader.onFinished=function(){setupDefaultView()};var pageTracker=new PageTracker(amplify,".scrollable"),pageNavigator=new PageNavigator(amplify,pageTracker,"official-events",".calendar-event"),setOffline=function(){console.log("setOffline()");if(online==true){console.log("setOffline: we were online but have gone offline")}online=false;navModel.signedIn(false);console.log("online = "+online)},setOnline=function(){console.log("setOnline()");if(online==false){console.log("setOnline: we were offline but have gone online")}online=true;navModel.signedIn(true);console.log("online = "+online)},isOnline=function(){return online},isSignedIn=function(){return online&&loginModel.username()&&loginModel.username().length>0};function onDeviceReady(a){console.log("Device is ready.  Initializing.");templateLoader.load()}var _header,_container;function getHeader(){if(!_header){_header=$("body").find("#header")}return _header}function getContainer(){if(!_container){_container=$("body").find("#content")}return _container}function setupHeader(){console.log("setupHeader()");header=getHeader();header.html(templateLoader.renderTemplate("views/header.html"));var a=$(header).find("nav")[0];$(a).find("a").each(function(b,c){var d=undefined;if(c.href!==undefined){d=c.href.split("#")[1]}if(d!==undefined&&d!=""){$(c).on("click.fndtn touchstart.fndtn",function(f){console.log("navigation event: "+d);navigateTo(d)})}});$(document).foundationTopBar();$(a).find(".signin").each(function(b,c){$(c).on("click.fndtn touchstart.fndtn",function(d){setOffline();navigateTo("login")})});$(a).find(".signout").each(function(b,c){$(c).on("click.fndtn touchstart.fndtn",function(d){setOffline();serverModel.username(null);serverModel.password(null);navigateTo("login")})});ko.applyBindings(navModel,a)}function navigateTo(a){console.log("----------------------------------------------------------------------------------");console.log("navigateTo("+a+")");scrollManager.disable();if(a=="official-events"){showOfficialEventsView()}else{if(a=="my-events"){showMyEventsView()}else{if(a=="login"){showLoginView()}else{console.log("unknown page ID: "+a);return false}}}var b=pageTracker.getTopElement(a);if(!b||b.getIndex()==0){console.log("scrolling to the top of the page");setTimeout(function(){$("body").scrollTo(0,0,{onAfter:function(){setTimeout(function(){scrollManager.enable()},50)}})},0)}else{console.log("scrolling to "+b.toString());setTimeout(function(){$("body").scrollTo("#"+b.getId(),0,{margin:false,offset:{left:0,top:-45},onAfter:function(){setTimeout(function(){scrollManager.enable()},50)}})},0)}return true}function checkIfAuthorized(c,b){console.log("checkIfAuthorized()");var d=amplify.store("username");var a=amplify.store("password");if(!d||!a){b();return}$.ajax({url:serverModel.statusnet()+"/api/help/test.json",dataType:"json",type:"POST",beforeSend:function(e){e.setRequestHeader("Authorization","Basic "+btoa(d+":"+a))},username:d,password:a,success:function(e){if(e=="ok"){setOnline();console.log("test returned OK");c();return}else{setOnline();console.log("success function called, but data was not OK!");b();return}}}).error(function(e){if(e&&e.readyState==0){setOffline()}else{setOnline()}console.log("An error occurred: "+ko.toJSON(e));b()})}var showLoginOrCurrent=function(){var a=pageNavigator.getCurrentPage();checkIfAuthorized(function(){console.log("checkIfAuthorized: success");navigateTo(a)},function(){console.log("checkIfAuthorized: failure");navigateTo("login")})};function setupDefaultView(){console.log("setupDefaultView()");setupHeader();showLoginOrCurrent()}function replaceCurrentPage(a){console.log("replaceCurrentPage("+a+")");var c=$("#"+a);var b=c.find("input[type=search]").first();getContainer().children().css("display","none");c.css("display","block");if(!Modernizr.touch){if(b){b.focus()}}if(a!="login"){amplify.store("current_page",a)}return getContainer()[0]}function createOfficialEventsView(){console.log("createOfficialEventsView()");if(!pages.official){var b=templateLoader.renderTemplate("views/events.html",{eventType:"official"});var c=document.createElement("div");c.setAttribute("id","official-events");$(c).css("display","none");$(c).html(b);var a=getContainer()[0].appendChild(c);pages.official=c;ko.applyBindings(officialEventsModel,a)}}function showOfficialEventsView(){console.log("showOfficialEventsView()");createOfficialEventsView();var a=replaceCurrentPage("official-events");$(a).find("ul.event-list").css("display","block")}function createMyEventsView(){console.log("createMyEventsView()");if(!pages.my){var b=templateLoader.renderTemplate("views/events.html",{eventType:"my"});var c=document.createElement("div");c.setAttribute("id","my-events");$(c).css("display","none");$(c).html(b);var a=getContainer()[0].appendChild(c);pages.my=c;ko.applyBindings(myEventsModel,a)}}function showMyEventsView(){console.log("showMyEventsView()");createMyEventsView();var a=replaceCurrentPage("my-events");$(a).find("ul.event-list").css("display","block")}function createLoginView(){console.log("createLoginView()");if(!pages.login){var b=templateLoader.renderTemplate("views/login.html");var c=document.createElement("div");c.setAttribute("id","login");$(c).css("display","none");$(c).html(b);$(c).find("#login_reset").on("click.fndtn touchstart.fndtn",function(d){console.log("cancel clicked");serverModel.reset()});$(c).find("#login_save").on("click.fndtn touchstart.fndtn",function(d){console.log("save clicked");serverModel.persist();setupDefaultView()});var a=getContainer()[0].appendChild(c);pages.login=c;ko.applyBindings(serverModel,a)}}function showLoginView(){console.log("showLoginView()");createLoginView();var a=replaceCurrentPage("login")}console.log("init.js loaded");var statusNetOptions={statusNetRoot:"http://192.168.211.118/statusnet/api",consumerKey:"a22883fe2cb484a15fb410720090611c",consumerSecret:"b6b73c89064dadaa5312806af43d5efb"},requestParams,accessParams,oauth;var verifyCredentials=function(b,a,c){console.log("verifying credentials");b.get(statusNetOptions.statusNetRoot+"/oauth/account/verify_credentials.json?skip_status=true",function(d){entry=JSON.parse(d);console.log("Success getting credentials. Account = "+entry.screen_name);amplify.store.sessionStorage("twitter_entry",entry);if(a){a(entry)}},function(d){console.log("Failed to get credentials.");amplify.store("oauth_data",null);amplify.store.sessionStorage("twitter_entry",null);if(c){c()}})};var doOAuth=function(){var c=$.url(document.URL);var a=c.param("oauth_token");var b=c.param("oauth_verifier");var e;var f;var d=amplify.store("oauth_data");if(d){statusNetOptions.accessTokenKey=d.accessTokenKey;statusNetOptions.accessTokenSecret=d.accessTokenSecret}console.log("url = "+document.URL);console.log("oauth_token = "+a);console.log("oauth_verifier = "+b);if(statusNetOptions.accessTokenKey&&statusNetOptions.accessTokenSecret){console.log("We have stored oauth data.  Verifying credentials: "+ko.toJSON(d));if(!oauth){console.log("creating oauth object");oauth=OAuth(statusNetOptions)}verifyCredentials(oauth)}else{console.log("No stored oauth data, starting from scratch.");if(!oauth){console.log("creating oauth object");oauth=OAuth(statusNetOptions)}oauth.get(statusNetOptions.statusNetRoot+"/oauth/request_token",function(h){console.log("passed oauth");console.dir(h);if(!h.text||h.text===""){console.log("text is invalid");return}requestParams=h.text;f=window.open(statusNetOptions.statusNetRoot+"/oauth/authorize?"+requestParams);var g=setInterval(function(){var i=$(f.document).find("#oauth_pin").text();if(i&&i.length>1){console.log("found pin: "+i);clearInterval(g);f.close();oauth.get(statusNetOptions.statusNetRoot+"/oauth/access_token?oauth_verifier="+i+"&"+requestParams,function(l){accessParams={};var n=l.text.split("&");for(var j=0;j<n.length;j++){var m=n[j].split("=");accessParams[m[0]]=decodeURIComponent(m[1])}console.log("success: "+ko.toJSON(l));oauth.setAccessToken([accessParams.oauth_token,accessParams.oauth_token_secret]);var k={};k.accessTokenKey=accessParams.oauth_token;k.accessTokenSecret=accessParams.oauth_token_secret;amplify.store("oauth_data",k);statusNetOptions.accessTokenKey=k.accessTokenKey;statusNetOptions.accessTokenSecret=k.accessTokenSecret;verifyCredentials(oauth)},function(j){console.log("Error: authorization failed: "+ko.toJSON(j))})}},200)},function(g){console.log("failed oauth");console.dir(g)})}};