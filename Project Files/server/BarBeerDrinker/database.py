from sqlalchemy import create_engine
from sqlalchemy import sql

from BarBeerDrinker import config

engine = create_engine(config.database_uri)

"""
BAR PAGE
"""


def get_bars():
    with engine.connect() as con:
        rs = con.execute("SELECT BarName, License, City, Phone, Address FROM Bars;")
        return [dict(row) for row in rs]


def find_bar(name):
    with engine.connect() as con:
        query = sql.text(
            "SELECT BarName, License, City, Phone, Address FROM Bars WHERE BarName = :name;"
        )
        rs = con.execute(query, name=name)
        result = rs.first()
        if result is None:
            return None
        return dict(result)


def filter_beers(max_price):
    with engine.connect() as con:
        query = sql.text(
            "SELECT * FROM Sells WHERE Price < :max_price;"
        )
        rs = con.execute(query, max_price=max_price)
        results = [dict(row) for row in rs]
        for r in results:
            r['Price'] = float(r['Price'])
        return results


def get_bar_menu(bar_name):
    with engine.connect() as con:
        query = sql.text(
            'SELECT a.bar, a.beer, a.price, b.manf, coalesce(c.like_count, 0) as likes \
                FROM Sells as a \
                JOIN beers AS b \
                ON a.beer = b.name \
                LEFT OUTER JOIN (SELECT beer, count(*) as like_count FROM likes GROUP BY beer) as c \
                ON a.beer = c.beer \
                WHERE a.bar = :bar; \
            ')
        rs = con.execute(query, bar=bar_name)
        results = [dict(row) for row in rs]
        for i, _ in enumerate(results):
            results[i]['Price'] = float(results[i]['Price'])
        return results


def get_bars_selling(beer):
    with engine.connect() as con:
        query = sql.text('SELECT a.BarName, a.Price, b.customers \
                FROM Sells AS a \
                JOIN (SELECT BarName, count(*) AS customers FROM Frequents GROUP BY BarName) as b \
                ON a.BarName = b.BarName \
                WHERE a.BeerName = :beer \
                ORDER BY a.Price; \
            ')
        rs = con.execute(query, beer=beer)
        results = [dict(row) for row in rs]
        for i, _ in enumerate(results):
            results[i]['Price'] = float(results[i]['Price'])
        return results


def get_bar_frequent_counts():
    with engine.connect() as con:
        query = sql.text('SELECT BarName, count(*) as frequentCount \
                FROM Frequents \
                GROUP BY BarName; \
            ')
        rs = con.execute(query)
        results = [dict(row) for row in rs]
        return results


def get_bar_cities():
    with engine.connect() as con:
        rs = con.execute('SELECT DISTINCT City FROM Bars;')
        return [row['City'] for row in rs]

def get_bar_top_drinkers(bar_name):
    with engine.connect() as con:
        query = sql.text('SELECT p.FirstName, p.LastName, p.Total \
                        FROM Pays p, Bills b \
                        WHERE p.BillID = b.BillID and b.BarName = :bar_name \
                        Group by p.BillID \
                        Order by p.Total desc \
                        limit 10 \
                        ')
        rs = con.execute(query,bar_name=bar_name)
        if rs.rowcount is 0:
            return None
        results = [dict(row) for row in rs]
        return results

def get_bar_top_sold_beers(bar_name, day):
    with engine.connect() as con:
        query = sql.text('SELECT b.ItemName , sum(b.Quantity) AS Quantity \
                        FROM Bills b \
                        WHERE b.`Date` = :day AND b.BarName = :bar_name AND b.ItemName in (SELECT bb.BeerName FROM Beers bb) \
                        GROUP BY b.ItemName \
                        ORDER BY Quantity DESC \
                        ')
        rs = con.execute(query,bar_name=bar_name, day=day)
        if rs.rowcount is 0:
            return None
        results = [dict(row) for row in rs]
        """
        The column for Quantity was registered as a "DECIMAL" type which could not be JSON-ified
        The solution was to take each element of the list (a dictionary), target the second entry
            of that dictionary, and reset it to an int rather than a DECIMAL
        """
        for thisdict in results:
            target = thisdict.items()[1][0]
            thisdict[target] = int(thisdict[target])
        return results

