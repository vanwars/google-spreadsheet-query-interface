var PieChart = function(){ };

PieChart.prototype.renderFromResponse = function(opts) {
    var response = opts.response;
    var title = response.table.cols[0].label;
    var data = [];
    $.each(response.table.rows, function(){
        data.push([
            this.c[0].v.toString(), this.c[1].v]
        );
    });
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'pie'
        },
        title: {
            text: title
        },
        credits: {
            enabled: false
        },
        series: [
            {
                data: data
            }
        ]
    
    });
}

