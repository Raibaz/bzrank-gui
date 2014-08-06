(function(w, $) {

	var api = w.api;
	w.drawCharts = function() {		
		$('.chart').html('<img class="loader" src="img/ajax-loader.gif"/>');
		api.init().then(drawCharts);		
	};

	var drawCharts = function() {
		drawKills('kills-chart');
		drawPassiveKills('passive-kills-chart');
		drawFlags('flags-chart');
		drawShots('shots-chart');
		drawShotEfficiency('efficiency-chart');
		drawNemeses('nemeses-chart');
		drawFlagPickups('pickups-chart');
	};

	var drawKills = function(targetDiv) {	
		api.getKillsByPlayer().then(function(result) {
			drawChart('Column', targetDiv, 'Kills made', ['Player', 'Kills'], result);		
		});	
	};

	var drawPassiveKills = function(targetDiv) {	
		api.getPassiveKillsByPlayer().then(function(result) {
			drawChart('Column', targetDiv, 'Kills received', ['Player', 'Kills'], result);		
		});	
	};

	var drawFlags = function(targetDiv) {		
		api.getKillsByFlag().then(function(result) {			
			drawChart('Pie', targetDiv, 'Most effective flags', ['Flag', 'Kills'], result);
		});
	};

	var drawShots = function(targetDiv) {		
		api.getShotsByPlayer().then(function(result) {			
			drawChart('Column', targetDiv, 'Shots count', ['Player', 'Shots'], result);
		});
	};

	var drawShotEfficiency = function(targetDiv) {		
		api.getShotEfficiency().then(function(result) {			
			drawChart('Column', targetDiv, 'Shot Efficiency (Shots / Kills)', ['Player', 'Ratio'], result);
		});
	};

	var drawNemeses = function(targetDiv) {		
		api.getNemeses().then(function(result) {			
			drawChart('Column', targetDiv, 'Best nemeses', ['Players', 'Kills'], result);
		});
	};

	var drawFlagPickups = function(targetDiv) {		
		api.getPickupsByPlayer().then(function(result) {			
			drawChart('Column', targetDiv, 'Most picked up flags (Useful flags only: L, GM, ST, CL, SW, G', ['Players', 'pickups'], result);
		});
	};

	var drawChart = function(chartType, targetDiv, title, labels, data) {
		var table = new google.visualization.DataTable();
		table.addColumn('string', labels[0]);
		table.addColumn('number', labels[1]);
		$.each(data, function(index, val) {
			table.addRow([val.label, val.count]);
		});

		var options = {
				'title': title,
	            'width': 400,
	            'height': 300,
	        	'is3D': true};

	  // Instantiate and draw our chart, passing in some options.
	  var chartConstructor = chartType + 'Chart';	  	  
	  var chart = new w.google.visualization[chartConstructor](document.getElementById(targetDiv));
	  chart.draw(table, options);
	}
})(window, jQuery);
