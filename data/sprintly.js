import fetch from 'node-fetch'

const auth = {
  email: 'chris@fixt.co',
  apiKey: '6yXVFhjeDMsDYJYqsRY5FYTaj6SZnsxJ',
}

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': 'Basic ' + new Buffer(auth.email + ':' + auth.apiKey).toString('base64')
}

function parseJSON(response) {
  return response.text().then(body => JSON.parse(body));
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    error.status = response.status;
    throw error;
  }
}

function log(response) {
  console.log(response)
  return response;
}

function sprintlyRequest(route) {
  return fetch(`https://sprint.ly/api/products/37169/${route}`, { method: 'GET', headers })
    .then(checkStatus)
    .then(parseJSON)
}

export class Card {
  constructor(item) {
    this.id = item.number
    this.title = item.title
    this.description = item.description
    this.status = item.status
  }
}


export function getSprintlyCard(id) {
  return new Card()
}

export function getSprintlyCards() {
  return sprintlyRequest('items.json')
    .then(items => items.map(item => new Card(item)))
}
