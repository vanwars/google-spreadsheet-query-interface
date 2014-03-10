var colWidth = 150;
function init(){
    var me = this;
    drawVisualization({
        tq: $('#sql').val()   
    });
    $('#send').click(function(){
        me.drawVisualization({
            tq: $('#sql').val()   
        });   
    });
    
    
    $.extend($.tablesorter.themes.bootstrap, {
        // these classes are added to the table. To see other table classes available,
        // look here: http://twitter.github.com/bootstrap/base-css.html#tables
        table      : 'table table-bordered',
        caption    : 'caption',
        header     : 'bootstrap-header', // give the header a gradient background
        footerRow  : '',
        footerCells: '',
        icons      : '', // add "icon-white" to make them white; this icon class is added to the <i> in the header
        sortNone   : 'fa fa-sort',
        sortAsc    : 'fa fa-sort-alpha-asc',     // includes classes for Bootstrap v2 & v3
        sortDesc   : 'fa fa-sort-alpha-desc', // includes classes for Bootstrap v2 & v3
        active     : '', // applied when column is sorted
        hover      : '', // use custom css here - bootstrap class may not override it
        filterRow  : '', // filter row class
        even       : '', // odd row zebra striping
        odd        : ''  // even row zebra striping
    });
    
}

function drawVisualization(opts) {
    var params = {
        key: '0AmrOktWHu7PWdGJaMTN5QkF5UTJTZFExamVmWXVQM2c',
        pub: 1,
        tqx: 'responseHandler:renderTable'
    };
    $.extend(params, opts);
    //alert(JSON.stringify(params));
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
    
    $("table").tablesorter({
        theme : "bootstrap",

        //widthFixed: true,
    
        headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!
        widgets : [ "uitheme", "filter"],
        widgetOptions : {
            filter_reset : ".reset"
        }
    }).bind('filterEnd', function() {
        $('#numRows').html('Displaying ' + ($('#results tr:visible').length-3) + ' Rows');
    });;
    
    $("#results").colResizable({ disable: true }); //a hack to run garbage collection for resizable table
    $("#results").colResizable({ disable: false });
    $('#numRows').html('Displaying ' + ($('#results tr:visible').length-3) + ' Rows');
    
}