from flask import Flask
from flask_cors import CORS
from home import home_bp
from about import about_bp
from students import students_bp
from auth import auth_bp
from menu import menu_bp
from courses import courses_bp
from chapters import chapters_bp
from questions import questions_bp

app = Flask(__name__)
CORS(app, supports_credentials=True)  # This will allow requests even from cringe JS apps(ew JS)
app.config['SECRET_KEY'] = 'mrbombasticfullyfantastic'  

app.register_blueprint(home_bp)
app.register_blueprint(about_bp)
app.register_blueprint(students_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(menu_bp)
app.register_blueprint(courses_bp)
app.register_blueprint(chapters_bp)
app.register_blueprint(questions_bp)

if __name__ == '__main__':
    app.run(host="localhost", port=5001, debug=True)

