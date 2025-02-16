const API_URL = "http://127.0.0.1:5000";
let sentimentChart, trendChart;

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const file = document.getElementById("csvFile").files[0];
  if (!file) return alert("Select a CSV file!");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/analyze_csv`, { method: "POST", body: formData });
  const result = await response.json();

  if (result.error) {
    alert(result.error);
    return;
  }

  displayResults(result.data);
  displaySummary(result.summary);
  updateCharts(result.summary.sentiment_counts);
});

function displayResults(data) {
  const table = document.getElementById("csvResults");
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.comment}</td><td>${row.sentiment}</td><td>${row.score.toFixed(2)}</td><td>${row.is_spam ? "🚨 Spam" : "✅ Legit"}</td>`;
    tbody.appendChild(tr);
  });
  table.classList.remove("hidden");
}

function displaySummary(summary) {
  document.getElementById("totalComments").innerText = summary.total_comments;
  document.getElementById("spamCount").innerText = summary.spam_count;
  document.getElementById("averageScore").innerText = summary.average_score;
  document.getElementById("feedback").innerText = summary.feedback;

  const keywordList = summary.keyword_trends.map(k => `<li>${k[0]} (${k[1]})</li>`).join("");
  document.getElementById("keywordTrends").innerHTML = keywordList;
}

function updateCharts(sentiments) {
  if (sentimentChart) sentimentChart.destroy();
  if (trendChart) trendChart.destroy();

  const ctx1 = document.getElementById("sentimentChart").getContext("2d");
  sentimentChart = new Chart(ctx1, {
    type: "pie",
    data: {
      labels: Object.keys(sentiments),
      datasets: [{
        data: Object.values(sentiments),
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#008CBA", "#FF5733"]
      }]
    }
  });

  const ctx2 = document.getElementById("trendChart").getContext("2d");
  trendChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: Array.from({ length: Object.values(sentiments).length }, (_, i) => `Comment ${i + 1}`),
      datasets: [{
        label: "Sentiment Score Over Time",
        data: Object.values(sentiments),
        borderColor: "#4285F4",
        borderWidth: 2,
        fill: false
      }]
    }
  });
}

function exportCSV() {
  const table = document.getElementById("csvResults");
  let csv = "Comment,Sentiment,Score,Spam\n";
  [...table.querySelectorAll("tbody tr")].forEach(row => {
    csv += [...row.children].map(td => td.innerText).join(",") + "\n";
  });
  downloadFile(csv, "sentiment_results.csv");
}

function exportJSON() {
  const data = document.getElementById("csvResults").querySelectorAll("tbody tr");
  const json = [...data].map(row => ({
    comment: row.children[0].innerText,
    sentiment: row.children[1].innerText,
    score: row.children[2].innerText,
    spam: row.children[3].innerText
  }));
  downloadFile(JSON.stringify(json, null, 2), "sentiment_results.json");
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

document.getElementById("exportCSV").addEventListener("click", exportCSV);
document.getElementById("exportJSON").addEventListener("click", exportJSON);
