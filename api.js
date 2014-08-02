(function(w, $) {
	
	var mongoHost = "localhost";
	var mongoPort = 27080;

	var Api = function(){
		this.latestGameId = -1;
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
			self.latestGameId = resp.results[0].start;								
			ret.resolve(self.latestGameId);
		});	
		return ret;
	};

	Api.prototype.getKillsByPlayer = function(game) {
		if(!game) {
			game = self.latestGameId;
		}
		return getCountByField('playerkilled', 'player', game);
	};

	Api.prototype.getKillsByFlag = function(game) {
		if(!game) {
			game = self.latestGameId;
		}
		return getCountByField('playerkilled', 'argument', game);
	};

	var getCountByField = function(variable, field, game) {
		var command = {
			"aggregate": "events",
			"pipeline": [
				{
					$match: {
						"@type": variable,
						"@game": game
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

	var executeGet = function(collection, command, params) {
		var url = "http://" + mongoHost + ":" + mongoPort + "/bzrank" + collection + "/_" + command + '?' + $.param(params);
		return $.get(url, null, 'json');
	};

	var executePost = function(collection, command) {
		var url = "http://" + mongoHost + ":" + mongoPort + "/bzrank" + collection + "/_cmd";
		return $.post(url, 'cmd=' + JSON.stringify(command), null, 'json');
	};

	window.Api = Api;

})(window, jQuery);