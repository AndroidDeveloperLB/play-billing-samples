/**
 * Copyright 2018 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());

const contentUi = document.querySelectorAll('.content-ui');
const loginUi = document.querySelector('.login-ui');

const hideElement = element => {
  element.classList.add('hidden');
}

const showElement = element => {
  element.classList.remove('hidden');
}

// Show login screen for user who hasn't logged in
const showLoginUI = () => {
  // Hide Content UI and show Login UI
  contentUi.forEach(hideElement);
  showElement(loginUi);
  
  // Configure FirebaseUI Auth
  const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
  };

  // Show FirebaseUI login UI to user.
  ui.start('#firebaseui-auth-container', uiConfig);
}

// Show content screen for user who has logged in
const showContentUI = () => {
  // Show loading UI for both basic and premium content
  const spinnerBasic = document.querySelector('#spinner-basic-content');
  const spinnerPremium = document.querySelector('#spinner-premium-content');
  showElement(spinnerBasic);
  showElement(spinnerPremium);

  // Hide content of both basic and premium content,
  // as we need response from backend to show them
  const basicContent = document.querySelector('#basic-content');
  const premiumContent = document.querySelector('#premium-content');
  const requirementBasic = document.querySelector('#subscribe-requirement');
  const requirementPremium = document.querySelector('#subscribe-premium-requirement');
  [basicContent, premiumContent, requirementBasic, requirementPremium].forEach(hideElement);

  // Hide Login UI and show Content UI
  contentUi.forEach(showElement);
  hideElement(loginUi);

  const loadContent = async options => {
    try {
      const result = await firebase.functions().httpsCallable(options.contentType)();
      // Now we have our basic content, show it to user
      options.content.querySelector('img').setAttribute('src', result.data.url);
      showElement(options.content);
    } catch(err) {
      // It seems that we don't have access to content.
      // Let user know that they need to subscribe
      showElement(options.error);
      if (err.code !== 'permission-denied') {
        console.error('Undexpected error occurred', err);
      }
    } finally {
      // Hide loading UI elements as we have finished loading
      hideElement(options.spinner);
    }
  }

  // Attempt to load basic content
  loadContent({
    contentType: 'content_basic',
    content: basicContent,
    error: requirementBasic,
    spinner: spinnerBasic
  });

  // Attempt to load premium content
  loadContent({
    contentType: 'content_premium',
    content: premiumContent,
    error: requirementPremium,
    spinner: spinnerPremium
  });
}

// Sign the user out
const signOut = () => {
  firebase.auth().signOut();
}

// Listen to authentication state changes and update UI accordingly
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    showContentUI();
  } else {
    showLoginUI();
  }
});