def get_days():
    with engine.connect() as con:
        query = sql.text('SELECT * FROM Dates')
        rs = con.execute(query)
        if rs.rowcount is 0:
            return None
        results = [dict(row) for row in rs]
        return results


"""
BEER PAGE
"""

def get_beers():
    """Gets a list of beer names from the beers table."""
    with engine.connect() as con:
        rs = con.execute('SELECT BeerName, Manf FROM Beers;')
        return [dict(row) for row in rs]


def get_beer_manufacturers(beer):
    with engine.connect() as con:
        if beer is None:
            rs = con.execute('SELECT DISTINCT Manf FROM Beers ORDER BY Manf;')
            return [dict(row) for row in rs]
        query = sql.text('SELECT Manf FROM Beers WHERE BeerName = :beer;')
        rs = con.execute(query, beer=beer)
        result = rs.first()
        if result is None:
            return None
        return result['Manf']


def get_beer_top_bars(beer):
    with engine.connect() as con:
        query = sql.text('select BarName, sum(Quantity) as Quantity \
                        from Bills \
                        where ItemName = :beer \
                        group by BarName \
                        order by sum(Quantity) desc limit 10') 
        rs = con.execute(query, beer=beer)
        results = [dict(row) for row in rs]
        for thisdict in results:            
            target = list(thisdict.keys())
            target = target[1]
            thisdict[target] = int(thisdict[target])
        return results


def get_beer_top_drinkers(beer):
    with engine.connect() as con:
        query = sql.text('select p.FirstName as DName, sum(Quantity) as Quantity \
                        from Bills b, Pays p \
                        where ItemName = :beer and p.BillID = b.BillID \
                        group by p.FirstName \
                        order by Quantity desc limit 20') 
        rs = con.execute(query, beer=beer)
        results = [dict(row) for row in rs]
        for thisdict in results:            
            target = list(thisdict.keys())
            target = target[1]
            thisdict[target] = int(thisdict[target])
        return results

"""
DRINKER PAGE
"""


def get_drinkers():
    with engine.connect() as con:
        rs = con.execute('SELECT * FROM Drinkers;')
        return [dict(row) for row in rs]


def get_likes(drinker_name):
    """Gets a list of beers liked by the drinker provided."""
    with engine.connect() as con:
        query = sql.text('SELECT Beer FROM Likes WHERE FirstName = :name;')
        rs = con.execute(query, name=drinker_name)
        return [row['Beer'] for row in rs]


def get_drinker_info(drinker_first_name, drinker_last_name):
    with engine.connect() as con:
        query = sql.text('SELECT * FROM Drinkers WHERE FirstName = :FirstName AND LastName = :LastName;')
        rs = con.execute(query, FirstName=drinker_first_name, LastName=drinker_last_name)
        result = rs.first()
        if result is None:
            return None
        return dict(result)   


def get_drinker_transactions(first_name, last_name):
    with engine.connect() as con:
        query = sql.text("SELECT b.BillID, b.`Date`, b.Time, b.BarName, b.ItemName, b.Quantity, b.Price, b.TipTotal \
            FROM Pays p, Bills b \
            WHERE p.FirstName = :first_name AND p.LastName = :last_name AND p.BillID = b.BillID \
            ORDER BY b.`Date` ASC, b.Time ASC, b.BillId, b.BarName;")
        rs = con.execute(query, first_name=first_name, last_name=last_name)
        return [dict(row) for row in rs]

def get_drinker_beer_purchases(first_name, last_name):
    with engine.connect() as con:
        query = sql.text("SELECT b.ItemName, CAST(SUM(b.Quantity) AS UNSIGNED) as Total \
            FROM Pays p, Bills b \
            WHERE p.FirstName = :first_name AND p.LastName = :last_name AND p.BillID = b.BillID \
            AND b.ItemName IN (SELECT BeerName FROM Beers) \
            GROUP BY b.ItemName \
            ORDER BY Total DESC")
        rs = con.execute(query, first_name=first_name, last_name=last_name)
        return [dict(row) for row in rs]
        
