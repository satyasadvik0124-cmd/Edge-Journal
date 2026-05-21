window.renderHistory = function() {

  const trades =
    window.trades || [];

  const historyTable =
    document.getElementById('historyTable');

  if (!historyTable) return;

  if (trades.length === 0) {

    historyTable.innerHTML = `

      <tr>
        <td colspan="8">
          No trades found
        </td>
      </tr>
    `;

    return;
  }

  historyTable.innerHTML =
    trades.map(trade => {

      return `

        <tr onclick="openTrade('${trade._docId}')">

          <td>${trade.pair}</td>

          <td>${trade.direction}</td>

          <td>${trade.entry}</td>

          <td>${trade.exit}</td>

          <td>${trade.rr}</td>

          <td class="${
            trade.pnl >= 0
              ? 'profit-text'
              : 'loss-text'
          }">
            ${trade.pnl}
          </td>

          <td>${trade.session || '-'}</td>

          <td>${trade.duration || '-'}</td>

        </tr>
      `;
    }).join('');
};