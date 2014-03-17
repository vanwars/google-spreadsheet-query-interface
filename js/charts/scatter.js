var ScatterPlot = function(){
    this.dataset = [];   
};

ScatterPlot.prototype.renderFromResponse = function(opts) {
    var response = opts.response;
    var title = response.table.cols[0].label;
    var data = [];
    $.each(response.table.rows, function(){
        try {
            data.push([
                this.c[0].v, this.c[1].v]
            );
        }
        catch(e){
            //alert(JSON.stringify(this));
        }
    });
    
    $('#container').highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: title
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'X-Axis'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Y-Axis'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: '',
            color: 'rgba(223, 83, 83, .5)',
            data: data
        }]
    });

}