def get_drinker_spend_per_bar_per_day(first_name, last_name):
    with engine.connect() as con:
        query = sql.text("SELECT b.Date, b.BarName, ROUND(SUM(b.TipTotal), 2) as Total \
            FROM Pays p, Bills b \
            WHERE p.FirstName = :first_name AND p.LastName = :last_name AND p.BillID = b.BillID \
            GROUP BY b.Date, b.BarName \
            ORDER BY b.Date")
        rs = con.execute(query, first_name=first_name, last_name=last_name)
        return [dict(row) for row in rs]

def get_beers_ordered(first_name,last_name):
    with engine.connect() as con:
        query = sql.text("SELECT * \
                    FROM Bills b \
                    WHERE b.BillID IN (SELECT p.BillID FROM Pays p WHERE p.FirstName = :first_name AND p.LastName = :last_name); AND b.ItemName IN (SELECT br.BeerName FROM Beers br);")
        rs = con.execute(query, first_name=first_name)
        result = rs.first()
        if result is None:
            return None
        return [dict(row) for row in rs]


def get_spending_habit(first_name,last_name):
    with engine.connect() as con:
        query = sql.text("select bi.BarName, p.total from Bills bi, Pays p where bi.BillID = p.BillID and p.FirstName = :first_name and p.LastName = :last_name group by(bi.BarName)")
        rs = con.execute(query, first_name=first_name,last_name=last_name)
        if rs.first() is None:
            return None
        return dict(rs)

"""
BARTENDER PAGE
"""

def get_bartender_shifts(first_name, last_name):
    with engine.connect() as con:
        query = sql.text("select s.WeekDay, s.StartTime, s.EndTime from Shifts s, Bartenders b where s.EmployeeID = b.EmployeeID and b.FirstName = :first_name and b.LastName = :last_name")
        rs = con.execute(query, first_name=first_name, last_name=last_name)
        if rs.rowcount is 0:
            return None
        return [dict(row) for row in rs]

def get_bartender_sales(first_name, last_name):
    with engine.connect() as con:
        query = sql.text('SELECT b.ItemName, CAST(SUM(b.Quantity) AS UNSIGNED) as TotalSold \
            FROM Bartenders t, Shifts s, Schedules c, Bills b \
            WHERE t.FirstName = :first_name AND t.LastName = :last_name \
                AND t.EmployeeID = s.EmployeeID AND s.EmployeeID = c.EmployeeID AND c.BarName = b.BarName \
                AND b.ItemName IN (SELECT BeerName FROM Beers) \
                AND b.Time >= s.StartTime AND b.Time <= s.EndTime \
                AND ( \
                    (s.WeekDay = \'Mon-Fri\' AND b.Date < \'11/6\') \
                    OR \
                    (s.WeekDay = \'Sat-Sun\' AND b.Date >= \'11/6\') \
                ) \
            GROUP BY b.ItemName')
        rs = con.execute(query, first_name=first_name, last_name=last_name)
        if rs.rowcount is 0:
            return None
        return [dict(row) for row in rs]
    
def get_bartenders_for_bar(bar_name):
    with engine.connect() as con:
        query = sql.text('SELECT b.EmployeeID, b.FirstName, b.LastName \
            FROM Schedules s, Bartenders b \
            WHERE s.BarName = :bar AND s.EmployeeID = b.EmployeeID')
        rs = con.execute(query, bar=bar_name)
        return [dict(row) for row in rs]

## TODO: BARTENDER ANALYTICS ##

"""
MANF PAGE
"""


def get_highest_sales(manf_name):
    with engine.connect() as con:
        query = sql.text("select distinct b.Manf, bi.TipTotal, ba.City from Beers b, Bills bi, Bars ba where b.Manf = :manf_name and ba.BarName = bi.BarName and bi.ItemName in (select distinct b1.BeerName from Beers b1 where b1.Manf = :manf_name) order by bi.TipTotal desc")
        rs = con.execute(query, manf_name=manf_name)
        if rs.rowcount is 0:
            return None
        return [dict(row) for row in rs]


