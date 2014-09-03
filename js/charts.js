(function (w, $) {

    var api = w.api;
    w.drawCharts = function () {
        $('.chart').html('<img class="loader" src="img/ajax-loader.gif"/>');

        api.init().then(function () {
            $('#gameTimestamp').html(api.getGameTimestamp());

            for (var chartId in activeCharts) {
                (function (id, data){
                    api[ data['api'] ]().then(function (result) {
                        drawChart(
                            data['chartType'],
                            id,
                            data['title'],
                            data['labels'],
                            result
                        );
                    });
                })(chartId, activeCharts[chartId]);
            }
        });
    };

    var activeCharts = {
        "points-chart": {
            api: 'getPointsByPlayer',
            chartType: 'Column',
            title: 'Points made',
            labels: ['Player', 'Points']
        },
        "efficiency-chart": {
            api: 'getShotEfficiency',
            chartType: 'Column',
            title: 'Shot Efficiency (Shots / Kills)',
            labels: ['Player', 'Ratio']
        },
        "kills-chart": {
            api: 'getKillsByPlayer',
            chartType: 'Column',
            title: 'Kills made',
            labels: ['Player', 'Kills']
        },
        "passive-kills-chart": {
            api: 'getPassiveKillsByPlayer',
            chartType: 'Column',
            title: 'Kills received',
            labels: ['Player', 'Kills']
        },
        "nemeses-chart": {
            api: 'getNemeses',
            chartType: 'Column',
            title: 'Best nemeses',
            labels: ['Players', 'Kills']
        },
        "shots-chart": {
            api: 'getShotsByPlayer',
            chartType: 'Column',
            title: 'Shots count',
            labels: ['Player', 'Shots']
        },
        "favflags-chart": {
            api: 'getFavoriteFlags',
            chartType: 'Column',
            title: 'Favorite flags',
            labels: ['Players-flags', 'Kills']
        },
        "flags-chart": {
            api: 'getKillsByFlag',
            chartType: 'Pie',
            title: 'Most effective flags',
            labels: ['Flag', 'Kills']
        },
        "pickups-chart": {
            api: 'getPickupsByPlayer',
            chartType: 'Column',
            title: 'Most picked up flags (Useful flags only: L, GM, ST, CL, SW, G',
            labels: ['Players', 'pickups']
        },
        "games-chart": {
            api: 'getGamesPlayedByPlayer',
            chartType: 'Column',
            title: 'Games played',
            labels: ['Player', 'Games']
        }
    };


    /**
     * @param chartType
     * @param targetDiv
     * @param title
     * @param labels
     * @param data
     */
    var drawChart = function (chartType, targetDiv, title, labels, data) {
        var table = new google.visualization.DataTable();
        table.addColumn('string', labels[0]);
        table.addColumn('number', labels[1]);
        $.each(data, function (index, val) {
            table.addRow([val.label, val.count]);
        });

        var options = {
            'title': title,
            'width': 400,
            'height': 300,
            'is3D': true
        };

        // Instantiate and draw our chart, passing in some options.
        var chartConstructor = chartType + 'Chart';
        var chart = new w.google.visualization[chartConstructor](document.getElementById(targetDiv));
        chart.draw(table, options);
    }
})(window, jQuery);
