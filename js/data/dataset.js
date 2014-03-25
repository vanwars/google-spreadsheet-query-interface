var DataManager = function(opts){
    this.spreadsheetKey;
    this.sheetID;
    this.columns = {};
    $.extend(this, opts);
};

DataManager.prototype.init = function(opts) {
    //populate columns:
    this.columns = {};
    this.querySpreadsheet({
        callback: 'visPage.dataManager.processResponse'   
    });
};

DataManager.prototype.querySpreadsheet = function(opts) {
    //https://developers.google.com/chart/interactive/docs/dev/implementing_data_source?csw=1#requestformat
    var sql = '' || opts.sql;
    var callback = opts.callback;
    var params = {
        key: this.spreadsheetKey,
        tqx: 'responseHandler:' + callback,
        tq: sql,
        gid: this.sheetID
    };
    $.ajax({
        url: "http://spreadsheets.google.com/tq",
        dataType: "jsonp",
        data: params
    });
};

DataManager.prototype.processResponse = function(response){
    var me = this;
    $.each(response.table.cols, function() {
        if (this.label) {
            me.columns[this.id] = new Column({
                id: this.id,
                type: this.type,
                name: this.label
            });
        }
    });
    this.renderMenu();
};

DataManager.prototype.renderMenu = function() {
    var me = this;
    $('#chartType').change(function(e){
        var activeColumns = me.getActiveColumns();
        if (activeColumns.length > 0)
            visPage.getActiveChart().renderVis(e, activeColumns[0]);
    });
    $('#menu').empty();
    $.each(this.columns, function(){
        $('#menu').append(this.renderEntry({
            callback: visPage.doQuery
        }));
    });
};


DataManager.prototype.getActiveColumns = function(response){
    var me = this;
    var activeColumns = [];
    $.each(this.columns, function() {
        if (this.isActive())
            activeColumns.push(this);
    });
    return activeColumns;
};


