var VisualizationPage = function(){
    this.barChart = new BarChart();  
    this.pieChart = new PieChart();    
};

VisualizationPage.prototype.init = function() {
    querySpreadsheet({}, 'visPage.renderMenu');
};

VisualizationPage.prototype.doQuery = function(val, dataType) {
    var dummyCol = (val == 'A') ? 'B' : 'A';
    var sql = "SELECT " + val + ", count(" + dummyCol + ") ";
    if (dataType == 'string')
        sql += " WHERE " + val + " <> ''";
    else
        sql += " WHERE " + val + " is not null";  
    sql += " GROUP BY " + val;
    if (dataType == 'date') {
        sql += " ORDER BY " + val;
    }
    //alert(sql);
    querySpreadsheet({
        tq: sql,   
    }, 'visPage.renderVis');
};

VisualizationPage.prototype.renderMenu = function(response) {
    var me = this;
    $('#chartType').change(function(){
        var $elem = $('#menu').find('a.active');
        if($elem.get(0) != null)
            me.doQuery($elem.find('h4').html(), $elem.find('input').val().toLowerCase());   
    });
    
    $.each(response.table.cols, function(){
        if (this.label) {
            var $a = $('<a href="#" class="list-group-item"></a>');
            $a.append (
                $('<h4 class="list-group-item-heading"></h4>')
                    .html(this.id)
            ).append(
                $('<span class="badge"></span>').html(this.type)
            ).append(
                $('<p class="list-group-item-text"></p>').html(this.label)
            ).append(
                $('<input type="hidden" />').val(this.type)
            ).click(function(e){
                if ((e.ctrlKey || e.metaKey) && $('#chartType').val() == 'barChart') {
                    //do nothing
                }
                else {
                    $('#menu').find('a').removeClass("active");
                }
                $(this).addClass("active");
                me.doQuery($(this).find('h4').html(), $(this).find('input').val().toLowerCase());
                return false;
            });
        
            $('#menu').append($a);
        }
    });
};

VisualizationPage.prototype.renderVis = function(response) {
    switch($('#chartType').val()){
        case 'barChart':
            //if more than one item is selected, then the chart type is additive
            var clear = $('#menu').find('a.active').size() == 1;
            this.barChart.renderFromResponse({
                response: response,
                clear: clear
            });
            break;
        case 'pie':
            this.pieChart.renderFromResponse({
                response: response
            })
            break;
    }
};
