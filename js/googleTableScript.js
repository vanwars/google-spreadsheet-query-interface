var colWidth = 150;
var spreadsheetKey = '0AmrOktWHu7PWdGJaMTN5QkF5UTJTZFExamVmWXVQM2c';

function init(){
    var me = this;
    
    $('#send').click(function(){
        me.querySpreadsheet({
            tq: $('#sql').val()   
        });   
    });
    
    $.extend($.tablesorter.themes.bootstrap, {
        sortNone   : 'fa fa-sort',
        sortAsc    : 'fa fa-sort-alpha-asc',     // includes classes for Bootstrap v2 & v3
        sortDesc   : 'fa fa-sort-alpha-desc', // includes classes for Bootstrap v2 & v3
    });
    
    querySpreadsheet({
        tq: $('#sql').val()   
    });
}

function querySpreadsheet(opts) {
    //https://developers.google.com/chart/interactive/docs/dev/implementing_data_source?csw=1#requestformat
    var params = {
        key: spreadsheetKey,
        pub: 1,
        tqx: 'responseHandler:renderTable',
        tq: ''
    };
    $.extend(params, opts);
    $.ajax({
        url: "http://spreadsheets.google.com/tq",
        dataType: "jsonp",
        data: params
    });
}

function renderTable(response) {
    if (response.status == 'error') {
        alert(response.errors[0].message + '\n' + response.errors[0].detailed_message);
        return;
    }
    //$('body').html(JSON.stringify(response.table));
    
    //build table from JSON response:
    $('#tableHolder').empty().append($('<table id="results" class="tablesorter-bootstrap"></table>'));
    $('#tableHolder').css({
        width: (response.table.cols.length*colWidth) + "px"    
    });
    var $head = $('<thead></thead>');
    var $tr1 = $('<tr></tr>');
    var $tr2 = $('<tr></tr>');
    $('#results').append($head.append($tr1).append($tr2));
    $.each(response.table.cols, function(){
        $tr1.append($('<th></th>').html(this.id));  
        $tr2.append($('<td class="sorter-false"></td>').html(this.label));  
    })

    //populate data values:
    $.each(response.table.rows, function(){
        $tr = $('<tr></tr>');
        $('#results').append($tr);
        $.each(this.c, function(){
            var val = this.f || this.v;
            if (val != null) { val = val.toString(); }
            else { val = '&nbsp;'; }
            $tr.append($('<td></td>').html(val));    
        });  
    });
    
    //make table sortable:
    $("table").tablesorter({
        theme : "bootstrap",
        headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!
        widgets : [ "uitheme", "filter"],
        widgetOptions : {
            filter_reset : ".reset"
        }
    }).bind('filterEnd', function() { displayRowLength(); });
    
    //make columns adjustable:
    $("#results").colResizable({ disable: true }); //a hack to run garbage collection for resizable table
    $("#results").colResizable({ disable: false });
    
    displayRowLength();
}

function displayRowLength(){
    //add row length message:
    $('#numRows').html('Displaying ' + ($('#results tr:visible').length-3) + ' Rows'); 
}