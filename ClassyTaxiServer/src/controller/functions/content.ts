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
import { SubscriptionStatus } from '../../model/SubscriptionStatus';
import { playBilling, contentManager, verifyFirebaseAuthIdToken, sendHttpsError } from '../shared'

const BASIC_PLAN_PRODUCT = functions.config().app.basic_plan_product;
const PREMIUM_PLAN_PRODUCT = functions.config().app.premium_plan_product;
const OTP_PRODUCT = functions.config().app.otp_plan_product;

/* This file contains implementation of functions related to content serving.
* Each functions checks if the active user have access to the subscribed content,
* and then returns the content to client app.
*/


/* HTTPS request that serves basic content to the client.
*
* @param {Request} request
* @param {Response} response
*/
export const content_basic = functions.https.onRequest(async (request, response) => {
  return verifyFirebaseAuthIdToken(request, response)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      await verifySubscriptionOwnershipAsync(uid, [BASIC_PLAN_PRODUCT, PREMIUM_PLAN_PRODUCT]);

      const data = contentManager.getBasicContent();
      response.send(data);
    }).catch((error: functions.https.HttpsError) => {
      sendHttpsError(error, response);
    });
});

/* HTTPS request that serves premium content to the client
*
* @param {Request} request
* @param {Response} response
*/
export const content_premium = functions.https.onRequest(async (request, response) => {
  return verifyFirebaseAuthIdToken(request, response)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      await verifySubscriptionOwnershipAsync(uid, [PREMIUM_PLAN_PRODUCT]);

      const data = contentManager.getPremiumContent();
      response.send(data);
    }).catch((error: functions.https.HttpsError) => {
      sendHttpsError(error, response)
    });
});

/* HTTPS request that serves OTP content to the client
*
* @param {Request} request
* @param {Response} response
*/
export const content_otp = functions.https.onRequest(async (request, response) => {
  return verifyFirebaseAuthIdToken(request, response)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      await verifyOtpOwnershipAsync(uid, [OTP_PRODUCT]);

      const data = contentManager.getOtpContent();
      response.send(data);
    }).catch((error: functions.https.HttpsError) => {
      sendHttpsError(error, response)
    });
});

/* Util function that verifies if current user owns at least one active purchases listed in products
*/
async function verifySubscriptionOwnershipAsync(uid: string, products: Array<string>): Promise<void> {
  const purchaseList = await playBilling.users().queryCurrentSubscriptions(uid)
    .catch(err => {
      console.error(err.message);
      throw new functions.https.HttpsError('internal', 'Internal server error');
    });

  const subscriptionStatusList = purchaseList.map(subscriptionPurchase => new SubscriptionStatus(subscriptionPurchase));

  const doesUserHaveTheProduct = subscriptionStatusList.some(subscription => ((Object.keys(subscription).length > 0) && (subscription.isEntitlementActive)));

  if (!doesUserHaveTheProduct) {
    throw new functions.https.HttpsError('permission-denied', 'Valid subscription not found');
  }
}

/* Util function that verifies if current user owns at least one active purchases listed in OTP products
*/
async function verifyOtpOwnershipAsync(uid: string, products: Array<string>): Promise<void> {
  const purchaseList = await playBilling.users().queryCurrentOneTimeProductPurchases(uid)
    .catch(err => {
      console.error(err.message);
      throw new functions.https.HttpsError('internal', 'Internal server error');
    });

  const isUserHavingTheProduct = purchaseList.some(purchase => ((products.indexOf(purchase.product) > -1) && (purchase.isEntitlementActive())));
  if (!isUserHavingTheProduct) {
    throw new functions.https.HttpsError('permission-denied', 'Valid one-time product purchase not found');
  }
}