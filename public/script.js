// Obtener los elementos del DOM y agregar eventos
const navbarToggler = document.querySelector('.navbar-toggler');
navbarToggler.addEventListener('click', () => {
  document.querySelector('.navbar-collapse').classList.toggle('show');
});

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', () => {
  toggleForms(loginForm, document.getElementById('registerForm'));
});

const registerForm = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerBtn');
registerBtn.addEventListener('click', () => {
  toggleForms(registerForm, loginForm);
});

// Eventos para los botones de cerrar
document.querySelectorAll('.btn-close').forEach((closeBtn) => {
  closeBtn.addEventListener('click', hideAllForms);
});

function toggleForms(formToShow, formToHide) {
  formToShow.classList.remove('d-none');
  formToHide.classList.add('d-none');
  document.body.classList.add('modal-open'); 
}

function hideAllForms() {
  loginForm.classList.add('d-none');
  registerForm.classList.add('d-none');
  document.body.classList.remove('modal-open'); 
}