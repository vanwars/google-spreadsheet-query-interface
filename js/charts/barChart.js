var BarChart = function(opts){
    this.type = 'barChart';
    this.activeEntryID = -1;
    this.callback = 'visPage.barChart.processResponse';
    this.entries = {};
    $.extend(this, opts);
};

BarChart.prototype = new Chart();

BarChart.prototype.renderVis = function(e, column){
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

BarChart.prototype.addSeries = function(column) {
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

BarChart.prototype.removeSeries = function(column) {
    this.entries[column.id] = null;
    delete this.entries[column.id];
    this.renderChart();
};

BarChart.prototype.getTitle = function(column) {
    for(k in this.entries) {
        return this.entries[k].column.name;
    }
    return ''
};

BarChart.prototype.processResponse = function(response) {
    this.addEntry(response);
    this.renderChart();
};

BarChart.prototype.addEntry = function(response) {
    var data = {};
    $.each(response.table.rows, function(){
        data[this.c[0].v] = this.c[1].v;  
    });
    this.entries[this.activeEntryID].data = data;
};

BarChart.prototype.getTable = function(){
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


BarChart.prototype.getCategories = function() {
    var keys = [];
    for(k in this.getTable().data) {
        keys.push(k);
    }
    return keys;
};

BarChart.prototype.getSeries = function() {
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

BarChart.prototype.renderChart = function() {  
    var chart = new Highcharts.Chart({
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
