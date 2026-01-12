
document.addEventListener("DOMContentLoaded", () => {
  if (typeof Chart === "undefined") return;

  const canvas = document.getElementById("monthlyRevenueChart");
  if (canvas) {
    const rows = JSON.parse(canvas.dataset.rows || "[]");
    const byMonth = {};
    rows.forEach(r => {
      byMonth[r.ym] = (byMonth[r.ym] || 0) + r.revenue;
    });
    const labels = Object.keys(byMonth).sort();
    const data = labels.map(l => byMonth[l]);

    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Revenue",
          data
        }]
      }
    });
  }
});
