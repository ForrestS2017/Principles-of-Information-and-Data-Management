var db = require('mysql-promise')();
var fs = require('fs');

var login_info = fs.readFileSync('./login.txt').toString().split('\r\n');

db.configure({
	'host': 'barbeerdrinkerpro.cs3xnb1rcf0o.us-east-2.rds.amazonaws.com',
	'user': login_info[0],
	'password': login_info[1],
	'database': 'BarBeerDrinkerPro'
});

var data = fs.readFileSync('./data.json').toString();
var Database = JSON.parse(data);

var databaseKeys = ['Bars', 'Bartenders', 'Beers', 'BillIDs', 'Drinkers', 'Dates', 'Bills', 'Frequents', 'Inventory', 'Items', 'Likes', 'Schedules', 'Sells', 'Shifts', 'Stores', 'Pays', 'Sold']; // must follow this order to avoid violating foreign key constraints

var i = 0; // Manually increment because otherwise the program runs out of memory...
//for (var i = 0; i < databaseKeys.length; i++) {
    var table = databaseKeys[i];
    var rows = Database[databaseKeys[i]];
    var q = ['INSERT INTO ' + table + ' VALUES '];
    for (j = 0; j < rows.length; j++) {
    //for (var j = 40001; j < rows.length; j++) { // for adding Bills
        var row = rows[j];
        var keys = Object.keys(row);
        var values = [];
        for (var k = 0; k < keys.length; k++) {
            var key = keys[k];
            if (key.charAt(0) != '_') {
                if (typeof row[key] === 'string') {
                    values.push('\'' + row[key].replace(/'/g, '\\\'') + '\'');
                } else {
                    values.push('\'' + row[key] + '\'');
                }
            }
        }
        var value = '(' + values.join(',') + ')';
        q.push(value);
        q.push(', ');
        if (j !== 0 && j % 40000 === 0) { // can't insert too many at once
            break;
        }
    }
    q.splice(q.length - 1, 1, ';');
    var query = q.join('');
    db.query(query)
        .spread(row => {
            console.log(row);
        }).finally(function () {
             console.log('Finished ' + table);
             closeDB();
        }).catch(err =>  console.error('An error occurred!', err));

//}

function closeDB() {
    if (db) {
        db.end();
    }
}

