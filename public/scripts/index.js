/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'show-my-profile': showMyProfile,
  'show-user': showUser,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'view-freet': viewFreet,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'like-freet': likeFreet,
  'share-freet': shareFreet,
  'unshare-freet': unshareFreet,
  'unlike-freet': unlikeFreet,
  'follow-user': followUser,
  'unfollow-user': unfollowUser,
  'view-timeline': viewTimeline,
  'view-feed': viewFeed
};

// Attach handlers to forms
function init() {
  console.log("object forms and handlers: ", Object.entries(formsAndHandlers));
  console.log("for each:  ", Object.entries(formsAndHandlers));
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    console.log("formId", formID);
    console.log("handler", handler);
  });

  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    console.log("form here:", formID, handler, document.getElementById(formID));
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
