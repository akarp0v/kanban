export class HttpClient {

  changeCardColumn(data) {
    const url = 'http://localhost:3000/card/';
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return request.then(res => {
      return res.json();
    }, res => {
      throw `Ошибка ${res.status}`;
    });
  }

  getData() {
    const headers = {
      'Content-type': 'application/json',
      'pragma': 'no-cache',
      'cache-control': 'no-cache'
    };
    return Promise.all([
      fetch('http://localhost:3000/card/', { headers }).then(response => response.json()),
      fetch('http://localhost:3000/column/', { headers }).then(response => response.json()),
      fetch('http://localhost:3000/user/', { headers }).then(response => response.json())
    ]).then(([cards, columns, users]) => {
      return {
        cards: cards.message,
        columns: columns.message,
        users: users.message
      };
    }).catch((err) => {
      console.log(err);
    });
  }
}