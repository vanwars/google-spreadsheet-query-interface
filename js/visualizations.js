var VisualizationPage = function(){
    var me = this;
    
    this.restoreCookies();
    this.init();
    $('#reload').click(function(){
        me.init();
        return false;
    });
};

VisualizationPage.prototype.init = function(){
    var me = this;
    this.dataManager = new DataManager({
        'spreadsheetKey': $('#spreadsheetKey').val(),
        'sheetID': ($('#sheetID').val().length > 0) ? $('#sheetID').val() : 1
    });
    
    this.setCookies();
    
    var chartOpts = {
        dataManager: this.dataManager 
    };
    this.charts = {
        histogram: new Histogram(chartOpts),
        pieChart: new PieChart(chartOpts),
        list: new List(chartOpts),
        tagCloud: new TagCloud(chartOpts),
        scatterPlot: new ScatterPlot(chartOpts),
        barChart: new BarChart(chartOpts)
    };
    this.dataManager.init();
    $('#get-code').click(function(){
        me.getActiveChart().showSourceCode();   
    });
};

VisualizationPage.prototype.restoreCookies = function(){
    //restore cookies:
    if ($.cookie("spreadsheetKey")) {
        $('#spreadsheetKey').val($.cookie("spreadsheetKey"));
    }
    if ($.cookie("spreadsheetKey")) {
        $('#sheetID').val($.cookie("sheetID"));
    }
};

VisualizationPage.prototype.setCookies = function(){
    //remember values for next time:
    $.cookie("spreadsheetKey", $('#spreadsheetKey').val());
    $.cookie("sheetID", $('#sheetID').val());
};

VisualizationPage.prototype.getActiveChart = function(){
    return this.charts[$('#chartType').val()];
}