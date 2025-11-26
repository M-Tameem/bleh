"""
models/knowledge_tracing.py
"""
import random
import numpy as np
import pandas as pd
from typing import List, Dict, Optional, Any
from dataclasses import dataclass
from sklearn.linear_model import LogisticRegression

@dataclass
class QuestionSelectionResult:
    question: Dict[str, Any]
    reason: str
    target_difficulty: int

class KnowledgeTracer:
    TARGET_SUCCESS_PROB = 0.60
    RECENT_WINDOW = 3

    def __init__(self):
        self.model = None
        self._train_initial_model()

    def _train_initial_model(self):
        # ... (Keep your existing synthetic training logic here, it's fine) ...
        mastery_samples = []
        difficulty_samples = []
        outcomes = []

        for diff in range(1, 6):
            for _ in range(10):
                mastery_samples.append(0.1)
                difficulty_samples.append(diff)
                outcomes.append(1 if diff == 1 and random.random() > 0.3 else 0)

        for diff in range(1, 6):
            for _ in range(10):
                mastery_samples.append(0.5)
                difficulty_samples.append(diff)
                if diff <= 3: outcomes.append(1 if random.random() > 0.2 else 0)
                else: outcomes.append(0 if random.random() > 0.3 else 1)

        for diff in range(1, 6):
            for _ in range(10):
                mastery_samples.append(0.9)
                difficulty_samples.append(diff)
                outcomes.append(1 if random.random() > 0.1 else 0)

        X = pd.DataFrame({'mastery': mastery_samples, 'difficulty': difficulty_samples})
        y = np.array(outcomes)

        self.model = LogisticRegression()
        self.model.fit(X, y)

    def _get_attempted_ids(self, history: List[Dict]) -> set:
        """
        CHANGED: Returns set of IDs that have been attempted AT ALL 
        (Correct, Incorrect, or Skipped) to prevent immediate spamming.
        """
        attempted = set()
        for attempt in history:
            # We take the ID regardless of the result
            if "question_id" in attempt:
                attempted.add(str(attempt.get("question_id")))
        return attempted

    def pick_next_question(
        self,
        questions: List[Dict],
        recent_attempts: List[Dict],
        mastery: float,
        question_type_filter: Optional[str] = None
    ) -> Optional[QuestionSelectionResult]:
        
        if not questions: return None
        
        candidates = questions
        if question_type_filter:
            candidates = [q for q in questions if q.get('type') == question_type_filter]
            if not candidates: candidates = questions 

        # CHANGED: Use the new attempted logic
        attempted_ids = self._get_attempted_ids(recent_attempts)
        unseen_candidates = [q for q in candidates if str(q.get('id')) not in attempted_ids]
        
        # If we have unseen questions, prioritize those. 
        # If we ran out of unseen questions, we fall back to the full pool (re-practice).
        final_candidates = unseen_candidates if unseen_candidates else candidates

        if not final_candidates:
            return None

        X_pred = pd.DataFrame({
            'mastery': [mastery] * len(final_candidates),
            'difficulty': [q.get('difficulty', 3) for q in final_candidates]
        })

        probs = self.model.predict_proba(X_pred)[:, 1]

        best_idx = -1
        min_diff = 1.0
        
        for i, prob in enumerate(probs):
            diff = abs(prob - self.TARGET_SUCCESS_PROB)
            diff += random.uniform(0, 0.05) # Small jitter
            
            if diff < min_diff:
                min_diff = diff
                best_idx = i

        selected_question = final_candidates[best_idx]
        predicted_prob = probs[best_idx]
        
        print(f"[KT] Selected {selected_question['id']} (Prob: {predicted_prob:.2f})")

        return QuestionSelectionResult(
            question=selected_question,
            reason=f"ML Predicted {int(predicted_prob*100)}% success",
            target_difficulty=selected_question.get('difficulty', 3)
        )

_kt_instance = None
def get_knowledge_tracer() -> KnowledgeTracer:
    global _kt_instance
    if _kt_instance is None: _kt_instance = KnowledgeTracer()
    return _kt_instance