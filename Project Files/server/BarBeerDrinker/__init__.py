from flask import Flask
from flask import jsonify
from flask import make_response
from flask import request
from flask import redirect
import json

from BarBeerDrinker import database

app = Flask(__name__)

@app.route('/api/bar', methods=["GET"])
def get_bars():
    return jsonify(database.get_bars())


@app.route("/api/bar/<name>", methods=["GET"])
def find_bar(name):
    try:
        if name is None:
            raise ValueError("Bar is not specified.")
        bar = database.find_bar(name)
        if bar is None:
            return make_response("No bar found with the given name.", 404)
        return jsonify(bar)
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/beers_cheaper_than", methods=["POST"])
def find_beers_cheaper_than():
    body = json.loads(request.data)
    max_price = body['maxPrice']
    return jsonify(database.filter_beers(max_price))


@app.route('/api/menu/<name>', methods=['GET'])
def get_menu(name):
    try:
        if name is None:
            raise ValueError('Bar is not specified.')
        bar = database.find_bar(name)
        if bar is None:
            return make_response("No bar found with the given name.", 404)
        return jsonify(database.get_bar_menu(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/bar-cities", methods=["GET"])
def get_bar_cities():
    try:
        return jsonify(database.get_bar_cities())
    except Exception as e:
        return make_response(str(e), 500)

@app.route("/api/bar-top-drinkers/<bar_name>", methods=["GET"])
def get_bar_top_drinkers(bar_name):
    try:
        return jsonify(database.get_bar_top_drinkers(bar_name))
    except Exception as e:
        return make_response(str(e), 500)

@app.route("/api/bar-top-sold-beers/<bar_name>_<day>", methods=["GET"])
def get_bar_top_sold_beers(bar_name, day):
    try:
        return jsonify(database.get_bar_top_sold_beers(bar_name, day))
    except Exception as e:
        return make_response(str(e), 500)

@app.route("/api/days", methods=["GET"])
def get_days():
    try:
        return jsonify(database.get_days())
    except Exception as e:
        return make_response(str(e), 500)

@app.route("/api/beer", methods=["GET"])
def get_beers():
    try:
        return jsonify(database.get_beers())
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/beer-manufacturer", methods=["GET"])
def get_beer_manufacturers():
    try:
        return jsonify(database.get_beer_manufacturers(None))
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/beer-manufacturer/<beer>", methods=["GET"])
def get_manufacturers_making(beer):
    try:
        return jsonify(database.get_beer_manufacturers(beer))
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/likes", methods=["GET"])
def get_likes():
    try:
        drinker = request.args.get("drinker")
        if drinker is None:
            raise ValueError("Drinker is not specified.")
        return jsonify(database.get_likes(drinker))
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/drinker", methods=["GET"])
def get_drinkers():
    try:
        return jsonify(database.get_drinkers())
    except Exception as e:
        return make_response(str(e), 500)

@app.route("/api/drinker/<FirstName>_<LastName>", methods=["GET"])
def get_drinker(FirstName, LastName):
    try:
        if FirstName is None and LastName is None:
            raise ValueError("First name and last name of drinker are not fully specified.")
        return jsonify(database.get_drinker_info(FirstName, LastName))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route("/api/drinker/<FirstName>_<LastName>/transactions", methods=["GET"])
def get_drinker_transactions(FirstName, LastName):
    try:
        if FirstName is None and LastName is None:
            raise ValueError("First name and last name of drinker are not fully specified.")
        return jsonify(database.get_drinker_transactions(FirstName, LastName))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route("/api/drinker/<FirstName>_<LastName>/beer_purchases", methods=["GET"])
def get_drinker_beer_purchases(FirstName, LastName):
    try:
        if FirstName is None and LastName is None:
            raise ValueError("First name and last name of drinker are not fully specified.")
        return jsonify(database.get_drinker_beer_purchases(FirstName, LastName))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route("/api/drinker/<FirstName>_<LastName>/spending", methods=["GET"])
def get_drinker_spending_per_bar_per_day(FirstName, LastName):
    try:
        if FirstName is None and LastName is None:
            raise ValueError("First name and last name of drinker are not fully specified.")
        return jsonify(database.get_drinker_spend_per_bar_per_day(FirstName, LastName))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)

@app.route('/api/bars-selling/<beer>', methods=['GET'])
def find_bars_selling(beer):
    try:
        if beer is None:
            raise ValueError('Beer not specified')
        return jsonify(database.get_bars_selling(beer))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route("/api/bartenders/<FirstName>_<LastName>/shifts", methods=["GET"])
def get_bartender_shifts(FirstName, LastName):
    try:
        if FirstName is None and LastName is None:
            raise ValueError("First name and last name of bartender are not fully specified.")
        return jsonify(database.get_bartender_shifts(FirstName, LastName))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route("/api/bartenders/<FirstName>_<LastName>/sales", methods=["GET"])
def get_bartender_sales(FirstName, LastName):
    try:
        if FirstName is None and LastName is None:
            raise ValueError("First name and last name of bartender are not fully specified.")
        return jsonify(database.get_bartender_sales(FirstName, LastName))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route("/api/bars/<name>/bartenders", methods=["GET"])
def get_bartenders_for_bar(name):
    try:
        if name is None:
            raise ValueError('Bar is not specified.')
        bar = database.find_bar(name)
        if bar is None:
            return make_response("No bar found with the given name.", 404)
        return jsonify(database.get_bartenders_for_bar(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)

@app.route('/api/frequents-data', methods=['GET'])
def get_bar_frequent_counts():
    try:
        return jsonify(database.get_bar_frequent_counts())
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route('/api/patterns/1', methods=['GET'])
def verify_pattern_1():
    try:
        return jsonify(database.verify_pattern_1())
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route('/api/patterns/2', methods=['GET'])
def verify_pattern_2():
    try:
        return jsonify(database.verify_pattern_2())
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route('/api/patterns/3', methods=['GET'])
def verify_pattern_3():
    try:
        return jsonify(database.verify_pattern_3())
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route('/api/patterns/4', methods=['GET'])
def verify_pattern_4():
    try:
        return jsonify(database.verify_pattern_4())
    except Exception as e:
        return make_response(str(e), 500)
        
@app.route('/api/patterns/5', methods=['GET'])
def verify_pattern_5():
    try:
        return jsonify(database.verify_pattern_5())
    except Exception as e:
        return make_response(str(e), 500)

@app.route('/', defaults={'path': ''})
@app.route('/<path>', methods=["GET"])
def home(path):
    return redirect("/static/index.html")