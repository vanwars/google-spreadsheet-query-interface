var VisualizationPage = function(){
    this.dataManager = new DataManager({
        'spreadsheetKey': '0AmrOktWHu7PWdF9vVEtpMkdyWFg0ZHItYm9aZU4wSVE'    
    });
    var chartOpts = {
        dataManager: this.dataManager 
    };
    this.charts = {};
    this.barChart = new BarChart(chartOpts);  
    this.pieChart = new PieChart(chartOpts);  
    this.list = new List(chartOpts);    
    this.tagCloud = new TagCloud(chartOpts);  
    this.scatterPlot = new ScatterPlot(chartOpts);
    
    this.makeLookup();
};

VisualizationPage.prototype.init = function() {
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
