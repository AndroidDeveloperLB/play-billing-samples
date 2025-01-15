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

import * as functions from 'firebase-functions';
import { verifyFirebaseAuthIdToken, verifyInstanceIdToken, instanceIdManager, sendHttpsError } from '../shared'

/* This file contains implementation of functions related to instanceId,
 * which are used to send push notifications to client devices.
 */


/* Register a device instanceId to an user. This is called when the user sign-in in a device
 */
export const instanceId_register = functions.https.onRequest(async (request, response) => {
  return verifyFirebaseAuthIdToken(request, response)
    .then(async (decodedToken) => {
      if (await verifyInstanceIdToken(request, response)) {
        console.log("Instance verification passed");
        const uid = decodedToken.uid;
        const instanceId = request.body.instanceId;

        await instanceIdManager.registerInstanceId(uid, instanceId);
        const res = {message: 'Instance Id registration successful.'};
        response.status(200).send(res);
      } else {
        const error = new functions.https.HttpsError('invalid-argument', 'Must provide valid Instance ID');
        sendHttpsError(error, response);
      }
    });
});

/* Unregister a device instanceId to an user. This is called when the user sign-out in a device
 */
export const instanceId_unregister = functions.https.onRequest(async (request, response) => {
  return verifyFirebaseAuthIdToken(request, response)
    .then(async (decodedToken) => {
      if (await verifyInstanceIdToken(request, response)) {
        console.log("Instance verification passed");
        const uid = decodedToken.uid;
        const instanceId = request.body.instanceId;

        await instanceIdManager.unregisterInstanceId(uid, instanceId);
        const res = {message: 'Instance Id un-registration successful.'}
        response.status(200).send(res);
      } else {
        const error = new functions.https.HttpsError('invalid-argument', 'Must provide valid Instance ID');
        sendHttpsError(error, response);
      }
    });
});

