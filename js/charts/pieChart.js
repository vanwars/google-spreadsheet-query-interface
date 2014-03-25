var PieChart = function(opts){
    this.type = 'pieChart';
    this.title = null;
    this.data = [];
    this.callback = 'visPage.charts.pieChart.processResponse';
    $.extend(this, opts);
};

PieChart.prototype = new Chart();

PieChart.prototype.renderChart = function() {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'pie'
        },
        title: {
            text: this.title
        },
        credits: {
            enabled: false
        },
        series: [
            {
                data: this.data
            }
        ]
    });
}

