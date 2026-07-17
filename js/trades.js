const {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
  updateDoc
} = window.firebaseFns;

async function loadTrades() {

  if (!window.currentUser) return;

  const tradesRef =
    collection(window.db, 'trades');

  const q = query(
    tradesRef,
    where('uid', '==', window.currentUser.uid),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);

  window.trades = [];

  querySnapshot.forEach(docSnap => {

    window.trades.push({
      _docId: docSnap.id,
      ...docSnap.data()
    });
  });

  if (typeof renderDashboard === 'function') {
    renderDashboard();
  }

  if (typeof renderHistory === 'function') {
    renderHistory();
  }

  if (typeof renderPatterns === 'function') {
    renderPatterns();
  }
}

window.loadTrades = loadTrades;

window.logTrade = async function() {

  if (!window.currentUser) return;

  const trade = {

    uid: window.currentUser.uid,

    pair:
      document.getElementById('pair').value,

    direction:
      document.getElementById('direction').value,

    entry:
      parseFloat(
        document.getElementById('entry').value
      ),

    exit:
      parseFloat(
        document.getElementById('exit').value
      ),

    sl:
      parseFloat(
        document.getElementById('sl').value
      ),

    tp:
      parseFloat(
        document.getElementById('tp').value
      ),

    rr:
      document.getElementById('rr').value,

    pnl:
      parseFloat(
        document.getElementById('pnl').value
      ),

    emotion:
      document.getElementById('emotion').value,

    reason:
      document.getElementById('reason').value,

    lessons:
      document.getElementById('lessons').value,

    duration:
      document.getElementById('duration').value,

    session:
      document.getElementById('session').value,

    photos: window.tradePhotos || [],

    createdAt: Date.now()
  };

  try {

    const saveBtn =
      document.getElementById('saveTradeBtn');

    if (window.setBtnLoading) {
      window.setBtnLoading(saveBtn, true);
    }

    if (window.editingTradeId) {

      await updateDoc(
        doc(
          window.db,
          'trades',
          window.editingTradeId
        ),
        trade
      );

      window.editingTradeId = null;

    } else {

      await addDoc(
        collection(window.db, 'trades'),
        trade
      );
    }

    alert('Trade saved successfully');

    document.getElementById('tradeForm').reset();

    window.tradePhotos = [];

    const preview =
      document.getElementById('photoPreview');

    if (preview) {
      preview.innerHTML = '';
    }

    await loadTrades();

    if (window.setBtnLoading) {
      window.setBtnLoading(saveBtn, false);
    }

  } catch (error) {

    console.error(error);

    alert(error.message);
  }
};

window.deleteTrade = async function(docId) {

  const confirmDelete =
    confirm('Delete this trade?');

  if (!confirmDelete) return;

  try {

    await deleteDoc(
      doc(window.db, 'trades', docId)
    );

    closeModal();

    await loadTrades();

  } catch (error) {

    console.error(error);

    alert(error.message);
  }
};