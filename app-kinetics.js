var ak_xhr_url = "https://app-collect.earlystageit.com/api/1/databases/your-application-key/collections/data-type/";

function ak_get_user_id() {
	var userField = jQuery('a#signout.btn').html();
	var userRE = /(Sign out+\s*)(\S*)/;
	var result = userField.match(userRE);
	var user_id = result[2];
	return user_id;
};

/* Do not change anything below this line */

Date.prototype.toISOString = Date.prototype.toISOString || function () {
	function pad(n){return (n<10 ? '0'+n : n); };
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
		var args = ((url.length > 1) ? url[1].split('&') : '');
		var msg = {
			'location': document.location.host,
				'function': url[0], 
				'arguments':args, 
				'startT': startT.toISOString().substr(0,19), 
				'agent': navigator.userAgent,
				'user': userid
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
			var args = (url.length > 1 ? url[1].split('&') : '');
			var msg = {
				'location': document.location.host,
				'function': url[0], 
				'arguments':args, 
				'startT': startT.toISOString().substr(0,19), 
				'deltaT': deltaT,
					'agent': navigator.userAgent,
					'user': userid
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
				return answer;
		}
	};
}
