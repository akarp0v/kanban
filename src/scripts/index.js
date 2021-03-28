import '../styles/style.scss';
import '../../node_modules/modern-normalize/modern-normalize.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

function renderColumns(columns) {
  columns.forEach(function (column) {
    let newColumn = document.createElement('div');
    newColumn.className = 'column';
    newColumn.innerHTML = `
    <div class="column__title">${column.name}</div>
    <div class="column__cards" data-column-id="${column.id}"></div>
  `;
    document.querySelector('.columns').appendChild(newColumn);
  });
}

function renderCards(columns, users, cards) {
  cards.forEach(function (card) {
    let columnOptionList = columns.map(column => {
      let selected = '';
      if (column.id == card.columnId) selected = ' selected';

      return `<option value="${column.id}"${selected}>${column.name}</option>`;
    });
    let columnOptionHtml = columnOptionList.join('');

    let userOptionList = users.map(user => {
      let selected = '';
      if (card.userId == user.id) selected = ' selected';

      return `<option value="${user.id}"${selected}>${user.login}</option>`;
    });
    let userOptionHtml = userOptionList.join('');

    let newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.innerHTML = `
    <div class="card__title" data-card-id="${card.id}">${card.text}</div>
    <div class="card__user">
      <select name="" id="" class="card__column-list">
        ${columnOptionHtml}
      </select>
      <select name="" id="" class="card__user-list">
        ${userOptionHtml}
      </select>
    </div>`;
    //   <div class="card__user">${GET_USERS_RESPONSE.find(user => user.id == card.userId).name}</div>
    // `;
    document.querySelector(`[data-column-id="${card.columnId}"]`).appendChild(newCard);
  });
}

function postDataToServer(data) {
  const url = 'http://localhost:3000/card/';
  const request = fetch(url, {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });

  request.then(res => {
    return res.json();
  }, res => {
    throw `Ошибка ${res.status}`;
  })
    .then(res => {
      // document.querySelectorAll(".column").forEach(function (column) {
      //   column.remove();
      // });
      console.log("postDataToServer");
      console.log(res);
    });
}

function getDataFromServer() {
  let headers = {
    "Content-type": "application/json",
    'pragma': 'no-cache',
    'cache-control': 'no-cache'
  };
  Promise.all([
    fetch('http://localhost:3000/card/', { headers }).then(response => response.json()),
    fetch('http://localhost:3000/column/', { headers }).then(response => response.json()),
    fetch('http://localhost:3000/user/', { headers }).then(response => response.json())
  ]).then(([card, column, user]) => {
    renderColumns(column.message);
    renderCards(column.message, user.message, card.message);
    console.log("getDataFromServer");
    console.log([column.message, user.message, card.message]);
  }).catch((err) => {
    console.log(err);
  });
}

getDataFromServer();

document.querySelector('.app').addEventListener('change', event => {
  let target = event.target;

  let currentCardId = target.parentElement.parentElement.firstElementChild.dataset.cardId;
  let currentCard = document.querySelector(`[data-card-id="${currentCardId}"]`);
  currentCard.columnId = target.value;
  // target.parentElement.parentElement.classList.add('card--changed');

  postDataToServer({
    id: +currentCardId,
    text: currentCard.textContent,
    columnId: +target.value,
    userId: +currentCard.parentElement.lastElementChild.lastElementChild.value
  });

  document.querySelector(`[data-column-id="${target.value}"]`).appendChild(currentCard.parentElement);
});
