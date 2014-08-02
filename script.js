(function(w, $) {

	var api = new w.Api();
	w.drawCharts = function() {		
		api.getLatestGameId().then(drawCharts);		
	};

	var drawCharts = function() {
		drawKills('kills-chart');
		drawFlags('flags-chart');
	};

	var drawKills = function(targetDiv) {	
		api.getKillsByPlayer().then(function(result) {
			drawChart('Column', targetDiv, 'Kills made', ['Player', 'Kills'], result);		
		});	
	};

	var drawFlags = function(targetDiv) {		
		api.getKillsByFlag().then(function(result) {
			console.log(targetDiv);
			console.log(result);
			drawChart('Pie', targetDiv, 'Most effective flags', ['Flag', 'Kills'], result);
		});
	};

	var drawChart = function(chartType, targetDiv, title, labels, data) {
		var table = new google.visualization.DataTable();
		table.addColumn('string', labels[0]);
		table.addColumn('number', labels[1]);
		$.each(data, function(index, val) {
			table.addRow([val.label, val.count]);
		});

		var options = {'title':title,
	             'width':400,
	             'height':300};

	  // Instantiate and draw our chart, passing in some options.
	  var chartConstructor = chartType + 'Chart';	  
	  console.log(document.getElementById(targetDiv));
	  var chart = new w.google.visualization[chartConstructor](document.getElementById(targetDiv));
	  chart.draw(table, options);
	}
})(window, jQuery);
