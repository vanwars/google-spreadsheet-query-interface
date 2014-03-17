var PieChart = function(){
    this.type = 'pieChart';
    this.title = null;
    this.data = [];
    this.callback = 'visPage.pieChart.processResponse';
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

