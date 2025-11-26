from dotenv import load_dotenv
load_dotenv()
from flask import Flask
from flask_cors import CORS
from routes.about import about_bp
from routes.auth import auth_bp
from routes.chapters import chapters_bp
from routes.courses import courses_bp
from routes.classes import classes_bp
from routes.dialogue import dialogue_bp
from routes.home import home_bp
from routes.menu import menu_bp
from routes.questions import questions_bp
from routes.skills import skills_bp
from routes.students import students_bp


app = Flask(__name__)
CORS(
    app, supports_credentials=True
)  # This will allow requests even from cringe JS apps(ew JS)
app.config["SECRET_KEY"] = "mrbombasticfullyfantastic"

app.register_blueprint(home_bp)
app.register_blueprint(about_bp)
app.register_blueprint(students_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(menu_bp)
app.register_blueprint(courses_bp)
app.register_blueprint(classes_bp)
app.register_blueprint(chapters_bp)
app.register_blueprint(questions_bp)
app.register_blueprint(dialogue_bp)
app.register_blueprint(skills_bp)

if __name__ == "__main__":
    app.run(host="localhost", port=5001, debug=True)
