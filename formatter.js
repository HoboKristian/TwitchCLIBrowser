var punycode = require("punycode");
var colors  = require("colors");
var util    = require("util");

function pad(len) {
    var s = "";
    for (var i = 0; i < len; i++) {
        s += " ";
    }
    return s;
}

function addColorToString(color, string) {
    if (color !== undefined)
        return color(string);
    else
        return string;
}

function table(information, options={}) {
    var default_options = {
        padding: 2,
        delimeter: "#",
        colors: []
    };
    var default_keys = Object.keys(default_options);
    for (var index = 0; index < default_keys.length; index++) {
        var key = default_keys[index];
        if (options[key] === undefined) {
            options[key] = default_options[key];
        }
    }

    var rows = information;
    var column_count = rows[0].length;
    var column_widths = [column_count];

    var row, i, y;

    for (i = 0; i < rows.length; i++) {
        row = rows[i];

        for (y = 0; y < column_count; y++) {
            var column_width = punycode.ucs2.decode(String(row[y])).length;
            //var column_width = Array.from(String(row[y])).length;
            var curr_max = column_widths[y];
            if (column_width > curr_max || curr_max === undefined)
                column_widths[y] = column_width;
        }
    }

    // Clear console
    process.stdout.write("\u001b[2J\u001b[0;0H");
    for (i = 0; i < rows.length; i++) {
        row = rows[i];
        var index_width = String(rows.length - 1).length;
        var curr_index_width = String(i).length;
        var index_padding = index_width - curr_index_width;

        var index_string = util.format("[%d]%s", i, pad(options.padding + index_padding));
        var output = addColorToString(options.colors[0], index_string);
        for (y = 0; y < row.length; y++) {
            var column = row[y];
            var column_len = punycode.ucs2.decode(String(column)).length;
            var padding_width = column_widths[y] - column_len + options.padding;

            var column_string = addColorToString(options.colors[y + 1],
                                                 column + pad(padding_width));
            if (y + 1 != row.length) {
                column_string += addColorToString(options.delimeter_color,
                                                  options.delimeter + pad(options.padding));
            }

            output += column_string;
        }
        console.log(output);
    }
}

module.exports = {
    table: table
};
