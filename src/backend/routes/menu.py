from flask import Blueprint, request, jsonify
from flask_restful import Resource, Api, reqparse

menu_bp = Blueprint('menu', __name__)
api = Api(menu_bp)

parser = reqparse.RequestParser()
parser.add_argument('button_id', type=str, help='ID of the button that was clicked')

class Menu(Resource):
    def get(self):
        args = parser.parse_args()
        return jsonify({'button_id': args['button_id']})

api.add_resource(Menu, '/menu')