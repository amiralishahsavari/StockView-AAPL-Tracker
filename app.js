const accessKey = "cbf05f3c01a09a3a4ff45b4f3440b7f4";
const symbol = "AAPL";
const dateFrom = "2024-12-24";
const dateTo = "2025-05-20";
const limit = 30;

const url = `https://api.marketstack.com/v1/eod?access_key=${accessKey}&symbols=${symbol}&sort=DESC&date_from=${dateFrom}&date_to=${dateTo}&limit=${limit}`;

fetch(url)
  .then(res => res.json())
  .then(json => {
    const data = json.data.reverse();
    const labels = data.map(item => item.date.split("T")[0]);

    // قیمت بسته شدن – price.html
    if (document.getElementById("priceChart")) {
      const closePrices = data.map(item => item.close);
      const ctx = document.getElementById("priceChart").getContext("2d");

      const isPricePage = window.location.pathname.includes("chart1.html");

      new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "قیمت بسته شدن (USD)",
            data: closePrices,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: !isPricePage ? true : false, // فقط در price.html false باشه
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: "روند قیمت سهام AAPL در ماه اخیر",
              align: "center"
            }
          }
        }
      });
    }

    // حجم معاملات – volume.html
    if (document.getElementById("volumeChart")) {
  const volumes = data.map(item => item.volume);
  const ctx = document.getElementById("volumeChart").getContext("2d");

  // بررسی آدرس صفحه
  const isVolumePage = window.location.pathname.includes("chart2.html");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "حجم معاملات",
        data: volumes,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgb(153, 102, 255)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: !isVolumePage ? true : false, // فقط تو volume.html false باشه
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "حجم معاملات روزانه سهام AAPL",
          align: "center"
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

    // جدول داده‌ها – table.html
    if (document.getElementById("stockTable")) {
      const tbody = document.querySelector("#stockTable tbody");

  data.slice().reverse().forEach(item => {
    const row = document.createElement("tr");
    const formattedDate = item.date.split("T")[0];


        row.innerHTML = `
          <td>${formattedDate}</td>
          <td>${item.open?.toFixed(2)}</td>
          <td>${item.high?.toFixed(2)}</td>
          <td>${item.low?.toFixed(2)}</td>
          <td>${item.close?.toFixed(2)}</td>
          <td>${item.volume?.toLocaleString()}</td>
        `;

        tbody.appendChild(row);
      });
    }
  })
  .catch(err => {
    console.error("خطا در دریافت داده‌ها:", err);
    alert("خطا در دریافت داده‌ها. لطفاً بعداً تلاش کنید.");
  });
