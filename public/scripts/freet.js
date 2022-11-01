/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllFreets(fields) {
  fetch('/api/freets').then(showResponse).catch(showResponse);
}

function viewFreetsByAuthor(fields) {
  fetch(`/api/freets?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function createFreet(fields) {
  fetch('/api/freets', {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'},
  })
    .then(showResponse)
    .catch(showResponse);
}

function editFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'},
  })
    .then(showResponse)
    .catch(showResponse);
}

function deleteFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function likeFreet(fields) {
  fetch(`/api/freets/${fields.id}/like`, {
    method: 'PUT'
  })
    .then(showResponse)
    .catch(showResponse);
}

function unlikeFreet(fields) {
  fetch(`/api/freets/${fields.id}/unlike`, {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function viewFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {
    method: 'GET',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function shareFreet(fields) {
  fetch(`/api/freets/${fields.id}/share`, {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function unshareFreet(fields) {
  fetch(`/api/freets/${fields.id}/unshare`, {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function viewMyLiked(fields) {
  fetch('/api/freets/liked', {
    method: 'GET',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function viewMyShared(fields) {
  fetch('api/freets/shared', {
    method: 'GET',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  }).then(showResponse).catch(showResponse);
}

function viewMyPosted(fields) {
  fetch('/api/freets/posted', {
    method: 'GET',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  }).then(showResponse).catch(showResponse);
}
