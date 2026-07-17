window.closeAiModal = function() {

  document.getElementById('aiModal')
    .style.display = 'none';
};

window.analyzeTrade = async function(docId) {

  const trade =
    window.trades.find(t => t._docId === docId);

  if (!trade) return;

  const aiModal =
    document.getElementById('aiModal');

  const aiResult =
    document.getElementById('aiResult');

  aiModal.style.display = 'flex';

  aiResult.innerHTML =
    'Analyzing trade with AI...';

  try {

    const response = await fetch('/api/analyze', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(trade)
    });

    if (!response.ok) {

      const errData =
        await response.json();

      console.log(errData);

      throw new Error(
        errData.error || 'AI request failed'
      );
    }

    const data = await response.json();

    aiResult.textContent =
      data.analysis || data.error;

  } catch (error) {

    console.error(error);

    aiResult.innerHTML =
      error.message || 'AI analysis failed.';
  }
};