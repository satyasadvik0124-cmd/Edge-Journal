window.calcRR = function() {

  const entry =
    parseFloat(document.getElementById('entry').value);

  const sl =
    parseFloat(document.getElementById('sl').value);

  const tp =
    parseFloat(document.getElementById('tp').value);

  if (!entry || !sl || !tp) return;

  const risk = Math.abs(entry - sl);

  const reward = Math.abs(tp - entry);

  if (risk === 0) return;

  const rr = (reward / risk).toFixed(2);

  document.getElementById('rr').value = rr;
};

function detectSession(date) {

  const hour = new Date(date).getHours();

  if (hour >= 0 && hour < 8) {
    return 'Asian';
  }

  if (hour >= 8 && hour < 16) {
    return 'London';
  }

  return 'New York';
}

window.calcSessionDuration = function() {

  const entryTime =
    document.getElementById('entryTime').value;

  const exitTime =
    document.getElementById('exitTime').value;

  if (!entryTime || !exitTime) return;

  const start = new Date(entryTime);

  const end = new Date(exitTime);

  const diffMs = end - start;

  const mins = Math.floor(diffMs / 60000);

  document.getElementById('duration').value =
    mins + ' mins';

  document.getElementById('session').value =
    detectSession(entryTime);
};

function setBtnLoading(btn, state) {

  if (state) {

    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';

  } else {

    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  }
}

window.setBtnLoading = setBtnLoading;