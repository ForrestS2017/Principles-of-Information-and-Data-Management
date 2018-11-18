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
            rs = con.execute('SELECT DISTINCT Manf FROM Beers;')
            return [row['Manf'] for row in rs]

        query = sql.text('SELECT Manf FROM Beers WHERE BeerName = :beer;')
        rs = con.execute(query, beer=beer)
        result = rs.first()
        if result is None:
            return None
        return result['Manf']


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

"""
DRINKER PAGE
"""


def get_drinker_transactions(first_name,last_name):
    with engine.connect() as con:
        query = sql.text("SELECT b.BillID, b.Date, b.Time, b.BarName, b.ItemName, b.Quantity, b.Price, b.TipTotal \
            FROM Pays p, Bills b \
            WHERE p.FirstName = :first_name AND p.LastName = :last_name AND p.BillID = b.BillID \
            ORDER BY b.Date ASC, b.Time ASC, b.BillId, b.BarName;")
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
        return dict(result)


def get_spending_habit(first_name,last_name,bar_name):
    with engine.connect() as con:
        query = sql.text()
    rs = con.execute(query, first_name=first_name,last_name=last_name,bar_name=bar_name)
    if rs.first() is None:
        return None
    return dict(rs)

"""
BARTENDER PAGE
"""


def get_bartender_shfits(bartender_id):
    with engine.connect as con:
        query = sql.text()
    rs = con.execute(query, bartender_id=bartender_id)
    if rs.first() is None:
        return None
    return dict(rs)


def get_bartender_sales(bartender_id):
    with engine.connect as con:
        query = sql.text()
    rs = con.execute(query, bartender_id=bartender_id)
    if rs.first() is None:
        return None
    return dict(rs)

## TODO: BARTENDER ANALYTICS ##

"""
MANF PAGE
"""


def get_highest_sales(manf_name,city_name):
    with engine.connect as con:
        query = sql.text()
    rs = con.execute(query, manf_name=manf, city_name=city)
    if rs.first() is None:
        return None
    return dict(rs)


def get_liked_manfs(manf_name,city_name):
    with engine.connect as con:
        query = sql.text()
    rs = con.execute(query, manf_name=manf, city_name=city)
    if rs.first() is None:
        return None
    return dict(rs)


def get_total_sales(manf_name):
    with engine.connect as con:
        query = sql.text()
    rs = con.execute(query, manf_name=manf)
    if rs.first() is None:
        return None
    return dict(rs)
