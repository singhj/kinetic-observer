function get_site_key(){
    var ak_site_keys = {
      'app': 'your-production-key',
      'qa':  'your-qa-key',
      'dev': 'your-dev-key'
    };
    var host = window.location.host;
    var subdomain = host.split('.')[0];
    if (subdomain == 'app') {
        return ak_site_keys['app'];
    }
    if (subdomain.startsWith('eng')) {
        return ak_site_keys['qa'];
    }
    return ak_site_keys['dev'];
}

function ak_get_user_id() {
    var userField = jQuery('#above-container #welcome').html();
    var welcomeExp = /([\S,]+\s*)([^<]*)(<.*)/;
    var result = userField.match(welcomeExp);
    var user_id = result[2];
    return user_id;
};

function ak_get_session_id() {
        /* Get session id from session cookie */
    var all = document.cookie;  // Get all cookies in one big string
    if (all === "")             // If the property is the empty string
        return 'SessionCookieNotFound';
    var list = all.split("; "); // Split into individual name=value pairs
    for(var i = 0; i < list.length; i++) {  // For each cookie
        var cookie = list[i];
        var p = cookie.indexOf("=");        // Find the first = sign
        var name = cookie.substring(0,p);   // Get cookie name
        if (! name.startsWith('SESS') ) {continue; }
        if (name == 'SESSc0e8b364e63408cdfa06138e6146f9c0') {continue; }
        var value = cookie.substring(p+1);  // Get cookie value
        value = decodeURIComponent(value);  // Decode the value
        return value;
    }
    return 'SessionCookieNotImplemented';
};

/* Do not change anything below this line */
Date.prototype.toISOString = Date.prototype.toISOString || function () {
    function pad(n){return n<10 ? '0'+n : n}
    return this.getUTCFullYear()+'-'
          + pad(this.getUTCMonth()+1)+'-'
          + pad(this.getUTCDate())+'T'
          + pad(this.getUTCHours())+':'
          + pad(this.getUTCMinutes())+':'
          + pad(this.getUTCSeconds())+'Z';
};

function appKineticsPageLoad() {
    var startT = new Date();
    try {
        var url_with_qs = window.location.href;
        var url = url_with_qs.split('?');
        var userid = ak_get_user_id();
        if (userid.length == 0) return;
        var sessionid = ak_get_session_id();
        var args = ((url.length > 1) ? url[1].split('&') : '');
        var msg = {
            'location': document.location.host,
            'function': url[0], 
            'arguments':args, 
            'startT': startT.toISOString().substr(0,19), 
            'agent': navigator.userAgent,
            'user': userid,
            'session': sessionid
        };

        var payload = {
            'source': 'browser', 
            'timestamp': startT.toISOString().substr(0,19), 
            'message': JSON.stringify(msg)
        };
        var queryString = jQuery.param(payload);
        var html = '<img src="'+ak_xhr_url+'collect/?'+queryString+'" alt="ak" border="0" width="1" height="1">';
        jQuery('body').append(html);
    }
    finally {
        return ;
    }
}

function appKineticsAjaxDecorator(f) {
  return function() {
    var startT = new Date();
    var answer = f.apply(this, arguments);
    try {
        var deltaT = ((new Date()).getTime() - startT.getTime())/1000.0;
        var url_with_qs = (arguments["0"].hasOwnProperty("url") ? arguments["0"]["url"] : arguments["0"]);
        var url = url_with_qs.split('?');
        var userid = ak_get_user_id();
        var sessionid = ak_get_session_id();
        var args = (url.length > 1 ? url[1].split('&') : '');
        var msg = {
            'location': document.location.host,
            'function': url[0],
            'arguments':args,
            'startT': startT.toISOString().substr(0,19),
            'deltaT': deltaT,
            'agent': navigator.userAgent,
            'user': userid,
            'session': sessionid
        };

        var payload = {
            'source': 'browser',
            'timestamp': startT.toISOString().substr(0,19),
            'message': JSON.stringify(msg)
        };
        var queryString = jQuery.param(payload);
        var ak_xhr_url = 'https://app-collect.earlystageit.com/api/1/databases/'+get_site_key()+'/collections/main/';
        var html = '<img src="'+ak_xhr_url+'collect/?'+queryString+'" alt="ak" border="0" width="1" height="1">';
        jQuery('body').append(html);
    }
    finally {
        return answer;
    }
  }
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
        return this.slice(0, str.length) == str;
    };
}
