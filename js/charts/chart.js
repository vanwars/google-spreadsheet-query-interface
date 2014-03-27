Chart = function(opts){
    this.dataManager = null;
    this.callback = null;
    this.chart = null;
    this.title = 'Untitled';
    this.data = [];
    $.extend(this, opts);
};

Chart.prototype.querySpreadsheet = function(opts) {
    this.dataManager.querySpreadsheet(opts);
};

Chart.prototype.renderVis = function(e, column){
    $('#menu a').removeClass("active");
        column.htmlEntry.addClass("active");
    
    this.querySpreadsheet({
        sql: column.getSQL(),
        callback: this.callback
    });
};

Chart.prototype.processResponse = function(response) {
    var me = this;
    this.title = response.table.cols[0].label;
    this.data = [];
    $.each(response.table.rows, function(){
        me.data.push([
            this.c[0].v.toString(), this.c[1].v]
        );
    });
    this.renderChart();
};

Chart.prototype.renderChart = function() {
    alert("Please override the renderChart method.")
}

Chart.prototype.getOpts = function(){
    //get simplest set of options to re-create the chart:
    return {
        chart: this.chart.options.chart,
        title: this.chart.options.title,
        xAxis: this.chart.options.xAxis,
        legend: this.chart.options.legend,
        credits: {
            enabled: false
        },
        plotOptions: {
            column: this.chart.options.plotOptions.column
        },
        series: this.chart.options.series
    };
};

Chart.prototype.showSourceCode = function(){
    //show options:
    var opts = this.getOpts();
    var src = ''
    src += '<html>\n';
    src += '  <head>\n';
    src += '    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js" type="text/javascript"></script>\n';
    src += '    <script src="http://code.highcharts.com/highcharts.js"></script>\n';
    src += '    <script src="http://code.highcharts.com/modules/exporting.js"></script>\n';
    src += '    <script>\n';
    src += '       function loadChart(){\n';
    src += '           var chart = new Highcharts.Chart(' + JSON.stringify(opts, undefined, 3) + ');\n';
    src += '       }\n';
    src += '    </script>\n';
    src += '  </head>\n';
    src += '  <body onload="loadChart();">\n';
    src += '    <div id="container" style="min-width: 310px; height: 300px; margin: 50 auto"></div>\n'
    src += '  </body>\n';
    src += '</html>\n';
    $('#src').val(src);
    $('#myModal').modal('show');  
};
