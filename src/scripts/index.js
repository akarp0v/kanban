import '../styles/style.scss';
import '../../node_modules/modern-normalize/modern-normalize.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

let GET_CARDS_RESPONSE = [
  {
    id: 1,
    text: 'create menu',
    description: 'need create flex menu',
    userId: 2,
    columnId: 1
  },
  {
    id: 2,
    text: 'change background',
    description: 'please, change background to red',
    userId: 1,
    columnId: 65
  }
];

let GET_COLUMNS_RESPONSE = [
  {
    id: 1,
    name: 'todo',
    order: 1
  },
  {
    id: 17,
    name: 'dev',
    order: 2
  },
  {
    id: 23,
    name: 'qa',
    order: 3
  },
  {
    id: 65,
    name: 'done',
    order: 4
  },
];

let GET_USERS_RESPONSE = [
  {
    id: 1,
    login: 'Vicktor',
    email: 'wef@we.ru',
    photoUrl: 'https://24smi.org/public/media/235x307/celebrity/2017/02/16/5QBRax8G5tZY_dmitrii-medvedev.jpg'
  },
  {
    id: 2,
    login: 'Vova',
    email: 'wqweef@we.ru',
    photoUrl: 'https://histrf.ru/uploads/media/person/0001/59/thumb_58645_person_big.jpeg'
  },
];

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
    // body: JSON.stringify({ title: toSave })
  });

  request.then(res => {
    return res.json();
  }, res => {
    throw `Ошибка ${res.status}`;
  })
    .then(res => console.log(res));
}

function getDataFromServer() {
  Promise.all([
    fetch('http://localhost:3000/card/').then(response => response.json()),
    fetch('http://localhost:3000/column/').then(response => response.json()),
    fetch('http://localhost:3000/user/').then(response => response.json())
  ]).then(([card, column, user]) => {
    renderColumns(column.message);
    renderCards(column.message, user.message, card.message);
    console.log("postDataToServer");
    console.log([column.message, user.message, card.message]);
    // GET_CARDS_RESPONSE = card['message'];
    // GET_COLUMNS_RESPONSE = column['message'];
    // GET_USERS_RESPONSE = user['message'];
  }).catch((err) => {
    console.log(err);
  });
}

getDataFromServer();
// renderColumns(GET_COLUMNS_RESPONSE);
// renderCards(GET_CARDS_RESPONSE);

document.querySelector('.app').addEventListener('change', event => {
  let target = event.target;

  let currentCardId = target.parentElement.parentElement.firstElementChild.dataset.cardId;
  let currentCard = document.querySelector(`[data-card-id="${currentCardId}"]`);
  currentCard.columnId = target.value;

  postDataToServer({
    id: +currentCardId,
    text: currentCard.textContent,
    columnId: +target.value,
    userId: +currentCard.parentElement.lastElementChild.lastElementChild.value
  });

  document.querySelectorAll(".column").forEach(function (column) {
    column.remove();
  });

  getDataFromServer();

  // GET_CARDS_RESPONSE.forEach(function (card, i) {
  //   if (card.id == currentCardId) {
  //     GET_CARDS_RESPONSE[i].columnId = target.value;
  //   }
  // });

  // renderCards(GET_CARDS_RESPONSE);
  // console.log('change');
});
