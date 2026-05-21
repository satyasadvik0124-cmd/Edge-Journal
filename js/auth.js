const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} = window.firebaseFns;

onAuthStateChanged(window.auth, async (user) => {

  if (user) {

    window.currentUser = user;

    document.getElementById('authPage')
      .style.display = 'none';

    document.getElementById('appPage')
      .style.display = 'block';

    if (typeof loadTrades === 'function') {
      await loadTrades();
    }

  } else {

    window.currentUser = null;

    document.getElementById('authPage')
      .style.display = 'flex';

    document.getElementById('appPage')
      .style.display = 'none';
  }
});

window.registerUser = async function() {

  const email =
    document.getElementById('registerEmail').value;

  const password =
    document.getElementById('registerPassword').value;

  try {

    await createUserWithEmailAndPassword(
      window.auth,
      email,
      password
    );

    alert('Registration successful');

  } catch (error) {

    console.error(error);

    alert(error.message);
  }
};

window.loginUser = async function() {

  const email =
    document.getElementById('loginEmail').value;

  const password =
    document.getElementById('loginPassword').value;

  try {

    await signInWithEmailAndPassword(
      window.auth,
      email,
      password
    );

  } catch (error) {

    console.error(error);

    alert(error.message);
  }
};

window.logoutUser = async function() {

  try {

    await signOut(window.auth);

  } catch (error) {

    console.error(error);

    alert(error.message);
  }
};