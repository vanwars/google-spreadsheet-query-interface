var List = function(){ };

List.prototype.renderFromResponse = function(opts) {
    var response = opts.response;
    var title = response.table.cols[0].label;
    var data = [];
    $.each(response.table.rows, function(){
        data.push([
            this.c[0].v.toString(), this.c[1].v]
        );
    });
    
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
                .append($('<th></th>').html(title))
                .append($('<th>Count</th>'))
    );
    $.each(data, function(){
        $tr = $('<tr></tr>');
        $tr.append($('<td></td>').html(this[0]));  
        $tr.append($('<th></th>').html(this[1]));  
        $body.append($tr);  
    })

    $('#container').empty().append($table);
    
    
}

