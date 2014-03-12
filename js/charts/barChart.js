var BarChart = function(){
    this.numSeries = 1;
    this.data = {};
    this.titles = [];
};

BarChart.prototype.renderFromResponse = function(opts) {
    var me = this;
    var response = opts.response;
    if (opts.clear) {
        this.numSeries = 1;
        this.data = {};
        this.titles = [];
    }
    else {
        ++this.numSeries;
    }
    this.titles.push(response.table.cols[0].label);
    $.each(response.table.rows, function(){
        if(me.data[this.c[0].v] == null)
            me.data[this.c[0].v] = [this.c[1].v];
        else
            me.data[this.c[0].v].push(this.c[1].v);    
    });
    
    // if there are no data values for existing categories in the series,
    // set those data values to 0.
    for(k in this.data) {
        while(this.data[k].length < this.numSeries) {
            this.data[k].push(0);
        }
    }
    
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        title: {
            text: (this.numSeries == 1) ? this.titles[0] : ''
        },
        xAxis: {
            categories: this.getCategories()
        },
        legend: {
            enabled: this.numSeries > 1,
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
    for(var i=0; i < this.data[k].length; i++) {
        var data = [];
        for(k in this.data) {
            data.push(this.data[k][i]);
        }
        
        series.push({
            data: data,
            name:this.titles[i]
        }); 
    }
    return series;
};
