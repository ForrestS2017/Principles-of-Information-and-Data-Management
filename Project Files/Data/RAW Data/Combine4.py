import csv
import random
import os

bars, abbrv, beers, ids, cities, codes, areas, fnames, lnames, manfs, phones, streets, hours, items = [], [], [], [], [], [], [], [], [], [], [], [], [], []
weekdays = ['Mon-Fri', 'Sat-Sun']
with open('Bar_Names3.csv', 'r') as f:
    reader = csv.reader(f)
    bars = list(reader)
    bars = [x[0] for x in bars]
    abbrv = [(''.join(e[0] for e in x.split())).upper() for x in bars]

    #for item in abbrv:
    #print(item)

with open('Beer_Names.csv', 'r') as f:
    reader = csv.reader(f)
    beers = list(reader)
    beers = [x[0] for x in beers]

    # for item in beers:
    #     print(item)

with open('Bill_IDs.csv', 'r') as f:
    reader = csv.reader(f)
    ids = list(reader)
    ids = [x[0] for x in ids]

    # for item in ids:
    #     print(item)

with open('City_Names_EXT.csv', 'r') as f:
    reader = csv.reader(f)
    cities = list(reader)
    codes = [x[1] for x in cities]
    areas = [x[2] for x in cities]
    cities = [x[0] for x in cities]

    # for i in range(len(cities)):
    #     print(cities[i],codes[i])

with open('First_Names.csv', 'r') as f:
    reader = csv.reader(f)
    fnames = list(reader)
    fnames = [x[0] for x in fnames]

    # for item in fnames:
    #     print(item)

with open('Last_Names.csv', 'r') as f:
    reader = csv.reader(f)
    lnames = list(reader)
    lnames = [x[0] for x in lnames]

    # for item in lnames:
    #     print(item)

with open('Manf_Names.csv', 'r') as f:
    reader = csv.reader(f)
    manfs = list(reader)
    manfs = [x[0] for x in manfs]

    # for item in manfs:
    #     print(item)

with open('Phone_Numbers_EXT.csv', 'r') as f:
    reader = csv.reader(f)
    phones = list(reader)
    phones = [x[0] for x in phones]

    # for item in phones:
    #     print(item)

with open('Street_Names.csv', 'r') as f:
    reader = csv.reader(f)
    streets = list(reader)
    streets = [x[0] for x in streets]

    # for item in streets:
    #     print(item)

with open('Operating_Hours.csv', 'r') as f:
    reader = csv.reader(f)
    hours = list(reader)
    #hours = [x[0] for x in hours]

    # for item in hours:
    # print(item)

with open('Item_Names.csv', 'r') as f:
    reader = csv.reader(f)
    items = list(reader)
    items = [x[0] for x in items]

    # for item in items:
    #     print(item)

"""""""""""

TABLE CREATION

"""""""""""


"""

>BEERS

"""

Beers = []

for beer in beers:
    m = random.randint(0, len(manfs)-1)
    price = float(random.randint(0, 29)) + float(random.choice([0.0,.25,.50,.75,.99]))
    Beers.append([beer, manfs[m], price])
    # WILL REMOVE PRICE LATER

#print(*Beers, sep='\n')

"""

>BARS

"""

Bars = []
# Including temp "o" integer to pick the shifts for later
for bar in bars:
    c = random.randint(0, len(cities) - 1)
    p = random.randint(0, len(phones) - 1)
    s = random.randint(0, len(streets) - 1)
    o = random.randint(0, len(hours) - 1)
    code = codes[c] + str(random.randint(10000,99999))
    #print(codes[c],' | ', code)
    operation = hours[o]
    opentime = int(operation[0])
    closetime = int(operation[-1]) + 4
    Bars.append([bar, code, codes[c], cities[c], str(random.randint(1, 1000)) + " " + streets[s], areas[c]+phones[p], opentime, closetime, operation])
    phones.pop(p)

#print(*Bars, sep='\n')

"""

>DRINKERS

"""