def get_liked_manfs(manf_name):
    with engine.connect() as con:
        query = sql.text("select d.City, count(distinct d.FirstName) as Count from Drinkers d, Likes l where d.FirstName = l.FirstName and d.LastName = l.LastName and l.beer in (select bb.BeerName from Beers bb where bb.Manf = :manf_name) group by d.City order by count(d.FirstName) desc")
        rs = con.execute(query, manf_name=manf_name)
        if rs.rowcount is 0:
            return None
        return [dict(row) for row in rs]


"""
VERIFY PAGE
"""
        
def verify_pattern_1():
    with engine.connect() as con:
        query = sql.text('SELECT CASE WHEN \
            NOT EXISTS ( \
                SELECT bi.BillID, bi.Time, ba.OpenTime, ba.CloseTime \
                FROM Bills bi, Bars ba \
                WHERE bi.BarName = ba.BarName \
                    AND ( \
                        (ba.OpenTime < ba.CloseTime AND (bi.Time < ba.OpenTime OR bi.Time > ba.CloseTime)) \
                        OR \
                        (ba.OpenTime > ba.CloseTime AND (bi.Time < ba.OpenTime AND bi.Time > ba.CloseTime)) \
                    ) \
            ) \
            THEN \'TRUE\' \
            ELSE \'FALSE\' \
            END Verify;')
        rs = con.execute(query)
        result = rs.first()
        if result is None:
            return None
        return [dict(result)]
        
def verify_pattern_2():
    with engine.connect() as con:
        query = sql.text('SELECT CASE WHEN \
            NOT EXISTS ( \
                SELECT d.FirstName, d.LastName, d.State, b.State \
                FROM Drinkers d, Frequents f, Bars b \
                WHERE d.FirstName = f.FirstName AND d.LastName = f.LastName AND b.BarName = f.BarName \
                    AND b.State <> d.State \
            ) \
            THEN \'TRUE\' \
            ELSE \'FALSE\' \
            END Verify;')
        rs = con.execute(query)
        result = rs.first()
        if result is None:
            return None
        return [dict(result)]
        
def verify_pattern_3():
    with engine.connect() as con:
        query = sql.text('SELECT CASE WHEN \
            NOT EXISTS ( \
                SELECT * \
                FROM Sells s1, Sells s2 \
                WHERE s1.BarName = s2.BarName AND s1.BeerName <> s2.BeerName AND s1.Price < s2.Price  \
                AND EXISTS ( \
                    SELECT * \
                    FROM Sells s3, Sells s4 \
                    WHERE s3.BarName = s4.BarName AND s1.BeerName = s3.BeerName AND s2.BeerName = s4.BeerName \
                        AND s3.Price > s4.Price \
                ) \
            ) \
            THEN \'TRUE\' \
            ELSE \'FALSE\' \
            END Verify;')
        rs = con.execute(query)
        result = rs.first()
        if result is None:
            return None
        return [dict(result)]
        
def verify_pattern_4():
    with engine.connect() as con:
        query = sql.text('SELECT CASE WHEN \
            NOT EXISTS ( \
                SELECT * \
                FROM Inventory i2, \
                    (SELECT b.BarName, b.ItemName, SUM(b.Quantity) AS TotalSales \
                        FROM Bills b, Inventory i \
                        WHERE b.BarName = i.BarName AND b.ItemName = i.Beername \
                        GROUP BY b.BarName, b.ItemName) AS d \
                WHERE i2.BarName = d.BarName AND i2.BeerName = d.ItemName AND i2.Amount < d.TotalSales \
            ) \
            THEN \'TRUE\' \
            ELSE \'FALSE\' \
            END Verify;')
        rs = con.execute(query)
        result = rs.first()
        if result is None:
            return None
        return [dict(result)]
        
def verify_pattern_5():
    with engine.connect() as con:
        query = sql.text('SELECT CASE WHEN \
            NOT EXISTS ( \
                SELECT * \
                FROM Shifts s1, Shifts s2 \
                WHERE s1.EmployeeID = s2.EmployeeID AND s1.WeekDay = s2.WeekDay  \
                    AND s1.StartTime <> s2.StartTime AND s1.EndTime <> s2.EndTime \
            ) \
            THEN \'TRUE\' \
            ELSE \'FALSE\' \
            END Verify;')
        rs = con.execute(query)
        result = rs.first()
        if result is None:
            return None
        return [dict(result)]
