Chart = function(opts){
    this.dataManager = null;
    this.callback = null;
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
