#=====================================
# our questions.py was doing too much work and became a monolith, so i did this to handle new structure
#=====================================
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"


def _chapter_file(course_id, chapter_id):
    return DATA_DIR / "chapters" / course_id / f"{chapter_id}.json"


def load_chapter_questions(course_id, chapter_id):
    path = _chapter_file(course_id, chapter_id)
    with open(path) as f:
        questions = json.load(f)

    if not isinstance(questions, list):
        raise ValueError(f"Chapter data at {path} must be a list of questions")
    return questions


def load_course_chapters(course_id):
    content_dir = DATA_DIR / "chapters" / "content"
    chapters = []
    
    if not content_dir.exists():
        return []

    for content_file in content_dir.glob("*.json"):
        try:
            with open(content_file, 'r') as f:
                data = json.load(f)
                
            if course_id in data:
                course_chapters = data[course_id]
                if isinstance(course_chapters, list):
                    chapters.extend(course_chapters)
        except Exception as e:
            print(f"Error loading chapter content from {content_file}: {e}")
            continue
            
    def get_chapter_num(ch):
        try:
            return int(ch['id'].replace('ch', ''))
        except:
            return 000

    chapters.sort(key=get_chapter_num)
    return chapters


def build_question_bank(course_id, chapter_id):

    questions = load_chapter_questions(course_id, chapter_id)
    skill_map = {}
    skill_ids = []

    for index, question in enumerate(questions):
        question_id = str(question.get("id", f"q{index + 1}"))
        skill_id = f"{course_id}:{chapter_id}:{question_id}"
        prompt = question.get("question", question_id).strip()
        skill_map[skill_id] = {
            "question": question,
            "index": index,
            "question_id": question_id,
            "skill_name": prompt.split("\n")[0].strip() or question_id,
        }
        skill_ids.append(skill_id)

    return questions, skill_map, skill_ids


def load_all_question_skills():
    skills = {}
    chapters_root = DATA_DIR / "chapters"

    if not chapters_root.exists():
        return skills

    for course_dir in chapters_root.iterdir():
        if not course_dir.is_dir():
            continue
            
        if course_dir.name == "content":
            continue

        course_id = course_dir.name
        for chapter_file in course_dir.glob("*.json"):
            chapter_id = chapter_file.stem
            with open(chapter_file) as f:
                questions = json.load(f)

            if not isinstance(questions, list):
                continue

            for index, question in enumerate(questions):
                question_id = str(question.get("id", f"q{index + 1}"))
                skill_id = f"{course_id}:{chapter_id}:{question_id}"
                prompt = question.get("question", question_id).strip()
                skills[skill_id] = {
                    "name": prompt.split("\n")[0].strip() or question_id,
                    "course": course_id,
                    "chapter": chapter_id,
                    "question_id": question_id,
                    "type": question.get("type", "multiple_choice"),
                    "difficulty": question.get("difficulty", 3), 
                }

    return skills
