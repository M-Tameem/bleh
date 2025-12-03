"""
BKT Model Helper - Student Mastery Management 
"""

import json
from pathlib import Path
from typing import Dict, Optional, Any
from datetime import datetime

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BACKEND_DIR / 'data'

import sys
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Import our new wrapper
from models.bkt import get_bkt_model

DEBUG = True

def debug_log(category: str, message: str):
    if DEBUG:
        print(f"[{category}] {message}")

class StudentModelManager:
    
    def __init__(self):
        self.bkt = get_bkt_model()
        debug_log("INIT", "StudentModelManager initialized with Linear Regression engine")

    # --- Legacy / Dummy Attributes for Compatibility ---
    @property
    def is_training(self):
        """Mock attribute to satisfy auth.py"""
        return False

    @property
    def is_trained(self):
        """Mock attribute to satisfy auth.py"""
        return True

    def train_async(self):
        """Mock method to satisfy auth.py"""
        debug_log("BKT", "train_async called (No-op for Linear Regression engine)")
        pass
    # ---------------------------------------------------
        
    def _get_student_models_path(self) -> Path:
        return DATA_DIR / 'student_models.json'
    
    def load_student_model(self, student_id: str) -> Dict:
        path = self._get_student_models_path()
        try:
            if path.exists():
                content = path.read_text(encoding='utf-8').strip()
                if content and content != "":
                    all_models = json.loads(content)
                    return all_models.get(student_id, {"mastery": {}, "bkt_history": {}})
        except Exception as e:
            print(f"[BKT] Error loading student model: {e}")
            try:
                path.write_text('{}', encoding='utf-8')
            except:
                pass
        return {"mastery": {}, "bkt_history": {}}
    
    def save_student_model(self, student_id: str, model_data: Dict):
        path = self._get_student_models_path()
        path.parent.mkdir(exist_ok=True)
        try:
            all_models = {}
            if path.exists():
                try:
                    content = path.read_text(encoding='utf-8').strip()
                    if content and content != "":
                        all_models = json.loads(content)
                except:
                    all_models = {}
            all_models[student_id] = model_data
            path.write_text(json.dumps(all_models, indent=4), encoding='utf-8')
        except Exception as e:
            print(f"[BKT] Error saving student model: {e}")
    
    def get_mastery(self, student_id: str, skill_id: str) -> float:
        """Returns the current mastery probability for a skill."""
        model_data = self.load_student_model(student_id)
        return model_data["mastery"].get(skill_id, 0.0) # Default to 0.0 if unknown
    
    def get_mastery_threshold(self) -> float:
        return self.bkt.MASTERY_THRESHOLD
    
    def get_chapter_mastery(self, student_id: str, skill_ids: list) -> Dict[str, float]:
        model_data = self.load_student_model(student_id)
        return {
            skill_id: model_data["mastery"].get(skill_id, 0.0)
            for skill_id in skill_ids
        }

    def choose_next_skill(self, student_id: str, available_skills: list) -> Optional[str]:
        masteries = self.get_chapter_mastery(student_id, available_skills)
        threshold = self.bkt.MASTERY_THRESHOLD
        
        unmastered = [(s, m) for s, m in masteries.items() if m < threshold]
        
        if not unmastered:
            return None
    
        return unmastered[0][0]

    def record_attempt(
        self,
        student_id: str,
        skill_id: str,
        is_correct: bool,
        difficulty: int = 3
    ) -> Dict[str, Any]:

        debug_log("BKT", f"Processing attempt for {student_id} on {skill_id}")
        
        model_data = self.load_student_model(student_id)
        
        if skill_id not in model_data["bkt_history"]:
            model_data["bkt_history"][skill_id] = []
        
        model_data["bkt_history"][skill_id].append({
            "correct": 1 if is_correct else 0,
            "difficulty": difficulty,
            "timestamp": datetime.now().isoformat()
        })
        
        # 3. Calculate New Mastery using Linear Regression
        history = model_data["bkt_history"][skill_id]
        new_mastery = self.bkt.estimate_mastery(skill_id, history)
        
        # 4. Save Update
        model_data["mastery"][skill_id] = round(new_mastery, 4)
        self.save_student_model(student_id, model_data)
        
        debug_log("BKT", f"New Mastery: {new_mastery:.4f} (Mastered: {self.bkt.is_mastered(new_mastery)})")
        
        return {
            "skill": skill_id,
            "new_mastery": round(new_mastery, 4),
            "is_mastered": self.bkt.is_mastered(new_mastery),
            "attempts": len(history)
        }

_manager_instance = None

def get_student_manager() -> StudentModelManager:
    global _manager_instance
    if _manager_instance is None:
        _manager_instance = StudentModelManager()
    return _manager_instance


# ==========================================
# BACKWARD COMPATIBILITY FUNCTIONS 
# ==========================================

def get_bkt_tracker() -> StudentModelManager:
    return get_student_manager()

def load_student_model(student_id: str) -> Dict:
    return get_student_manager().load_student_model(student_id)

def save_student_model(student_id: str, model_data: Dict):
    get_student_manager().save_student_model(student_id, model_data)

def record_attempt(student_id: str, skill_name: str, is_correct: int, difficulty: int = 3) -> Dict:
    return get_student_manager().record_attempt(
        student_id, 
        skill_name, 
        bool(is_correct),
        difficulty
    )

def get_student_mastery(student_id: str, skill_name: str) -> float:
    return get_student_manager().get_mastery(student_id, skill_name)

def choose_next_skill(student_id: str, available_skills: list) -> Optional[str]:
    return get_student_manager().choose_next_skill(student_id, available_skills)

class BKTTracker(StudentModelManager):
    pass