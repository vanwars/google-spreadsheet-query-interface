Chart = function(){
    this.spreadsheetKey = '0AmrOktWHu7PWdGJaMTN5QkF5UTJTZFExamVmWXVQM2c';
    this.callback = 'callback';
};

Chart.prototype.querySpreadsheet = function(sql) {
    //https://developers.google.com/chart/interactive/docs/dev/implementing_data_source?csw=1#requestformat
    var params = {
        key: this.spreadsheetKey,
        pub: 1,
        tqx: 'responseHandler:' + this.callback,
        tq: sql
    };
    $.ajax({
        url: "http://spreadsheets.google.com/tq",
        dataType: "jsonp",
        data: params
    });
};

Chart.prototype.renderVis = function(e, column){
    $('#menu a').removeClass("active");
        column.htmlEntry.addClass("active");
    
    this.querySpreadsheet(column.getSQL());
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
