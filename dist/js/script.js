var style = document.createElement('style');
  style.innerHTML = `
    input.error, textarea.error, select.error {
      box-shadow:0px 0px 0px 1px red inset;
    }
  `;
  document.head.appendChild(style);

const consultationForms = document.querySelectorAll('.consultation-block__form');
consultationForms.forEach(function(el) {
  el.addEventListener('submit', function(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);

    let error = validateForm(formData, form);
    if (error) return false;

    formData.append('action', 'consultation_form');
    let query = new URLSearchParams(formData).toString();
    let url = myajax.url + '?' + query;
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {

          var response = JSON.parse(this.responseText); 
          console.log(response);
          if (!response.error) {
            form.querySelector('.consultation-block__form--item:not(._hidden)').classList.add('_hidden');
            form.querySelector('.consultation-block__successful').closest('.consultation-block__form--item').classList.remove('_hidden');
            clearForm(formData, form);
          }
       }
    };
    xhttp.send();
  });
});


const contactForms = document.querySelectorAll('.contacts-intro__form');
contactForms.forEach(function(el) {
  el.addEventListener('submit', function(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);

    let error = validateForm(formData, form);
    if (error) return false;

    formData.append('action', 'contact_form');
    let query = new URLSearchParams(formData).toString();
    let url = myajax.url + '?' + query;
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {

          var response = JSON.parse(this.responseText); 
          if (!response.error) {
            // form.querySelector('.contacts-intro-block__form--item:not(._hidden)').classList.add('_hidden');
            // form.querySelector('.contacts-intro-block__successful').closest('.contact-block__form--item').classList.remove('_hidden');
            clearForm(formData, form);
          }
       }
    };
    xhttp.send();
  });
});


function validateForm(formData, form) {
  let error = 0;
  for (const field of formData.entries()) {
      let name = field[0];
      let value = field[1];
      let el = form.querySelector(`[name='${name}']`);
      el.classList.remove('error');
      if (!value && (el.hasAttribute('required') || el.hasAttribute('data-required'))) {
        el.classList.add('error');
        error = 1;
      }
      if (el.getAttribute('type') == 'tel' || name == 'tel') {
        let regexp = new RegExp("^[\+]?[0-9]+$", 'g');
        if (!regexp.test(value)) {
          el.classList.add('error');
          error = 1;
        }
      }
  }
  return error;
}

function clearForm(formData, form) {
  for (const field of formData.entries()) {
      let name = field[0];
      let el = form.querySelector(`[name='${name}']`);
      if (el) el.value = '';
  }
}