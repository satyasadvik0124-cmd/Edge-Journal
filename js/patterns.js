window.renderPatterns = function() {

  const trades =
    window.trades || [];

  const patternsContainer =
    document.getElementById('patternsContainer');

  if (!patternsContainer) return;

  if (trades.length === 0) {

    patternsContainer.innerHTML = `

      <div class="empty-patterns">
        No trade patterns available
      </div>
    `;

    return;
  }

  // WIN RATE

  const wins =
    trades.filter(t => t.pnl > 0);

  const losses =
    trades.filter(t => t.pnl <= 0);

  const winRate =
    ((wins.length / trades.length) * 100)
      .toFixed(1);

  // SESSION ANALYSIS

  const asianWins =
    trades.filter(
      t =>
        t.session === 'Asian' &&
        t.pnl > 0
    ).length;

  const londonWins =
    trades.filter(
      t =>
        t.session === 'London' &&
        t.pnl > 0
    ).length;

  const newYorkWins =
    trades.filter(
      t =>
        t.session === 'New York' &&
        t.pnl > 0
    ).length;

  // EMOTIONS

  const emotions = {};

  trades.forEach(trade => {

    const emotion =
      trade.emotion || 'Unknown';

    if (!emotions[emotion]) {

      emotions[emotion] = 0;
    }

    emotions[emotion]++;
  });

  const topEmotion =
    Object.entries(emotions)
      .sort((a, b) => b[1] - a[1])[0];

  // BEST PAIR

  const pairs = {};

  trades.forEach(trade => {

    if (!pairs[trade.pair]) {

      pairs[trade.pair] = {
        pnl: 0
      };
    }

    pairs[trade.pair].pnl +=
      trade.pnl || 0;
  });

  const bestPair =
    Object.entries(pairs)
      .sort((a, b) =>
        b[1].pnl - a[1].pnl
      )[0];

  patternsContainer.innerHTML = `

    <div class="pattern-card">

      <h3>Overall Performance</h3>

      <p>
        Win Rate:
        <strong>${winRate}%</strong>
      </p>

      <p>
        Total Wins:
        <strong>${wins.length}</strong>
      </p>

      <p>
        Total Losses:
        <strong>${losses.length}</strong>
      </p>

    </div>

    <div class="pattern-card">

      <h3>Best Trading Session</h3>

      <p>Asian Wins: ${asianWins}</p>

      <p>London Wins: ${londonWins}</p>

      <p>New York Wins: ${newYorkWins}</p>

    </div>

    <div class="pattern-card">

      <h3>Most Common Emotion</h3>

      <p>
        ${
          topEmotion
            ? topEmotion[0]
            : 'No data'
        }
      </p>

    </div>

    <div class="pattern-card">

      <h3>Best Performing Pair</h3>

      <p>
        ${
          bestPair
            ? bestPair[0]
            : 'No data'
        }
      </p>

    </div>
  `;
};