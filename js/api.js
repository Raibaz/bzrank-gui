(function(w, $) {
	
	var mongoHost = "localhost";
	var mongoPort = 27080;
	var mode = 'latest';
	var latestGameId = -1;

	var Api = function() {
		
	};

	Api.prototype.setMode = function(newMode) {
		mode = newMode;
	};

	Api.prototype.getLatestGameId = function() {
		var self = this;
		var params = {
			"sort" : {
				"start": "-1"
			},		
			"limit" : 1
		};

		var ret = $.Deferred();
		executeGet('/games', 'find', params).done(function(resp) {					
			latestGameId = resp.results[0].start;								
			ret.resolve(self.latestGameId);
		});	
		return ret;
	};

	Api.prototype.getKillsByPlayer = function() {		
		return getCountByField('playerkilled', 'target');
	};

	Api.prototype.getPassiveKillsByPlayer = function() {		
		return getCountByField('playerkilled', 'player');
	};

	Api.prototype.getKillsByFlag = function() {		
		return getCountByField('playerkilled', 'argument');
	};

	Api.prototype.getShotsByPlayer = function() {		
		return getCountByField('shotfired', 'player');
	};

	var getCountByField = function(variable, field) {
		var command = {
			"aggregate": "events",
			"pipeline": [
				{
					$match: {
						"@type": variable
					}
				},
				{
					$group: {
						_id: {
							"label": "$@" + field
						}, 
						count: {
							$sum: 1
						}
					}
				}
			]
		};

		if(mode === 'latest') {
			command.pipeline[0]['$match']['@game'] = latestGameId;
		}
	
		var ret = $.Deferred();
		executePost('/events', command).done(function(resp) {
			var result = [];
			$.each(resp.result, function(index, val) {								
				result.push({
					label: val['_id']['label'],
					count: val.count
				});
			});
			ret.resolve(result);
		});
		return ret;
	};

	Api.prototype.getNemeses = function() {

		var command = {
			"aggregate": "events",
			"pipeline": [
				{
					$match: {
						"@type": 'playerkilled'
					}
				},
				{
					$group: {
						_id: {
							"killer": "$@target",
							"killed": "$@player"
						}, 
						count: {
							$sum: 1
						}
					}
				},
				{ $sort: { count: -1 } },
				{ $limit: 10}
			]
		};

		if(mode === 'latest') {
			command.pipeline[0]['$match']['@game'] = latestGameId;
		}
		
		
		var ret = $.Deferred();
		executePost('/events', command).done(function(resp) {
			var result = [];			
			$.each(resp.result, function(index, val) {								
				result.push({
					label: val['_id']['killer'] + " vs. " + val['_id']['killed'],
					count: val.count
				});
			});
			ret.resolve(result);
		});
		return ret;
	};

	Api.prototype.getPickupsByPlayer = function() {
		var command = {
			"aggregate": "events",
			"pipeline": [
				{
					$match: {
						"@type": 'flaggrabbed'
					}
				},
				{
					$group: {
						_id: {
							"flag": "$@target",
							"player": "$@player"
						}, 
						count: {
							$sum: 1
						}
					}
				},
				{ $sort: { count: -1 } },
				{ $limit: 20}
			]
		};

		if(mode === 'latest') {
			command.pipeline[0]['$match']['@game'] = latestGameId;
		}
		
		
		var ret = $.Deferred();
		executePost('/events', command).done(function(resp) {
			var result = [];			
			$.each(resp.result, function(index, val) {								
				result.push({
					label: val['_id']['player'] + " - " + val['_id']['flag'],
					count: val.count
				});
			});
			ret.resolve(result);
		});
		return ret;
	};

	var executeGet = function(collection, command, params) {
		var url = "http://" + mongoHost + ":" + mongoPort + "/bzrank" + collection + "/_" + command + '?' + $.param(params);
		return $.get(url, null, 'json');
	};

	var executePost = function(collection, command) {
		var url = "http://" + mongoHost + ":" + mongoPort + "/bzrank" + collection + "/_cmd";
		return $.post(url, 'cmd=' + JSON.stringify(command), null, 'json');
	};

	window.api = new Api();

})(window, jQuery);