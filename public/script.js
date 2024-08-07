// Obtener los elementos del DOM y agregar eventos
document.addEventListener('DOMContentLoaded', () => {
  const navbarToggler = document.querySelector('.navbar-toggler');
  navbarToggler.addEventListener('click', () => {
    document.querySelector('.navbar-collapse').classList.toggle('show');
  });

  const loginBtn = document.getElementById('loginBtn');
  loginBtn.addEventListener('click', () => {
    toggleForm('loginForm');
  });

  const registerBtn = document.getElementById('registerBtn');
  registerBtn.addEventListener('click', () => {
    toggleForm('registerForm');
  });

  // Eventos para los botones de cerrar
  document.querySelectorAll('.btn-close').forEach((closeBtn) => {
    closeBtn.addEventListener('click', function() {
      hideForm(this.closest('form').id);
    });
  });
});

// Función para alternar entre mostrar y ocultar formularios
function toggleForm(formId) {
  const formToShow = document.getElementById(formId);
  const otherFormId = formId === 'loginForm' ? 'registerForm' : 'loginForm';
  const formToHide = document.getElementById(otherFormId);

  formToShow.classList.remove('d-none');
  formToHide.classList.add('d-none');
  document.body.classList.add('modal-open');
}

// Función para ocultar un formulario específico
function hideForm(formId) {
  document.getElementById(formId).classList.add('d-none');
  document.body.classList.remove('modal-open');
}

function handleForm(formId, url) {
  document.getElementById(formId).addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              alert('Error: ' + data.error);
          } else {
              alert(data.message);
              if (data.redirect) {
                  window.location.href = data.redirect;
              }
          }
      })
      .catch(error => {
          console.log('Error:', error);
          alert('Hubo un error al procesar su solicitud. Por favor, inténtelo de nuevo.');
      });
  });
}

handleForm('loginForm', '/login');
handleForm('registerForm', '/register');

