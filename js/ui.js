(function(w, $) {
	
	$(document).ready(function() {
		$('#mode').change(function(event) {
			w.api.setMode($(this).val());
			w.drawCharts();
		});
	});

})(window, jQuery);