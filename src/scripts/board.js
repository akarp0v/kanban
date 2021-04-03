import { EventObserver } from './event-observer';

export class Board {

  constructor(columns, users) {
    this.columns = columns;
    this.users = users;
  }

  renderColumns() {
    this.columns.forEach(function (column) {
      let newColumn = document.createElement('div');
      newColumn.className = 'column';
      newColumn.innerHTML = `
        <div class="column__title">${column.name}</div>
        <div class="column__cards" data-column-id="${column.id}"></div>
      `;
      document.querySelector('.columns').appendChild(newColumn);
    });
  }

  renderCards(cards) {
    cards.forEach(card => {
      let columnOptionList = this.columns.map(column => {
        let selected = '';
        if (column.id == card.columnId) selected = ' selected';

        return `<option value="${column.id}"${selected}>${column.name}</option>`;
      });
      let columnOptionHtml = columnOptionList.join('');

      let userOptionList = this.users.map(user => {
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

  subscribeOnChangeColumnCard() {
    const subject = new EventObserver();
      document.querySelector('.app').addEventListener('change', (e) => {
        const cardToUpdate = this.onBeforeChangeColumnCard(e);
        subject.broadcast({ cardToUpdate, e });
      });

    return subject;
  }

  onBeforeChangeColumnCard(event) {
    let target = event.target;
    if (!target.classList.contains('card__column-list')) {
      return;
    }
    let currentCardId = target.parentElement.parentElement.firstElementChild.dataset.cardId;
    let currentCard = document.querySelector(`[data-card-id="${currentCardId}"]`);
    currentCard.columnId = target.value;
    return {
      id: +currentCardId,
      text: currentCard.textContent,
      columnId: +target.value,
      userId: +currentCard.parentElement.lastElementChild.lastElementChild.value
    };
  }

  onAfterChangeColumnCard(event, cardId) {
    const card = document.querySelector(`[data-card-id="${cardId}"]`).parentElement;
    document.querySelector(`[data-column-id="${event.target.value}"]`).appendChild(card);
  }

}
