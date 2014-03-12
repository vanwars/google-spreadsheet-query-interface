var spreadsheetKey = '0AmrOktWHu7PWdGJaMTN5QkF5UTJTZFExamVmWXVQM2c';

function querySpreadsheet(opts, callback) {
    //https://developers.google.com/chart/interactive/docs/dev/implementing_data_source?csw=1#requestformat
    var params = {
        key: spreadsheetKey,
        pub: 1,
        tqx: 'responseHandler:' + callback,
        tq: ''
    };
    $.extend(params, opts);
    $.ajax({
        url: "http://spreadsheets.google.com/tq",
        dataType: "jsonp",
        data: params
    });
}