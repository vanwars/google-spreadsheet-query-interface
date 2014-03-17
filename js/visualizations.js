var VisualizationPage = function(){
    this.charts = {};
    this.barChart = new BarChart();  
    this.pieChart = new PieChart();  
    this.list = new List();    
    this.tagCloud = new TagCloud();  
    this.scatterPlot = new ScatterPlot();
    this.dataManager = new DataManager();
    this.makeLookup();
};

VisualizationPage.prototype.init = function() {
    //querySpreadsheet({}, 'visPage.renderMenu');
    this.dataManager.init();
};

VisualizationPage.prototype.makeLookup = function() {
    this.charts[this.barChart.type] = this.barChart;
    this.charts[this.pieChart.type] = this.pieChart;
    this.charts[this.list.type] = this.list;
    this.charts[this.tagCloud.type] = this.tagCloud;
    this.charts[this.scatterPlot.type] = this.scatterPlot;
};

VisualizationPage.prototype.getActiveChart = function(){
    return this.charts[$('#chartType').val()];
}

VisualizationPage.prototype.deprecated = function(){
    switch($('#chartType').val()){
        case 'barChart':
            //if more than one item is selected, then the chart type is additive
            var clear = $('#menu').find('a.active').size() == 1;
            this.barChart.renderFromResponse({
                response: response,
                clear: clear
            });
            break;
        case 'pieChart':
            this.pieChart.renderFromResponse({
                response: response
            })
            break;
        case 'list':
            this.list.renderFromResponse({
                response: response
            })
            break;
        case 'tagCloud':
            this.tagCloud.renderFromResponse({
                response: response
            })
            break;
        case 'scatter':
            this.scatterPlot.renderFromResponse({
                response: response
            })
            break;
    }
}





