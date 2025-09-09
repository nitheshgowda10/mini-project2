// script.js - basic validation

// find elements
const form = document.getElementById('signupForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const successMessage = document.getElementById('successMessage');

// helper: show error message for an input
function showError(input, message) {
  const control = input.parentElement;           // .form-control
  control.classList.remove('success');
  control.classList.add('error');
  const small = control.querySelector('small');
  small.innerText = message;
}

// helper: show success (no error) for an input
function showSuccess(input, message = '') {
  const control = input.parentElement;
  control.classList.remove('error');
  control.classList.add('success');
  const small = control.querySelector('small');
  small.innerText = message; // optionally show a gentle message or blank
}

// check required fields - returns true if all filled
function checkRequired(inputs) {
  let allFilled = true;
  inputs.forEach(input => {
    if (input.value.trim() === '') {
      showError(input, `${getFieldName(input)} is required`);
      allFilled = false;
    } else {
      showSuccess(input);
    }
  });
  return allFilled;
}

// validate email using a simple regex - returns true if valid
function isValidEmail(input) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple and safe for demo
  if (re.test(input.value.trim())) {
    showSuccess(input);
    return true;
  } else {
    showError(input, 'Please enter a valid email');
    return false;
  }
}

// check password length - returns true if length >= min
function checkLength(input, min) {
  if (input.value.length < min) {
    showError(input, `${getFieldName(input)} must be at least ${min} characters`);
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// get nice field name from input id
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// handle submit
form.addEventListener('submit', function(e) {
  e.preventDefault(); // stop the form from submitting

  // 1) required
  const requiredOK = checkRequired([username, email, password]);

  // 2) email format
  const emailOK = isValidEmail(email);

  // 3) password length
  const passOK = checkLength(password, 6);

  // if everything ok -> show success
  if (requiredOK && emailOK && passOK) {
    successMessage.style.display = 'block';
    successMessage.innerText = '✅ Form submitted successfully!'; // display success
    // optionally clear form after success
    form.reset();

    // remove success styling after reset (for a clean form)
    [username, email, password].forEach(inp => {
      inp.parentElement.classList.remove('success');
    });

    // hide success after 3s
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);
  } else {
    successMessage.style.display = 'none';
  }
});

// ========== Real-time (live) validation ==========
// check email while the user types
email.addEventListener('input', () => {
  // if empty, clear message (so we don't show invalid while typing),
  // or validate if more than 3 characters typed
  if (email.value.trim() === '') {
    email.parentElement.classList.remove('error','success');
    email.parentElement.querySelector('small').innerText = '';
    return;
  }
  isValidEmail(email);
});

// check password length while typing
password.addEventListener('input', () => {
  if (password.value.length === 0) {
    password.parentElement.classList.remove('error','success');
    password.parentElement.querySelector('small').innerText = '';
    return;
  }
  checkLength(password, 6);
});

// optional: username check on blur (when leaving the field)
username.addEventListener('blur', () => {
  if (username.value.trim() !== '') {
    showSuccess(username);
  }
});
