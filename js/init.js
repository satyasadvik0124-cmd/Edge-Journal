window.addEventListener('DOMContentLoaded', () => {

  // DEFAULT DATETIME

  const now = new Date();

  const localDateTime =
    new Date(
      now.getTime() -
      now.getTimezoneOffset() * 60000
    )
    .toISOString()
    .slice(0, 16);

  const entryTime =
    document.getElementById('entryTime');

  const exitTime =
    document.getElementById('exitTime');

  if (entryTime) {
    entryTime.value = localDateTime;
  }

  if (exitTime) {
    exitTime.value = localDateTime;
  }

  // RR EVENTS

  const rrInputs = [
    'entry',
    'sl',
    'tp'
  ];

  rrInputs.forEach(id => {

    const el =
      document.getElementById(id);

    if (el) {

      el.addEventListener(
        'input',
        window.calcRR
      );
    }
  });

  // DURATION EVENTS

  const durationInputs = [
    'entryTime',
    'exitTime'
  ];

  durationInputs.forEach(id => {

    const el =
      document.getElementById(id);

    if (el) {

      el.addEventListener(
        'change',
        window.calcSessionDuration
      );
    }
  });

  // PHOTO INPUT

  const photoInput =
    document.getElementById('tradePhotos');

  if (photoInput) {

    photoInput.addEventListener(
      'change',
      window.handlePhotoSelect
    );
  }
});