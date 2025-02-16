from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from collections import Counter

app = Flask(__name__)
CORS(app)
analyzer = SentimentIntensityAnalyzer()

# Sentiment Analysis Function
def analyze_sentiment(text):
    if isinstance(text, str):
        score = analyzer.polarity_scores(text)["compound"]
        if score >= 0.6:
            sentiment = "Highly Positive"
        elif 0.05 < score < 0.6:
            sentiment = "Mildly Positive"
        elif -0.05 <= score <= 0.05:
            sentiment = "Neutral"
        elif -0.6 < score < -0.05:
            sentiment = "Mildly Negative"
        else:
            sentiment = "Highly Negative"
        return {"text": text, "sentiment": sentiment, "score": score}
    return {"text": "", "sentiment": "Neutral", "score": 0}

# Spam Detection Function
def detect_spam(text):
    if isinstance(text, str):
        repeated_words = len(re.findall(r"(\b\w+\b)(?=.*\b\1\b)", text, re.IGNORECASE))
        excessive_punctuation = len(re.findall(r"[!?.]{3,}", text))
        return repeated_words > 3 or excessive_punctuation > 2
    return False

# Generate Feedback Based on Sentiment Distribution
def generate_feedback(positive, neutral, negative, total):
    if positive / total > 0.6:
        return "🚀 Great engagement! Keep up the positive interactions."
    elif negative / total > 0.5:
        return "⚠️ High negativity detected! Consider addressing user concerns."
    elif neutral / total > 0.5:
        return "ℹ️ Most comments are neutral. Try engaging users more actively."
    return "✅ Balanced sentiment detected. Good engagement levels!"

@app.route("/analyze_csv", methods=["POST"])
def analyze_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    df = pd.read_csv(file, encoding="utf-8")
    df.columns = df.columns.str.strip()

    if "comment" not in df.columns:
        return jsonify({"error": "CSV must have a 'comment' column"}), 400

    df = df.dropna(subset=["comment"])
    df["sentiment"] = df["comment"].apply(lambda text: analyze_sentiment(text)["sentiment"])
    df["score"] = df["comment"].apply(lambda text: analyze_sentiment(text)["score"])
    df["is_spam"] = df["comment"].apply(detect_spam)

    total_comments = len(df)
    sentiment_counts = df["sentiment"].value_counts().to_dict()
    spam_count = len(df[df["is_spam"] == True])
    avg_score = round(df["score"].mean(), 2)
    keyword_counts = Counter(" ".join(df["comment"]).split()).most_common(10)
    
    feedback = generate_feedback(
        sentiment_counts.get("Highly Positive", 0), 
        sentiment_counts.get("Neutral", 0), 
        sentiment_counts.get("Highly Negative", 0), 
        total_comments
    )

    summary = {
        "total_comments": total_comments,
        "sentiment_counts": sentiment_counts,
        "spam_count": spam_count,
        "average_score": avg_score,
        "keyword_trends": keyword_counts,
        "feedback": feedback
    }

    return jsonify({"data": df.to_dict(orient="records"), "summary": summary})

if __name__ == "__main__":
    app.run(debug=True)
