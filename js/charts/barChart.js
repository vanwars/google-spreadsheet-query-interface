var BarChart = function(opts){
    this.type = 'barChart';
    this.callback = 'visPage.charts.barChart.processResponse';
    this.entries = {};
    this.data = [];
    this.chart = null;
    $.extend(this, opts);
};

BarChart.prototype = new Histogram();

BarChart.prototype.addSeries = function(column) {
    this.entries[column.id] = {
        column: column
    };
    if (this.getNumColumns() <= 1) {
        $('#container').empty();
        return;
    }
    var sql = 'SELECT ' + Object.keys(this.entries).sort().join(", ");
    this.querySpreadsheet({
        sql: sql,
        callback: this.callback
    });
};

BarChart.prototype.getNumColumns = function(){
    return Object.keys(this.entries).length;
}

BarChart.prototype.getCategories = function() {
    var keys = [];
    for(k in this.data) {
        keys.push(k);
    }
    return keys;
};


BarChart.prototype.getSeries = function() {
    var series = [];
    var numSeries = this.getNumColumns() - 1;
    for(i=0; i < numSeries; i++) {
        var data = [];
        for(k in this.data) {
            data.push(this.data[k][i]);
        }
        series.push({
            data: data,
            name: 'abcde'
        });
    }   
    return series;
};

BarChart.prototype.processResponse = function(response) {
    var data = {};
    $.each(response.table.rows, function(){
        data[this.c[0].v] = [];
        for(i=1; i < this.c.length; i++) {
            data[this.c[0].v].push(this.c[i].v);
        }
    });
    this.data = data;
    this.renderChart();
};


BarChart.prototype.renderChart = function() {  
    this.chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        title: {
            text: (this.getNumColumns() == 1) ? this.getTitle() : ''
        },
        xAxis: {
            categories: this.getCategories()
        },
        legend: {
            enabled: (this.getNumColumns() > 1) ? true : false,
            labelFormatter: function() {
                var words = this.name.split(/[\s]+/);
                var numWordsPerLine = 10;
                var str = [];
                for (var word in words) {
                    if (word > 0 && word % numWordsPerLine == 0)
                        str.push('<br>');
                     str.push(words[word]);
                }
                return str.join(' ');
            }
        },
        plotOptions: {
            column: {
                groupPadding: 0.2,
                pointPadding: 0,
                borderWidth: 0
            }
        },
        credits: {
            enabled: false
        },
        series: this.getSeries()
    });
};
