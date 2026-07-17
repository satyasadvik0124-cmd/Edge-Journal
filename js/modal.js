window.openTrade = function(docId) {

  const trade =
    window.trades.find(t => t._docId === docId);

  if (!trade) return;

  const modal =
    document.getElementById('tradeModal');

  const content =
    document.getElementById('tradeModalContent');

  content.innerHTML = `

    <div class="trade-modal-header">

      <h2>${trade.pair}</h2>

      <button
        class="close-btn"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <div class="trade-modal-body">

      <div class="trade-grid">

        <div>
          <strong>Direction:</strong>
          ${trade.direction}
        </div>

        <div>
          <strong>Entry:</strong>
          ${trade.entry}
        </div>

        <div>
          <strong>Exit:</strong>
          ${trade.exit}
        </div>

        <div>
          <strong>SL:</strong>
          ${trade.sl}
        </div>

        <div>
          <strong>TP:</strong>
          ${trade.tp}
        </div>

        <div>
          <strong>RR:</strong>
          ${trade.rr}
        </div>

        <div>
          <strong>PNL:</strong>
          ${trade.pnl}
        </div>

        <div>
          <strong>Session:</strong>
          ${trade.session}
        </div>

        <div>
          <strong>Duration:</strong>
          ${trade.duration}
        </div>

        <div>
          <strong>Emotion:</strong>
          ${trade.emotion}
        </div>

      </div>

      <div class="trade-reason">

        <h3>Entry Reason</h3>

        <p>${trade.reason || '-'}</p>

      </div>

      <div class="trade-lessons">

        <h3>Lessons Learned</h3>

        <p>${trade.lessons || '-'}</p>

      </div>

      <div class="trade-actions">

        <button
          class="edit-btn"
          onclick="editTrade('${trade._docId}')"
        >
          Edit
        </button>

        <button
          class="delete-btn"
          onclick="deleteTrade('${trade._docId}')"
        >
          Delete
        </button>

        <button
          class="ai-btn"
          onclick="analyzeTrade('${trade._docId}')"
        >
          Analyze Trade with AI
        </button>

      </div>

    </div>
  `;

  modal.style.display = 'flex';
};

window.closeModal = function() {

  document.getElementById('tradeModal')
    .style.display = 'none';
};

window.editTrade = function(docId) {

  const trade =
    window.trades.find(t => t._docId === docId);

  if (!trade) return;

  window.editingTradeId = docId;

  document.getElementById('pair').value =
    trade.pair || '';

  document.getElementById('direction').value =
    trade.direction || '';

  document.getElementById('entry').value =
    trade.entry || '';

  document.getElementById('exit').value =
    trade.exit || '';

  document.getElementById('sl').value =
    trade.sl || '';

  document.getElementById('tp').value =
    trade.tp || '';

  document.getElementById('rr').value =
    trade.rr || '';

  document.getElementById('pnl').value =
    trade.pnl || '';

  document.getElementById('emotion').value =
    trade.emotion || '';

  document.getElementById('reason').value =
    trade.reason || '';

  document.getElementById('lessons').value =
    trade.lessons || '';

  document.getElementById('session').value =
    trade.session || '';

  document.getElementById('duration').value =
    trade.duration || '';

  closeModal();

  showView('logTradeView');

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};