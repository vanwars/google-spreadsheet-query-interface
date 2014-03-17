var Column = function(opts){
    this.id = null;
    this.name = null;
    this.type = null;
    this.htmlEntry = null
    $.extend(this, opts);
};

Column.prototype.isActive = function(){
    return this.htmlEntry.hasClass("active"); 
};

Column.prototype.renderEntry = function(opts){
    var me = this;
    this.htmlEntry = $('<a href="#" class="list-group-item"></a>');
    this.htmlEntry.append (
            $('<h4 class="list-group-item-heading"></h4>')
                .html(this.id)
        ).append(
            $('<span class="badge"></span>').html(this.type)
        ).append(
            $('<p class="list-group-item-text"></p>').html(this.name)
        ).append(
            $('<input type="hidden" />').val(this.type)
        ).click(function(e){
            visPage.getActiveChart().renderVis(e, me);
            return false;
        });
    return this.htmlEntry;
};


Column.prototype.getSQL = function(){
    var dummyCol = (this.id == 'A') ? 'B' : 'A';
    sql = "SELECT " + this.id + ", count(" + dummyCol + ") ";
    if (this.type == 'string')
        sql += " WHERE " + this.id + " <> ''";
    else
        sql += " WHERE " + this.id + " is not null";  
    sql += " GROUP BY " + this.id;
    if (this.type == 'date') {
        sql += " ORDER BY " + this.id;
    }
    return sql;
}

