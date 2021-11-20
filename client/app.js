let studentsData;
let id;
let pos;
const baseUrl = 'http://127.0.0.1:8000/';
const accountUrl = baseUrl + 'user/';
const studentUrl = baseUrl + 'api/student/';

// const authentication = 'Basic YmFycnk6MQ==';
// let authentication = 'Token c355264a0f91eafebf9f41d02362b7dd2e43466d';
let authentication;

const displayStudents = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: studentUrl,
      // xsrfHeaderName: 'X-CSRFToken',
      // xsrfCookieName: 'XSRF-TOKEN',
      // withCredentials: true,
      headers: { Authorization: authentication },
    });

    console.log(response.status);
    console.log(response);

    studentsData = response.data;

    studentContainer = document.querySelector('#studentContainer');
    html = `<table id="table" style="width:50%" class="table table-success table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Firstname</th>
          <th scope="col">Lastname</th>
          <th scope="col">Number</th>  
          <th scope="col">Update</th> 
        </tr>
      </thead>
      <tbody>
      `;

    response.data.forEach((element) => {
      html += `      
        <tr>
          <th scope="row">${element.id}</th>
          <td>${element.first_name}</td>
          <td>${element.last_name}</td>
          <td>${element.number}</td>
          <td><input type="radio" name="radioGroup"></td>
        </tr>`;
    });

    html += ' </tbody></table>';
    studentContainer.innerHTML = html;

    const table = document.getElementById('table');
    table.addEventListener('click', (event) => {
      if (event.target.type === 'radio') {
        id = event.target.parentNode.parentNode.childNodes[1].textContent;

        for (let i = 0; i < studentsData.length; i++)
          if (studentsData[i].id == id) {
            pos = i;
            break;
          }
        document.getElementById('name').value = studentsData[pos].first_name;
        document.getElementById('lastname').value = studentsData[pos].last_name;
        document.getElementById('number').value = studentsData[pos].number;
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

const resetForm = function () {
  document.getElementById('name').value = '';
  document.getElementById('lastname').value = '';
  document.getElementById('number').value = '';
};

const displayMessages = function (message, type) {
  const messageElement = document.querySelector('#message');
  let msg = message;
  if (type === 'danger') {
    const errors = Object.entries(message).reduce(
      (acc, element) => acc + element[0] + ' ' + element[1][0] + ' <br />',
      ''
    );
    msg = errors;
  }
  messageElement.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(function () {
    messageElement.style.display = 'none';
  }, 5000);
};

document.getElementById('form').addEventListener('submit', function (event) {
  event.preventDefault();
});

const addUpdateDelete = async function (event) {
  let method;
  let data = {};
  let url = studentUrl;
  switch (event.target.outerText) {
    case 'Add':
      method = 'post';
      break;
    case 'Update':
      method = 'put';
      url += id + '/';
      break;
    case 'Delete':
      method = 'delete';
      url += id + '/';
      break;
  }

  if (['Update', 'Add'].includes(event.target.outerText)) {
    data = new FormData();

    data.append('first_name', document.getElementById('name').value);
    data.append('last_name', document.getElementById('lastname').value);
    data.append('number', document.getElementById('number').value);
  }

  console.log(method, id, url);
  try {
    const response = await axios({
      method: method,
      url: url,
      headers: { Authorization: authentication },
      data: data,
    });
    console.log(response.status);
    displayMessages(response.data.message, 'success');
    displayStudents();
  } catch (err) {
    console.log(err.message);
    displayMessages(err.response.data.message, 'danger');
  }
};

document.getElementById('updateBtn').addEventListener('click', addUpdateDelete);
document.getElementById('deleteBtn').addEventListener('click', addUpdateDelete);
document.getElementById('addBtn').addEventListener('click', addUpdateDelete);

const displayUser = function (user) {
  document.getElementById('userinfo').innerHTML = `
  <div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
  <div class="card-header">Current User</div>
  <div class="card-body">
    <h5 class="card-title">${user}</h5>
    
  </div>
</div>`;
};

document
  .getElementById('registerForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();
  });

const loginRergister = async function (url) {
  let data = new FormData();

  data.append('username', document.getElementById('username').value);
  data.append('password', document.getElementById('password').value);

  try {
    const response = await axios({
      method: 'post',
      url: url,
      data: data,
    });
    console.log(response.status);
    console.log(response.data.token);
    authentication = 'Token ' + response.data.token;
    displayStudents();
    displayUser(data.get('username'));
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  } catch (err) {
    console.log(err.message);
    displayMessages(err.response.data.message, 'danger');
  }
};

const loginRegisterClick = function (event) {
  let url = accountUrl;

  switch (event.target.outerText) {
    case 'Login':
      url += 'login/';
      break;
    case 'Register':
      url += 'register/';
      break;
  }
  loginRergister(url);
};

document
  .getElementById('loginBtn')
  .addEventListener('click', loginRegisterClick);
document
  .getElementById('registerBtn')
  .addEventListener('click', loginRegisterClick);

displayStudents();
