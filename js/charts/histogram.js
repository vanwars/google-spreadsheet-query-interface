var Histogram = function(opts){
    this.type = 'histogram';
    this.activeEntryID = -1;
    this.callback = 'visPage.charts.histogram.processResponse';
    this.entries = {};
    $.extend(this, opts);
};

Histogram.prototype = new Chart();

Histogram.prototype.renderVis = function(e, column){
    if (e.ctrlKey || e.metaKey) {
        //if the control or option key are down:
        if (!column.isActive())
            column.htmlEntry.addClass("active");
        else
            column.htmlEntry.removeClass("active");
    }
    else {
        //clear out data and start again:
        this.entries = {};
        $('#menu a').removeClass("active");
        column.htmlEntry.addClass("active");
    }
    
    if (column.isActive())
        visPage.getActiveChart().addSeries(column);
    else
        visPage.getActiveChart().removeSeries(column);  
};

Histogram.prototype.addSeries = function(column) {
    this.entries[column.id] = {
        column: column,
        data: null
    };
    this.activeEntryID = column.id;
    this.querySpreadsheet({
        sql: column.getSQL(),
        callback: this.callback
    });
};

Histogram.prototype.removeSeries = function(column) {
    this.entries[column.id] = null;
    delete this.entries[column.id];
    this.renderChart();
};

Histogram.prototype.getTitle = function(column) {
    for(k in this.entries) {
        return this.entries[k].column.name;
    }
    return ''
};

Histogram.prototype.processResponse = function(response) {
    this.addEntry(response);
    this.renderChart();
};

Histogram.prototype.addEntry = function(response) {
    var data = {};
    $.each(response.table.rows, function(){
        data[this.c[0].v] = this.c[1].v;  
    });
    this.entries[this.activeEntryID].data = data;
};

Histogram.prototype.getTable = function(){
    //convert the column entries into a flat data table:
    var table = {
        columns: [],
        data: {}
    };
    
    //populate the table dictionary with all of the keys and empty arrays:
    for(k in this.entries) {
        for(j in this.entries[k].data) {
            table.data[j] = [];
        }
    }
    
    //populate the table dictionary's values:
    for(k in this.entries) {
        table.columns.push(this.entries[k].column.name);
        var data = this.entries[k].data;
        for(j in table.data) {
            if(data[j] != null)
                table.data[j].push(data[j]);   
            else
                table.data[j].push(0);    
        }
    }
    return table;
};


Histogram.prototype.getCategories = function() {
    var keys = [];
    for(k in this.getTable().data) {
        keys.push(k);
    }
    return keys;
};

Histogram.prototype.getSeries = function() {
    var table = this.getTable();
    var series = [];
    for(var i=0; i < Object.keys(this.entries).length; i++) {
        var data = [];
        for(k in table.data) {
            data.push(table.data[k][i]);
        }
        series.push({
            data: data,
            name: table.columns[i]
        }); 
    }
    return series;
};

Histogram.prototype.renderChart = function() {  
    this.chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        title: {
            text: (Object.keys(this.entries).length == 1) ? this.getTitle() : ''
        },
        xAxis: {
            categories: this.getCategories()
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Counts'
            }
        },
        legend: {
            enabled: (Object.keys(this.entries).length > 1) ? true : false,
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

Histogram.prototype.getOpts = function(){
    //get simplest set of options to re-create the chart:
    return {
        chart: {
            renderTo: this.chart.options.chart.renderTo,
            type: this.chart.options.chart.type
        },
        title: this.chart.options.title,
        xAxis: this.chart.options.xAxis,
        legend: {
            enabled: this.chart.options.legend.enabled,
            labelFormatter: this.chart.options.legend.labelFormatter
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            column: {
                groupPadding: this.chart.options.plotOptions.column.groupPadding,
                pointPadding: this.chart.options.plotOptions.column.pointPadding,
                borderWidth: this.chart.options.plotOptions.column.borderWidth
            }
        },
        series: this.chart.options.series
    };
};
