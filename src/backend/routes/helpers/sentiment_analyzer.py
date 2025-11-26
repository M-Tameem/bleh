"""
Affective Computing
"""

from textblob import TextBlob
import os

os.environ["OPENAI_API_KEY"] = "disabled"



try:
    client = OpenAI()
    OPENAI_AVAILABLE = False
except Exception:
    client = None
    OPENAI_AVAILABLE = False


def detect_frustration(user_input_text):
    blob = TextBlob(user_input_text)
    
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    is_frustrated = polarity < -0.5 and subjectivity > 0.5
    
    if is_frustrated:
        sentiment = "frustrated"
    elif polarity < -0.3:
        sentiment = "negative"
    elif polarity > 0.3:
        sentiment = "positive"
    else:
        sentiment = "neutral"
        
    return {
        "is_frustrated": is_frustrated,
        "polarity": round(polarity, 2),
        "subjectivity": round(subjectivity, 2),
        "sentiment": sentiment
    }


def generate_supportive_feedback(sentiment_data, is_correct):

    if not OPENAI_AVAILABLE:
        #justr for now
        base = "Nice work!" if is_correct else "Good try—you're getting there."
        
        if sentiment_data["sentiment"] in ["negative", "frustrated"]:
            return base + " Take a breath, you're doing fine."
        else:
            return base

    #if OpenAI *is* available, use it normally:
    sentiment = sentiment_data["sentiment"]

    system_prompt = (
        "You are a supportive CS tutor. Respond with empathy, "
        "clarity, and encouragement. Keep responses under 3 sentences."
    )

    user_prompt = f"""
The student just answered a question.

Correctness: {"correct" if is_correct else "incorrect"}
Sentiment: {sentiment}

Write a friendly, supportive response.
    """

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=100
    )

    return response.choices[0].message.content.strip()
