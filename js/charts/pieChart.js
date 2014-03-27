var PieChart = function(opts){
    this.type = 'pieChart';
    this.title = null;
    this.data = [];
    this.callback = 'visPage.charts.pieChart.processResponse';
    $.extend(this, opts);
};

PieChart.prototype = new Chart();

PieChart.prototype.renderChart = function() {
    this.chart = new Highcharts.Chart({
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
};

PieChart.prototype.getOpts = function(){
    //get simplest set of options to re-create the chart:
    return {
        chart: {
            renderTo: this.chart.options.chart.renderTo,
            type: this.chart.options.chart.type
        },
        title: this.chart.options.title,
        credits: {
            enabled: false
        },
        series: this.chart.options.series
    };
};