Drinkers = []
Drinkers.append(["Forrest", "Smith", "CA", "San Diego", "858-613-7961", "110 Grantham Drive"])
Drinkers.append(["Rahul", "Boppana", "CA", "San Diego", "858-357-6966", "16 Dina Lane"])
Drinkers.append(["Justin", "Chan", "CA", "San Diego", "858-248-2777", "16 Warriors Way"])
Drinkers.append(["Daniel", "Adelman", "CA", "San Diego", "858-318-8763", "3 Corwen Ct"])
Drinkers.append(["Albert", "Kraus", "CA", "San Diego", "858-425-6943", "5 Domino Road"])
Drinkers.append(["David", "Tian", "CA", "San Diego", "858-251-5755", "15 Easton Ave"])

tempcities = cities.copy()

for i in range(1000):
    first = random.choice(fnames)
    last = random.choice(lnames)
    dups = [person for person in Drinkers if person[0] == first]
    for person in dups:
        if person[1] == last:
            continue
    # ifelse to make sure there is at least one Drinker in each city
    if tempcities:
        c = 0
    else:
        c = random.randint(0, len(cities) - 1)
    p = random.randint(0, len(phones) - 1)
    street = random.choice(streets)
    if tempcities:
        Drinkers.append([first, last, codes[c], tempcities[c], areas[c] + phones[p], str(random.randint(1, 1000)) + " " + street])
        tempcities.pop(0)
    else:
        Drinkers.append([first, last, codes[c], cities[c], areas[c] + phones[p], str(random.randint(1, 1000)) + " " + street])
    phones.pop(p)


#print(*Drinkers, sep='\n')

"""

>LIKES

"""

Likes = []

for i in range(1250):
    drinker = random.choice(Drinkers)
    beer = random.choice(beers)
    Likes.append([drinker[0], drinker[1], beer])

#print(*Likes, sep='\n')

"""

>FREQUENTS

"""

Frequents = []

for i in range(1200):
    d = random.randint(0, len(Drinkers) - 1)
    ploc = Drinkers[d][3]
    bar = Bars[random.randint(0,len(Bars)-1)]
    # Ensure the drinker frequents a bar in their city
    while ploc != bar[3]:
        if ploc not in [item[2] for item in Bars]:
            d = random.randint(0, len(Drinkers) - 1)
            ploc = Drinkers[d][3]
        else:
            bar = Bars[random.randint(0,len(Bars)-1)]

    Frequents.append([Drinkers[d][0], Drinkers[d][1], bar[0]])

#print(*Frequents, sep='\n')

"""

>SELLS

"""

Sells = []
firstbars = Bars.copy()

for bar in Bars:
    beers = Beers.copy()
    for i in range(random.randint(7,15)):
        drink = beers.pop(random.randint(0, len(beers)-1))
        Sells.append([bar[0],drink[0],drink[2]])

#print(*Sells, sep='\n')

"""

>SHIFTS
>SCHEDULES
>BARTENDERS

"""


Shifts = []
Schedules = []

Bartenders = []
#WorksAt = []

scheduled = []
for i in range(len(Bars)):
    bar = Bars[i]
    shifthours = ((bar[-1]).copy())[:-1]
    bartenders = []
    schedule = []
    for day in weekdays:
        for shift in shifthours:
            # Get a person, say they're scheduled and add as bartender
            for person in Drinkers:
                if person[3] == bar[3] and person not in scheduled:
                    empid = abbrv[i] + '-' + ids.pop(random.randint(0,len(ids)-1))
                    bartender = [empid, person[0], person[1]]
                    if bartender not in Bartenders:
                        Bartenders.append(bartender)
                    scheduled.append(person)
                    break
            shiftend = int(shift) + 4
            if shiftend == 24: shiftend = 0
            killshift = [empid,(str(shift).zfill(2) + ":00"),(str(shiftend).zfill(2) + ":00"), day]
            Shifts.append(killshift)
    schedule.append(bar[0])
    schedule.append(empid)
    Schedules.append(schedule)

    #print(*bartenders, sep='\n')

