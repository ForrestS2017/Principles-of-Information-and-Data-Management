from flask import Flask
from flask import jsonify
from flask import make_response
from flask import request
import json

from BarBeerDrinkerPro import database

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Welcome to BarBeerDrinker, use the address bar to navigate ^.'


@app.route('/api/bar', methods=["GET"])
def get_bars():
    return jsonify(database.get_bars())


