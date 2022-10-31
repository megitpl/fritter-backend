/* eslint-disable @typescript-eslint/restrict-template-expressions */
/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function createUser(fields) {
  fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(fields),
    headers:{'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function changeUsername(fields) {
  fetch('/api/users', {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function changePassword(fields) {
  fetch('/api/users', {
    method: 'PUT',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function deleteUser(fields) {
  fetch('/api/users', {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function signIn(fields) {
  fetch('/api/users/session', {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function signOut() {
  fetch('/api/users/session', {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowers(fields) {
  fetch('/api/users/followers', {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowed(fields) {
  fetch('/api/users/followed', {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
  fetch(`/api/users/${fields.id}/follow`, {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse);
}

function followUser(fields) {
  fetch(`/api/users/${fields.id}/follow`,
    {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse);
}

function viewMyTimeline(fields) {
  fetch('/api/users/timeline',
    {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function viewMyFeed(fields) {
  fetch('/api/users/feed',
    {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function showMyProfile(fields) {
  fetch('/api/users/profile',
    {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function showUser(fields) {
  fetch(`/api/users/${fields.id}/profile`,
    {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}