#print(*WorksAt, sep='\n')
#print(*Shifts, sep='\n')
#print(*Bartenders, sep='\n')


"""

>ITEMS
>STORES

"""

items = list(set(items))
#print(*items, sep='\n')

PItems = []
for item in items:
    PItems.append([item,float(random.randint(2, 29)) + float(random.choice([0.0,.25,.50,.75,.99]))])


Stores = []
Items = []

for bar in Bars:
    tempitems = [x[:] for x in PItems]
    #print(*tempitems, sep='\n')
    for i in range(0,random.randint(5,50)):
        if not tempitems: break
        item = tempitems.pop(random.randint(0,len(tempitems)-1))
        quantity = random.randint(50,200)
        Items.append([bar[0],item[0],item[1]])
        Stores.append([bar[0],item[0],quantity])


#print(*Items, sep='\n')

"""

>INVENTORY

"""

Inventory = [x[:] for x in Sells]

for sell in Inventory:
    sell[len(sell)-1] = random.randint(100,250)

#print(*Inventory, sep='\n')

# cd = os.path.dirname(__file__)
# cd = os.path.join(cd,'out/')
# cd = os.path.join(cd,("Stores"+'_OUT.csv'))
#
# write_list_to_file(Stores, cd)

"""

>BILLS
>PAYS

"""

Bills = []
Pays = []

# Duplicate beer and item list to decrease amounts. Could have added & removed another field... Oh well
beerlist = [x[:] for x in Inventory]
itemlist = [x[:] for x in Stores]

for i in range(7000):
    tempbill = []
    id = ids.pop(random.randint(0,len(ids)-1))

    # Ensure the bill, user, and bar match the city
    customer = random.choice(Drinkers)
    place = customer[3]
    i = random.randint(0,len(Bars)-1)
    bar = Bars[i]
    tries = 0
    if place != bar[3]:
        if place not in [cbar[3] for cbar in Bars]:
            d = random.randint(0, len(Drinkers) - 1)
            customer = Drinkers[d]
            place = customer[2]
        else:
            i = random.randint(0,len(Bars)-1)
            bar = Bars[i]

    # tempbill: BillID, Bar Name, Date, Time
    # Items to be added afterwards
    tempbill.append(abbrv[i]+'-'+id) # Bar Marker Prefix
    tempbill.append(bar[0])

    # Add timestamp
    day = random.randint(1,7)
    date = str(11) + "/" + str(day)
    tempbill.append(date)
    starttime = int(random.choice(bar[8][:-1]))
    time = random.randint(starttime, starttime + 4)
    time = str(time).zfill(2)+":"+str(random.randint(0,59)).zfill(2)
    tempbill.append(time)

    total = 0.0
    # Random amounts of random items to sum total

    # BEERS to add to bill
    # Select indicies of appropriate bars

    thesebeers = [i for i in range(len(Inventory)-1) if Inventory[i][0] == bar[0]]
    for count in range(random.randint(1,5)):

        if not thesebeers: break

        # Grab the right beer
        superbill = tempbill.copy()
        beernum = thesebeers.pop(random.randint(0,len(thesebeers)-1))
        beer = beerlist[beernum]

        # Check remaning inventory and count and update quantity accordingly
        quantity = random.randint(1,4)
        if beer[2] <= 3 and beer[2] >= 1:
            quantity = beer[2]
        elif beer[2] == 0: continue
        beerlist[beernum][2] = beerlist[beernum][2] - quantity

        beerdata = Sells[beernum]
        ctotal = float(beerdata[2]) * float(quantity)
        thistotal = float('%.2f' % (ctotal*1.2))
        total = total + thistotal
        [superbill.append(x) for x in [beerdata[1],beerdata[2],quantity, thistotal]]
        #print(superbill)
        Bills.append(superbill)

    # ITEMS to add to bill
    # Select indicies of appropriate bars

    theseitems = [i for i in range(len(Stores)-1) if Stores[i][0] == bar[0]]
    for count in range(random.randint(1,5)):
        if not theseitems: break

        # Grab the right items
        superbill = tempbill.copy()
        itemnum = theseitems.pop(random.randint(0,len(theseitems)-1))
        item = itemlist[itemnum]

        # Check remaining inventory and count and update quantity accordingly
        quantity = random.randint(1,5)
        if item[2] <= 3 and item[2] >= 1:
            quantity = item[2]
        elif item[2] == 0: continue
        itemlist[itemnum][2] = itemlist[itemnum][2] - quantity

        itemdata = Items[itemnum]
        ctotal = float(itemdata[2]) * float(quantity)
        thistotal = float('%.2f' % (ctotal*1.2))
        total = total + thistotal
        [superbill.append(x) for x in [itemdata[1],itemdata[2],quantity, thistotal]]
        #print(superbill)
        Bills.append(superbill)
    total = float('%.2f' % total)
    pay = [abbrv[i]+'-'+id,customer[0],customer[1],total]
    #print(pay)
    Pays.append(pay)

