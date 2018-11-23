// https://www.dev2qa.com/node-js-read-write-file-examples/

var fs = require('fs');

function rand(min, max) {
    if (min === max) {
        return min;
    } else {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

// Read data from files
var Bar_Names3 = fs.readFileSync('./raw/Bar_Names3.txt'),
    Beer_Names = fs.readFileSync('./raw/Beer_Names.txt'),
    Bill_IDs = fs.readFileSync('./raw/Bill_IDs.txt'),
    City_Names_EXT = fs.readFileSync('./raw/City_Names_EXT.txt'),
    First_Names = fs.readFileSync('./raw/First_Names.txt'),
    Item_Names = fs.readFileSync('./raw/Item_Names.txt'),
    Last_Names = fs.readFileSync('./raw/Last_Names.txt'),
    Manf_Names = fs.readFileSync('./raw/Manf_Names.txt'),
    Operating_Hours = fs.readFileSync('./raw/Operating_Hours.txt'),
    Phone_Numbers_EXT = fs.readFileSync('./raw/Phone_Numbers_EXT.txt'),
    Street_Names = fs.readFileSync('./raw/Street_Names.txt');

var bar_names = Bar_Names3.toString().split('\r\n'),
    beer_names = Beer_Names.toString().split('\r\n'),
    bill_ids = Bill_IDs.toString().split('\r\n'),
    city_state_ext = City_Names_EXT.toString().split('\r\n'),
    first_names = First_Names.toString().split('\r\n'),
    item_names = Item_Names.toString().split('\r\n'),
    last_names = Last_Names.toString().split('\r\n'),
    manf_names = Manf_Names.toString().split('\r\n'),
    operating_hours = Operating_Hours.toString().split('\r\n')
    phone_numbers = Phone_Numbers_EXT.toString().split('\r\n'),
    street_names = Street_Names.toString().split('\r\n');
   
// Parse city info   
var cities = [];
for (var i = 0; i < city_state_ext.length; i++) {
    var info = city_state_ext[i].split(',');
    cities.push({ city: info[0], state: info[1], ext: info[2] });
}

// Parse shift info
var shifts = [];
for (var i = 0; i < operating_hours.left; i++) {
    shifts.push({ hours: operating_hours[i].split(',') });
}
    
/* Schema
 * Bars(BarName, License, State, City, Address, Phone, OpenTime, CloseTime)
 * Bartenders(EmployeeID, FirstName, LastName)
 * Beers(BeerName, Manf)
 * Bills(BillID, BarName, Date, Time, ItemName, Price, Quantity, TipTotal)
 * Dates(Day, Weekday)
 * Drinkers(FirstName, LastName, State, City, Phone, Address)
 * Frequents(FirstName, LastName, BarName)
 * Inventory(BarName, Beername, Amount)
 * Items(BarName, ItemName, Price)
 * Likes(FirstName, LastName, Beer)
 * Pays(BillID, FirstName, LastName, Total)
 * Schedules(BarName, EmployeeID)
 * Sells(BarName, BeerName, Price)
 * Shifts(EmployeeID, StartTime, EndTime, WeekDay)
 * Sold(EmployeeID, BillID)
 * Stores(BarName, ItemName, Quantity)
 */
 
// Initialize Data to contain database
var Data = {
    Bars: [],
    Bartenders: [],
    Beers: [],
    Bills: [],
    BillIDs: [],
    Dates: [],
    Drinkers: [],
    Frequents: [],
    Inventory: [],
    Items: [],
    Likes: [],
    Pays: [],
    Schedules: [],
    Sells: [],
    Shifts: [],
    Sold: [],
    Stores: []
};

/* Constraints
 * Bills cannot be issued when the given bar is closed
 * Drinkers cannot frequent bars in a different state from where they live
 * A beer that is less expensive than another beer should be less expensive than it in all bars
 * Bar cannot sell more beers than it has in its inventory
 * Bartenders cannot work more than one shift per day
 */
 
/* Unique
 * BarName
 * License
 * Address (Bar, Drinker)
 * Phone (Bar, Drinker)
 * EmployeeID
 * FirstName, LastName (Bartender, Drinker)
 * BillID
 */
 
// Keep track of already used items here so there are no duplicates
var licenses = {},
    addresses = {},
    phoneNumbers = {},
    employeeIDs = {},
    names = {},
    billIDs = {};

var Cities = {};
 
var Bars = {}, Bartenders = {}, Beers = {}, Drinkers = {}, BillIDs = {}; // entities
var Items = {}, Frequents = {}, Likes = {}, Sells = {}, Inventory = {}, Shifts = {}, Schedules = {}, Stores = {}, Bills = {}, Pays = {}, Sold = {}; // relations

// Dates(Date, Weekday)
var Dates = {
    '11/1': {
        Date: '11/1',
        Weekday: 'Sunday'
    },
    '11/2': {
        Date: '11/2',
        Weekday: 'Monday'
    },
    '11/3': {
        Date: '11/3',
        Weekday: 'Tuesday'
    },
    '11/4': {
        Date: '11/4',
        Weekday: 'Wednesday'
    },
    '11/5': {
        Date: '11/5',
        Weekday: 'Thursday'
    },
    '11/6': {
        Date: '11/6',
        Weekday: 'Friday'
    },
    '11/7': {
        Date: '11/7',
        Weekday: 'Saturday'
    }
};

// Bars(BarName, License, State, City, Address, Phone, OpenTime, CloseTime)
for (var i = 0; i < bar_names.length; i++) {
    var bar_name = bar_names[i];
    var location = cities[rand(0, cities.length)];
    var license = location.state + rand(10000, 100000);
    while (licenses.hasOwnProperty(license)) {
        license = location.state + rand(10000, 100000);
    }
    licenses[license] = true;
    var street = street_names[rand(0, street_names.length)];
    var address = rand(1, 1000) + ' ' + street;
    while (addresses.hasOwnProperty(address)) {
        street = street_names[rand(0, street_names.length)];
        address = rand(1, 1000) + ' ' + street;
    }
    addresses[address] = true;
    var phoneNumber = location.ext + phone_numbers[rand(0, phone_numbers.length)];
    while (phoneNumbers.hasOwnProperty(phoneNumber)) {
        phoneNumber = location.ext + phone_numbers[rand(0, phone_numbers.length)];
    }
    phoneNumbers[phoneNumber] = true;
    var hours = operating_hours[rand(0, operating_hours.length)].split(',');
    var close = hours[hours.length - 1];
    if (close == '00:00') {
        close = '23:59';
    }
    Bars[bar_name] = {
        BarName: bar_name,
        License: license,
        State: location.state,
        City: location.city,
        Address: address,
        Phone: phoneNumber,
        OpenTime: hours[0],
        CloseTime: close,
        _SHIFTS: hours,
        _EMPLOYEES: [],
        _BEERS: [],
        _ITEMS: []
    };
    if (!Cities.hasOwnProperty(location.city)) {
        Cities[location.city] = {
            bars: [bar_name],
            drinkers: []
        } 
    } else {
        Cities[location.city].bars.push(bar_name);
    }
}

// Bartenders(EmployeeID, FirstName, LastName)
for (var n = 0; n < 5000; n++) {
    var f_name = first_names[rand(0, first_names.length)];
    var l_name = last_names[rand(0, last_names.length)];
    var name = f_name + ' ' + l_name;
    while (names.hasOwnProperty(name)) {
        f_name = first_names[rand(0, first_names.length)];
        l_name = last_names[rand(0, last_names.length)];
        name = f_name + ' ' + l_name;
    }
    names[name] = true;
    var id = f_name.charAt(0).toLowerCase() + l_name.charAt(0).toLowerCase() + rand(1, 100);
    while (employeeIDs.hasOwnProperty(id)) {
        id = f_name.charAt(0).toLowerCase() + l_name.charAt(0).toLowerCase() + rand(1, 1000);
    }
    employeeIDs[id] = true;
    Bartenders[name] = {
        EmployeeID: id,
        FirstName: f_name,
        LastName: l_name
    };
}

// Beers(BeerName, Manf)
for (var i = 0; i < beer_names.length; i++) {
    var beer_name = beer_names[i];
    var manf = manf_names[rand(0, manf_names.length)];
    var price = (10 * rand(30, 2000)) / 100;
    Beers[beer_name] = {
        BeerName: beer_name,
        Manf: manf,
        _PRICE: price
    };
}

// Drinkers(FirstName, LastName, State, City, Phone, Address)
for (var i = 0; i < 1010; i++) {
    var f_name = first_names[rand(0, first_names.length)];
    var l_name = last_names[rand(0, last_names.length)];
    var name = f_name + ' ' + l_name;
    while (names.hasOwnProperty(name)) {
        f_name = first_names[rand(0, first_names.length)];
        l_name = last_names[rand(0, last_names.length)];
        name = f_name + ' ' + l_name;
    }
    names[name] = true;
    var location = cities[rand(0, cities.length)];
    var street = street_names[rand(0, street_names.length)];
    var address = rand(1, 1000) + ' ' + street;
    while (addresses.hasOwnProperty(address)) {
        street = street_names[rand(0, street_names.length)];
        address = rand(1, 1000) + ' ' + street;
    }
    addresses[address] = true;
    var phoneNumber = location.ext + phone_numbers[rand(0, phone_numbers.length)];
    while (phoneNumbers.hasOwnProperty(phoneNumber)) {
        phoneNumber = location.ext + phone_numbers[rand(0, phone_numbers.length)];
    }
    phoneNumbers[phoneNumber] = true;
    Drinkers[name] = {
        FirstName: f_name,
        LastName: l_name,
        State: location.state,
        City: location.city,
        Phone: phoneNumber,
        Address: address
    };
    if (!Cities.hasOwnProperty(location.city)) {
        Cities[location.city] = {
            bars: [],
            drinkers: [name]
        } 
    } else {
        Cities[location.city].drinkers.push(name);
    }
}

// Items(BarName, ItemName, Price)
// Stores(BarName, ItemName, Quantity)
var barKeys = Object.keys(Bars);
for (var i = 0; i < barKeys.length; i++) {
    var bar_name = barKeys[i];
    var items = [];
    for (var j = 0; j < 20; j++) {
        var item = item_names[rand(0, item_names.length)];
        while (items.indexOf(item) !== -1) {
            item = item_names[rand(0, item_names.length)];
        }
        items.push(item);
        var price = rand(100, 1000) / 100;
        Items[bar_name + '_' + item] = {
            BarName: bar_name,
            ItemName: item,
            Price: price
        };
        Bars[bar_name]._ITEMS.push(item);
        var quantity = 10000 + rand(1, 10000);
        Stores[bar_name + '_' + item] = {
            BarName: bar_name,
            ItemName: item,
            Quantity: quantity
        };
    }
}

// Frequents(FirstName, LastName, BarName)
// Drinkers cannot frequent bars in a different state from where they live
var cityKeys = Object.keys(Cities);
for (var i = 0; i < cityKeys.length; i++) {
    var city = Cities[cityKeys[i]];
    var drinkers = city.drinkers;
    var bars = city.bars;
    if (bars.length > 0) {
        for (var j = 0; j < drinkers.length; j++) {
            var drinker = Drinkers[drinkers[j]];
            var temp = [];
            for (var k = 0; k < bars.length; k++) {
                temp.push(bars[k]);
            }
            while (temp.length > 0 && Math.random() < 0.7) {
                var r = rand(0, temp.length);
                var bar = temp.splice(r, 1)[0];
                Frequents[drinkers[j] + '_' + bar] = {
                    FirstName: drinker.FirstName,
                    LastName: drinker.LastName,
                    BarName: bar
                }
            }
        }
    }
}

// Likes(FirstName, LastName, Beer)
var drinkerKeys = Object.keys(Drinkers);
for (var i = 0; i < drinkerKeys.length; i++) {
    var drinker = Drinkers[drinkerKeys[i]];
    var temp = [];
    for (var j = 0; j < beer_names.length; j++) {
        temp.push(beer_names[j]);
    }
    while (temp.length > 0 && Math.random() < 0.5) {
        var r = rand(0, temp.length);
        var beer = temp.splice(r, 1)[0];
        Likes[drinkerKeys[i] + '_' + beer] = {
            FirstName: drinker.FirstName,
            LastName: drinker.LastName,
            Beer: beer
        }
    }
}

// Sells(BarName, BeerName, Price)
// Inventory(BarName, Beername, Amount)
// A beer that is less expensive than another beer should be less expensive than it in all bars
var offset = [-0.03, -0.02, -0.01, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.01, 0.02, 0.03];
for (var i = 0; i < bar_names.length; i++) {
    var bar_name = bar_names[i];
    var temp = [];
    for (var j = 0; j < beer_names.length; j++) {
        temp.push(beer_names[j]);
    }
    do {
        var r = rand(0, temp.length);
        var beer = temp.splice(r, 1)[0];
        var price = Math.round(100 * (Beers[beer]._PRICE + offset[rand(0, offset.length)])) / 100;
        Sells[bar_name + '_' + beer] = {
            BarName: bar_name,
            BeerName: beer,
            Price: price
        }
        Bars[bar_name]._BEERS.push(beer);
        var amount = 5000 + rand(1, 1000);
        Inventory[bar_name + '_' + beer] = {
            BarName: bar_name,
            Beername: beer,
            Amount: amount
        }   
    } while (temp.length > 0 && Math.random() < 0.8);
}

// Schedules(BarName, EmployeeID)
// Shifts(EmployeeID, StartTime, EndTime, WeekDay)
// Bartenders cannot work more than one shift per day
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var bartenderKeys = Object.keys(Bartenders);
var b = 0;
for (var i = 0; i < barKeys.length; i++) {
    var bar = Bars[barKeys[i]];
    var hours = bar._SHIFTS;
    for (var k = 0; k < hours.length - 1; k++) {
        var start = hours[k];
        var end = hours[k + 1];
        if (end == '00:00') {
            end = '23:59';
        }
        var id;
        var count = 0;
        while ((count < 3 || Math.random() < 0.5) && count < 5) {
            id = Bartenders[bartenderKeys[b++]].EmployeeID;
            Schedules[bar + '_' + id] = {
                BarName: bar.BarName,
                EmployeeID: id
            };
            bar._EMPLOYEES.push(id);
            for (var j = 0; j < days.length; j++) {
                var day = days[j];
                Shifts[id + '_' + start + '_' + end + '_' + day] = {
                    EmployeeID: id,
                    StartTime: start,
                    EndTime: end,
                    WeekDay: day
                };
            }
            count++;
        }
    }
}

// Bills(BillID, BarName, Date, Time, ItemName, Price, Quantity, TipTotal)
// 7% tax + tip
// Pays(BillID, FirstName, LastName, Total)
// Sold(EmployeeID, BillID)
// Bills cannot be issued when the given bar is closed
// Bar cannot sell more beers than it has in its inventory
var dates = ['11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7'];
for (var i = 0; i < 25000; i++) {
    var city = Cities[cityKeys[rand(0, cityKeys.length)]];
    if (city.bars.length > 0 && city.drinkers.length > 0) {
        var bar = Bars[city.bars[rand(0, city.bars.length)]];
        var barID = bar.BarName.split(' ').map(a => a.charAt(0)).join('');
        var billID = barID + '-' + bill_ids[rand(0, bill_ids.length)];
        while (billIDs.hasOwnProperty(billID)) {
            billID = barID + '-' + bill_ids[rand(0, bill_ids.length)];
        }
        billIDs[billID] = true;
        BillIDs[billID] = {
          BillID: billID  
        };
        var r = rand(0, dates.length);
        var date = dates[r];
        var day = days[r];
        var hours = bar._SHIFTS;
        var s = rand(0, hours.length - 1);
        var start = hours[s];
        var end = hours[s + 1];
        if (end == '00:00') {
            end = '23:59';
        }
        var employees = bar._EMPLOYEES.filter(bt => Shifts.hasOwnProperty(bt + '_' + start + '_' + end + '_' + day));
        var bartender = employees[rand(0, employees.length)];
        Sold[bartender + '_' + billID] = {
            EmployeeID: bartender,
            BillID: billID
        }
        var min = parseInt(start.split(':')[0], 10);
        var max = parseInt(end.split(':')[0], 10);
        var h = rand(min, max);
        var m = rand(00, 60);
        var time = '' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
        var total = 0;
        var temp = [];
        for (var x = 0; x < bar._BEERS.length; x++) {
            temp.push(bar._BEERS[x]);
        }
        do {
            var beer = temp.splice(rand(0, temp.length), 1)[0];
            var quantity = rand(1, 10);
            var price = Sells[bar.BarName + '_' + beer].Price;
            var tip = rand(115, 130) / 100;
            var subtotal = Math.ceil(100 * quantity * price * 1.07 * tip) / 100;
            Bills[billID + '_' + beer] = {
                BillID: billID,
                BarName: bar.BarName,
                Date: date,
                Time: time,
                ItemName: beer,
                Price: price,
                Quantity: quantity,
                TipTotal: subtotal
            }
            total += subtotal;
        } while (temp.length > 0 && Math.random() < 0.4);
        var temp2 = [];
        for (var y = 0; y < bar._ITEMS.length; y++) {
            temp2.push(bar._ITEMS[y]);
        }
        while (temp2.length > 0 && Math.random() < 0.6) {
            var item = temp2.splice(rand(0, temp2.length), 1)[0];
            var quantity = rand(1, 30);
            var price = Items[bar.BarName + '_' + item].Price;
            var tip = rand(115, 130) / 100;
            var subtotal = Math.ceil(100 * quantity * price * 1.07 * tip) / 100;
            Bills[billID + '_' + item] = {
                BillID: billID,
                BarName: bar.BarName,
                Date: date,
                Time: time,
                ItemName: item,
                Price: price,
                Quantity: quantity,
                TipTotal: subtotal
            }
            total += subtotal;
        }
        var drinker = Drinkers[city.drinkers[rand(0, city.drinkers.length)]];
        total = Math.round(100 * total) / 100
        Pays[billID] = {
            BillID: billID,
            FirstName: drinker.FirstName,
            LastName: drinker.LastName,
            Total: total
        }
    }
}

var keys = Object.keys(Dates);
for (var i = 0; i < keys.length; i++) {
    Data.Dates.push(Dates[keys[i]]);
}

keys = Object.keys(Bars);
for (var i = 0; i < keys.length; i++) {
    Data.Bars.push(Bars[keys[i]]);
}

keys = Object.keys(Bartenders);
for (var i = 0; i < keys.length; i++) {
    Data.Bartenders.push(Bartenders[keys[i]]);
}

keys = Object.keys(Beers);
for (var i = 0; i < keys.length; i++) {
    Data.Beers.push(Beers[keys[i]]);
}

keys = Object.keys(Bills);
for (var i = 0; i < keys.length; i++) {
    Data.Bills.push(Bills[keys[i]]);
}

keys = Object.keys(BillIDs);
for (var i = 0; i < keys.length; i++) {
    Data.BillIDs.push(BillIDs[keys[i]]);
}

keys = Object.keys(Drinkers);
for (var i = 0; i < keys.length; i++) {
    Data.Drinkers.push(Drinkers[keys[i]]);
}

keys = Object.keys(Frequents);
for (var i = 0; i < keys.length; i++) {
    Data.Frequents.push(Frequents[keys[i]]);
}

keys = Object.keys(Inventory);
for (var i = 0; i < keys.length; i++) {
    Data.Inventory.push(Inventory[keys[i]]);
}

keys = Object.keys(Items);
for (var i = 0; i < keys.length; i++) {
    Data.Items.push(Items[keys[i]]);
}

keys = Object.keys(Likes);
for (var i = 0; i < keys.length; i++) {
    Data.Likes.push(Likes[keys[i]]);
}

keys = Object.keys(Pays);
for (var i = 0; i < keys.length; i++) {
    Data.Pays.push(Pays[keys[i]]);
}

keys = Object.keys(Schedules);
for (var i = 0; i < keys.length; i++) {
    Data.Schedules.push(Schedules[keys[i]]);
}

keys = Object.keys(Sells);
for (var i = 0; i < keys.length; i++) {
    Data.Sells.push(Sells[keys[i]]);
}

keys = Object.keys(Shifts);
for (var i = 0; i < keys.length; i++) {
    Data.Shifts.push(Shifts[keys[i]]);
}

keys = Object.keys(Sold);
for (var i = 0; i < keys.length; i++) {
    Data.Sold.push(Sold[keys[i]]);
}

keys = Object.keys(Stores);
for (var i = 0; i < keys.length; i++) {
    Data.Stores.push(Stores[keys[i]]);
}

var database = JSON.stringify(Data, null, 4);
fs.writeFile('data.json', database, function(err, data){
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});