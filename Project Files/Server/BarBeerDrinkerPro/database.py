from sqlalchemy import create_engine
from sqlalchemy import sql

from BarBeerDrinkerPro import config

engine = create_engine(config.database_uri)


def get_bars():
    with engine.connect() as con:
        rs = con.execute("SELECT BarName FROM Bars;")
        return [dict(row) for row in rs]