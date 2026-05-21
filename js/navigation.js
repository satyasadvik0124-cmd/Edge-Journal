window.showView = function(viewId) {

  document.querySelectorAll('.view')
    .forEach(view => {

      view.classList.remove('active-view');
    });

  document.getElementById(viewId)
    .classList.add('active-view');
};

window.showAuthTab = function(tab) {

  document.querySelectorAll('.auth-tab')
    .forEach(btn => {

      btn.classList.remove('active-auth-tab');
    });

  if (tab === 'login') {

    document.getElementById('loginTab')
      .classList.add('active-auth-tab');

    document.getElementById('loginBox')
      .style.display = 'block';

    document.getElementById('registerBox')
      .style.display = 'none';

  } else {

    document.getElementById('registerTab')
      .classList.add('active-auth-tab');

    document.getElementById('loginBox')
      .style.display = 'none';

    document.getElementById('registerBox')
      .style.display = 'block';
  }
};