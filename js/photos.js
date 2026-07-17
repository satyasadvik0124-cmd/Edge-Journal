window.tradePhotos = [];

window.handlePhotoSelect = function(event) {

  const files = event.target.files;

  if (!files || files.length === 0) return;

  Array.from(files).forEach(file => {

    const reader = new FileReader();

    reader.onload = function(e) {

      window.tradePhotos.push(e.target.result);

      renderPhotoPreview();
    };

    reader.readAsDataURL(file);
  });
};

function renderPhotoPreview() {

  const preview =
    document.getElementById('photoPreview');

  if (!preview) return;

  preview.innerHTML = '';

  window.tradePhotos.forEach((photo, index) => {

    preview.innerHTML += `

      <div class="photo-item">

        <img
          src="${photo}"
          onclick="openPhotoViewer('${photo}')"
        >

        <button
          class="delete-photo-btn"
          onclick="removeTradePhoto(${index})"
        >
          ×
        </button>

      </div>
    `;
  });
}

window.removeTradePhoto = function(index) {

  window.tradePhotos.splice(index, 1);

  renderPhotoPreview();
};

window.openPhotoViewer = function(src) {

  const viewer =
    document.getElementById('photoViewer');

  const viewerImg =
    document.getElementById('photoViewerImg');

  viewer.style.display = 'flex';

  viewerImg.src = src;
};

window.closePhotoViewer = function() {

  document.getElementById('photoViewer')
    .style.display = 'none';
};