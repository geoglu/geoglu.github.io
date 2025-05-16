const data = [
  { County: "Concho County, Texas", Negative: 0.56, Positive: 0.06, Neutral: 0.38, X: -99.8639, Y: 31.3267, Sentiment: "Negative" },
  { County: "Cooke County, Texas", Negative: 0.3, Positive: 0.1, Neutral: 0.6, X: -97.1933, Y: 33.6367, Sentiment: "Neutral" },
  { County: "Coryell County, Texas", Negative: 0.45, Positive: 0.25, Neutral: 0.3, X: -97.7954, Y: 31.4808, Sentiment: "Positive" }
];

const map = L.map('map').setView([31, -99], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

function populateTable(data) {
  const tableBody = document.getElementById('data-table-body');
  tableBody.innerHTML = '';
  data.forEach(d => {
    const row = `<tr data-county="${d.County}">
      <td>${d.County}</td>
      <td>${d.Negative}</td>
      <td>${d.Positive}</td>
      <td>${d.Neutral}</td>
    </tr>`;
    tableBody.insertAdjacentHTML('beforeend', row);
  });
}

function updateMapMarkers(data) {
  map.eachLayer(layer => {
    if (layer instanceof L.CircleMarker) {
      map.removeLayer(layer);
    }
  });

  data.forEach(d => {
    L.circleMarker([d.Y, d.X], {
      radius: 8,
      fillColor: d.Sentiment === "Positive" ? "green" : d.Sentiment === "Negative" ? "red" : "yellow",
      color: "white",
      weight: 1,
      fillOpacity: 0.8
    }).addTo(map).bindPopup(`${d.County}<br/>Negative: ${d.Negative}`);
  });
}

const sentimentCounts = data.reduce((counts, d) => {
  counts.Negative = (counts.Negative || 0) + d.Negative;
  counts.Positive = (counts.Positive || 0) + d.Positive;
  counts.Neutral = (counts.Neutral || 0) + d.Neutral;
  return counts;
}, {});

// **Pie Chart**
const pieCtx = document.getElementById('sentimentPieChart').getContext('2d');
new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: ['Negative', 'Positive', 'Neutral'],
    datasets: [{
      data: [sentimentCounts.Negative, sentimentCounts.Positive, sentimentCounts.Neutral],
      backgroundColor: ['#FF0000', '#00FF00', '#FFFF00']
    }]
  }
});

// **Bar Chart**
const barCtx = document.getElementById('negativeBarChart').getContext('2d');
new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: ["Low", "Medium", "High"],
    datasets: [{
      label: 'Negative Sentiment',
      data: [data.filter(d => d.Negative < 0.4).length, data.filter(d => d.Negative >= 0.4 && d.Negative < 0.7).length, data.filter(d => d.Negative >= 0.7).length],
      backgroundColor: '#FF0000'
    }]
  },
  options: {
    scales: { y: { beginAtZero: true } }
  }
});

updateMapMarkers(data);
populateTable(data);
