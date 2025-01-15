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

import * as firebase from 'firebase-admin'
import * as functions from 'firebase-functions';
import { PlayBilling } from "../play-billing";

import * as serviceAccountPlay from '../service-account.json'
import { InstanceIdManager } from '../model/InstanceIdManager';
import { ContentManager } from '../model/ContentManager';
import { FunctionsErrorCode } from 'firebase-functions/v2/https';

/*
 * This file defines shared resources that are used in functions
 */

// Shared config
export const PACKAGE_NAME = functions.config().app.package_name;

// Shared Managers
export const playBilling = PlayBilling.fromServiceAccount(serviceAccountPlay, firebase.app());
export const instanceIdManager = new InstanceIdManager(firebase.app());
export const contentManager = new ContentManager();

/**
 * Return a Promise that verifies Firebase Auth ID Token before returning a DecodedIdToken.
 *
 * https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients
 * https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_the_firebase_admin_sdk
 *
 * @param idToken Firebase Auth ID Token.
 * @returns Promise that returns a DecodedIdToken or throws HttpsError.
 */
export function verifyFirebaseAuthIdToken(request: functions.Request, response: functions.Response): Promise<firebase.auth.DecodedIdToken> {
  // The ID token is included in a custom HTTP header.
  // The client must get the ID Token from the Firebase Auth SDK.
  // * https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients
  const idToken = request.get('X-FireIDToken');
  // Perform a simple check to see if the token was provided.
  if (!idToken || typeof idToken !== 'string') {
    // Note: This function guarantees that it will return a Promise.
    // Instead of throwing the error directly, we return a Promise that throws the HttpsError.
    return new Promise<firebase.auth.DecodedIdToken>((resolve, reject) => {
      throw new functions.https.HttpsError('unauthenticated', 'No valid header X-FireIDToken');
    });
  }
  return firebase
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      return decodedToken;
    }).catch((error) => {
      // Otherwise, the token was provided but invalid.
      throw new functions.https.HttpsError('permission-denied', 'Invalid ID Token: ' + idToken)
    });
}

/**
 * Verify if the user making the call has a valid FCM registration token/instance Id.
 * Function blocks on calls to Firebase.
 *
 * @param request Request object from the HTTP request.
 * @param response Response object for sending the HTTP response.
 *
 * @return Promise that returns a boolean or throws HttpsError.
 */
export function verifyInstanceIdToken(request: functions.Request, response: functions.Response): Promise<boolean> {
  // Instance ID/Registration token is included in a HTTP request's body.
  const instanceIdToken = request.body.instanceId;
  console.log('Instance id is ' + instanceIdToken);
  if (instanceIdToken && typeof instanceIdToken === 'string') {
    // Attempts to send a message with the token and dryRun option set to True.
    // Message will not be actually sent to the recipients.
    // Instead, the FCM service performs all the necessary validations,
    // and emulates the send operation.
    // This is a way to check if a certain message will be accepted
    // by FCM for delivery.
    // We use this to verify the Instance ID token.
    // https://firebase.google.com/docs/reference/admin/dotnet/class/firebase-admin/messaging/firebase-messaging
    return firebase
      .messaging()
      .send({ token: instanceIdToken }, true /* dryRun */)
      .then(result => {
        console.log('Instance Id specified and verified');
        return true;
      })
      .catch(error => {
        console.log('Instance Id specified but not verified');
        return false;
      });
  } else {
    console.log('No Instance Id specified');
    return new Promise<boolean>((resolve, reject) => {
      return false;
    });
  }
}

/**
 * Send HTTPS error response based on HttpsError.
 *
 * @param error HttpsError with the error code and message.
 * @param response Response object for sending the HTTP response.
 */
export function sendHttpsError(error: functions.https.HttpsError, response: functions.Response) {
  let code = 500;
  // See list of possible HttpsError code values.
  // https://firebase.google.com/docs/reference/functions/providers_https_#functionserrorcode
  if (error.code === 'invalid-argument') {
    code = 400;
  } else if (error.code === 'unauthenticated') {
    code = 401;
  } else if (error.code === 'permission-denied') {
    code = 403;
  } else if (error.code === 'already-exists') {
    code = 409;
  }
  const data = {
    status: code,
    error: error.code,
    message: error.message
  };
  response.status(code).send(data);
}

/**
 * Log HTTPS error to the console and throw it.
 *
 * @param error Caught error message.
 * @param code HTTPS FunctionsErrorCode code.
 * @param message HTTPS string error message.
 *
 * @throws HttpsError.
 */
export function logAndThrowHttpsError(code: FunctionsErrorCode, error: string) {
  console.error('Server error: ' + error);
  throw new functions.https.HttpsError(code, error);
}