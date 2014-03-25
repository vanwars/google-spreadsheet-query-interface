var List = function(opts){
    this.type = 'list';
    this.title = null;
    this.data = [];
    this.callback = 'visPage.list.processResponse';
    $.extend(this, opts);
};

List.prototype = new Chart();


List.prototype.renderChart = function(opts) {
    var $table = $('<table></table>')
                    .addClass("table table-striped table-bordered")
                    .css({
                        'margin-top': '20px'    
                    });
    var $head = $('<thead></thead>');
    var $body = $('<tbody></tbody>');
    $table.append($head).append($body);
    $head.append(
            $('<tr></tr>')
                .append($('<th></th>').html(this.title))
                .append($('<th>Count</th>'))
    );
    $.each(this.data, function(){
        $tr = $('<tr></tr>');
        $tr.append($('<td></td>').html(this[0]));  
        $tr.append($('<th></th>').html(this[1]));  
        $body.append($tr);  
    })

    $('#container').empty().append($table);

}