for bill in Bills:
    if '/' in bill[4]:
        j = Bills.index(bill)
        del(Bills[j])

#print(*Bills, sep='\n')
#print(*Pays, sep='\n')


#for bill in Bills:
#    Pays.append([bill[0],bill[1],bill[3]])

# Remove price (Beers[2]) from Beers
Beers = [x[0:2] for x in Beers]

# Remove bar shift hours
Bars = [x[0:8] for x in Bars]
for entry in Bars:
    if entry[7]  == 24:
        entry[6] = (str(entry[6]).zfill(2) + ":00")
        entry[7] = '23:59'
    else:
        entry[6] = (str(entry[6]).zfill(2) + ":00")
        entry[7] = (str(entry[7]).zfill(2) + ":00")

Stores = [x[:3] for x in Stores]

"""

ADD HEADER COLUMN

"""
Bars.insert(0,['BarName','License','State','City','Address','Phone','OpenTime','CloseTime'])
Bartenders.insert(0,['EmployeeID','FirstName','LastName'])
Beers.insert(0,['BeerName', 'Manf'])
Bills.insert(0,['BillID', 'BarName', 'Date', 'Time', 'ItemName', 'Price','Quantity', 'TipTotal'])
Drinkers.insert(0,['FirstName','LastName','State','City','Phone','Address'])
Frequents.insert(0,['FirstName','LastName','BarName'])
Inventory.insert(0,['BarName','Beername','Amount'])
Items.insert(0,['BarName','ItemName','Price'])
Likes.insert(0,['FirstName','LastName','Beer'])
Pays.insert(0,['BillID','FirstName','LastName','Total'])
Schedules.insert(0,['BarName','EmployeeID'])
Sells.insert(0,['BarName','BeerName','Price'])
Shifts.insert(0,['EmployeeID', 'StartTime', 'EndTime', 'WeekDay'])
Stores.insert(0,['BarName','ItemName','Quantity'])


"""

WRITING TO FILES

"""

cd = os.path.dirname(__file__)
cd = os.path.join(cd,'out/')
#rel_path = "2091/data.txt"

MASTER_LIST = {"Beers": Beers, "Bars": Bars, "Drinkers": Drinkers,"Likes": Likes,"Frequents": Frequents, "Stores": Stores,"Shifts": Shifts,"Bartenders": Bartenders,"Items": Items,"Bills": Bills, "Sells": Sells,"Schedules": Schedules, "Pays": Pays, "Inventory": Inventory}



def write_list_to_file(guest_list, filename):
    """Write the list to csv file."""

    # if guest_list == Items:
    #     with open(filename, "w") as outfile:
    #         for entries in guest_list:
    #             outfile.write(str(entries)+',')
    #             outfile.write("\n")

    with open(filename, "w") as outfile:
        for entries in guest_list:
            for cell in entries:
                outfile.write(str(cell)+',')
            outfile.write("\n")

for key in MASTER_LIST.keys():
    write_list_to_file(MASTER_LIST[key],os.path.join(cd,(key+'.csv')))
