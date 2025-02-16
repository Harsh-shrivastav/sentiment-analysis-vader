# 📊 Sentiment Analysis Tool (VADER-Based)

## 🚀 Overview
This **Sentiment Analysis Tool** processes user comments and classifies them as **Positive, Neutral, or Negative** using **VADER (Valence Aware Dictionary and sEntiment Reasoner)**. It supports **single comment analysis** and **bulk analysis via CSV upload**, providing **visual insights** through interactive charts.

---

## 🎯 Features
✅ **Single Comment Analysis** – Enter a text comment and get an instant sentiment score.  
✅ **Bulk CSV Upload Analysis** – Upload a file with multiple comments for sentiment processing.  
✅ **Sentiment Classification** – Categorizes comments as **Positive, Neutral, or Negative**.  
✅ **Spam Detection** – Highlights repetitive or spammy comments.  
✅ **Keyword Trends** – Identifies most frequently used words in comments.  
✅ **Interactive Charts** – Displays **Pie Chart** (sentiment distribution) & **Line Chart** (trend over time).  
✅ **Downloadable Reports** – Export analyzed data as **CSV or JSON**.  
✅ **Mobile-Friendly UI** – Responsive and clean dashboard layout.  

---

## 🛠 Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Flask (Python)
- **Sentiment Analysis:** VADER NLP Model
- **Data Visualization:** Chart.js
- **File Handling:** CSV Processing

---

## 🔧 Setup Instructions
### **1️⃣ Install Dependencies**
Make sure you have Python installed. Then, run:
```bash
pip install flask flask-cors vaderSentiment pandas
```

### **2️⃣ Run the Backend (Flask Server)**
```bash
python app.py
```
✅ The API will be available at **`http://127.0.0.1:5000/`**

### **3️⃣ Open the Frontend**
Simply open `index.html` in a browser.

---

## 🔄 API Endpoints
### **1️⃣ Analyze Single Comment**
**Endpoint:** `POST /analyze`  
**Request Body:**
```json
{ "text": "I love this product!" }
```
**Response:**
```json
{ "text": "I love this product!", "sentiment": "Positive", "score": 0.85 }
```

### **2️⃣ Analyze CSV File**
**Endpoint:** `POST /analyze_csv`  
**Request:** Upload a CSV file with a `comment` column.
**Response:** JSON containing sentiment results for all comments.



## 🚀 Future Enhancements
✅ **Real-time Sentiment Tracking** – Monitor live comments dynamically.  
✅ **Multi-Language Support** – Expand to analyze text in multiple languages.  
✅ **Deep Learning Integration** – Improve accuracy with an advanced NLP model.  



---

## 📜 License
This project is licensed under the **MIT License**.

