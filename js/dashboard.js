function destroyChart(chartName) {

  if (
    window.charts &&
    window.charts[chartName]
  ) {

    window.charts[chartName].destroy();
  }
}

function tradeRowShort(trade) {

  return `

    <tr onclick="openTrade('${trade._docId}')">

      <td>${trade.pair}</td>

      <td>${trade.direction}</td>

      <td>${trade.rr}</td>

      <td class="${
        trade.pnl >= 0
          ? 'profit-text'
          : 'loss-text'
      }">
        ${trade.pnl}
      </td>

      <td>${trade.session || '-'}</td>

    </tr>
  `;
}

window.renderDashboard = function() {

  const trades = window.trades || [];

  const totalTrades = trades.length;

  const wins =
    trades.filter(t => t.pnl > 0).length;

  const losses =
    trades.filter(t => t.pnl <= 0).length;

  const totalPnl =
    trades.reduce(
      (sum, t) => sum + (t.pnl || 0),
      0
    );

  const winRate =
    totalTrades > 0
      ? ((wins / totalTrades) * 100)
          .toFixed(1)
      : 0;

  document.getElementById('totalTrades')
    .textContent = totalTrades;

  document.getElementById('winRate')
    .textContent = `${winRate}%`;

  document.getElementById('totalPnl')
    .textContent = totalPnl.toFixed(2);

  document.getElementById('wins')
    .textContent = wins;

  document.getElementById('losses')
    .textContent = losses;

  // RECENT TRADES

  const recentTrades =
    trades.slice(0, 5);

  const recentTable =
    document.getElementById('recentTrades');

  if (recentTable) {

    recentTable.innerHTML =
      recentTrades
        .map(tradeRowShort)
        .join('');
  }

  // CHARTS

  renderPnlChart();

  renderDirectionChart();

  renderSessionChart();
};

function renderPnlChart() {

  const ctx =
    document.getElementById('pnlChart');

  if (!ctx) return;

  destroyChart('pnlChart');

  const pnlData =
    window.trades.map(t => t.pnl || 0);

  window.charts.pnlChart =
    new Chart(ctx, {

      type: 'line',

      data: {

        labels:
          pnlData.map((_, i) => `#${i + 1}`),

        datasets: [
          {
            label: 'PNL',
            data: pnlData,
            tension: 0.3
          }
        ]
      }
    });
}

function renderDirectionChart() {

  const ctx =
    document.getElementById('directionChart');

  if (!ctx) return;

  destroyChart('directionChart');

  const buys =
    window.trades.filter(
      t => t.direction === 'Buy'
    ).length;

  const sells =
    window.trades.filter(
      t => t.direction === 'Sell'
    ).length;

  window.charts.directionChart =
    new Chart(ctx, {

      type: 'doughnut',

      data: {

        labels: ['Buy', 'Sell'],

        datasets: [
          {
            data: [buys, sells]
          }
        ]
      }
    });
}

function renderSessionChart() {

  const ctx =
    document.getElementById('sessionChart');

  if (!ctx) return;

  destroyChart('sessionChart');

  const asian =
    window.trades.filter(
      t => t.session === 'Asian'
    ).length;

  const london =
    window.trades.filter(
      t => t.session === 'London'
    ).length;

  const ny =
    window.trades.filter(
      t => t.session === 'New York'
    ).length;

  window.charts.sessionChart =
    new Chart(ctx, {

      type: 'bar',

      data: {

        labels: [
          'Asian',
          'London',
          'New York'
        ],

        datasets: [
          {
            label: 'Trades',
            data: [asian, london, ny]
          }
        ]
      }
    });
}