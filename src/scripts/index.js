import '../../node_modules/modern-normalize/modern-normalize.css';
import '../styles/style.scss';
import { Board } from './board';
import { HttpClient } from './http-client';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

(function () {

  const httpClient = new HttpClient();

  httpClient.getData().then(res => {
    const board = new Board(res.columns, res.users);
    board.renderColumns();
    board.renderCards(res.cards);

    const subject = board.subscribeOnChangeColumnCard();
    subject.subscribe((data) => {
      httpClient.changeCardColumn(data.cardToUpdate).then(() => {
        board.onAfterChangeColumnCard(data.e, data.cardToUpdate.id);
      });
    });

  });

})();