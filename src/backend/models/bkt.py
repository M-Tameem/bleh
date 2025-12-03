import os
import pickle
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.linear_model import LinearRegression
import threading

import sys
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

MODEL_PATH = BACKEND_DIR / 'data' / 'linear_weighted_model.pkl'

class BKTEngine:
    MASTERY_THRESHOLD = 0.80

    def __init__(self):
        self.model = None
        self._load_or_train_model()

    def _load_or_train_model(self):
        """Loads existing model or trains a new one."""
        if os.path.exists(MODEL_PATH):
            try:
                with open(MODEL_PATH, 'rb') as f:
                    self.model = pickle.load(f)
                return
            except Exception:
                pass
        
        self._train_new_model()

    def _train_new_model(self):
        print("[Linear] ⚡ Training LENIENT Weighted Linear Model...")
        
        n_samples = 1000
        attempts = np.random.randint(1, 30, n_samples)
        weighted_scores = np.random.uniform(0, attempts * 5, n_samples)
        average_weighted_score = weighted_scores / attempts
        mastery_labels = 0.15 + (average_weighted_score / 3.0) 
        
        mastery_labels += (attempts * 0.01)
        
        noise = np.random.normal(0, 0.02, n_samples)
        mastery_labels = np.clip(mastery_labels + noise, 0, 1)

        X = pd.DataFrame({
            'attempts': attempts,
            'weighted_score': weighted_scores,
            'avg_weighted_score': average_weighted_score
        })
        y = mastery_labels

        self.model = LinearRegression()
        self.model.fit(X, y)
        
        try:
            with open(MODEL_PATH, 'wb') as f:
                pickle.dump(self.model, f)
            print("[Linear] 💾 Lenient Model saved.")
        except Exception as e:
            print(f"[Linear] Warning: Could not save model: {e}")

    def estimate_mastery(self, skill_name, history):
        if not self.model: return 0.1
        
        if not history:
            attempts = 0
            weighted_score = 0
            avg_weighted_score = 0.0
        else:
            attempts = len(history)
            weighted_score = sum(
                h.get('difficulty', 3) if h['correct'] else 0 
                for h in history
            )
            avg_weighted_score = weighted_score / attempts if attempts > 0 else 0.0

        features = pd.DataFrame([[attempts, weighted_score, avg_weighted_score]], 
                              columns=['attempts', 'weighted_score', 'avg_weighted_score'])
        
        try:
            prediction = self.model.predict(features)[0]
            final_score = float(np.clip(prediction, 0.1, 1.0))
            
            print(f"[Linear] Score: {weighted_score} (Avg: {avg_weighted_score:.1f}) -> Mastery: {final_score:.2f}")
            return final_score
            
        except Exception as e:
            print(f"[Linear] Prediction Error: {e}")
            return 0.1

    def is_mastered(self, mastery_score):
        return mastery_score >= self.MASTERY_THRESHOLD

_instance = None
_lock = threading.Lock()

def get_bkt_model():
    global _instance
    if _instance is not None: return _instance
    with _lock:
        if _instance is None: _instance = BKTEngine()
        return _instance

def get_bkt_params_from_difficulty(difficulty):
    return {}