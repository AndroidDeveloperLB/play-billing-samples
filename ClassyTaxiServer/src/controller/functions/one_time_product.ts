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
 import { ProductType, PurchaseUpdateError, DeveloperNotification, NotificationType } from "../../play-billing";
 import { playBilling, PACKAGE_NAME, instanceIdManager, sendHttpsError, verifyFirebaseAuthIdToken, logAndThrowHttpsError } from '../shared'
 import { OneTimeProductPurchaseStatus } from '../../model/OneTimeProductPurchaseStatus';

 /* This file contains implementation of functions related to linking subscription purchase with user account
  */

 /* HTTPS request that registers a subscription purchased
   * in Android app via Google Play Billing to an user.
   *
   * It only works with brand-new subscription purchases,
   * which have not been registered to other users before.
   *
   * @param {Request} request
   * @param {Response} response
   */
  export const otp_register = functions.https.onRequest(async (request, response) => {
    return verifyFirebaseAuthIdToken(request, response)
      .then(async (decodedToken) => {
        const product = request.body.product;
        const uid = decodedToken.uid;
        const token = request.body.purchaseToken;

        if (!token || !uid || !product) {
          throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters!');
        }

        try {
          await playBilling.purchases().registerToUserAccount(
            PACKAGE_NAME,
            product,
            token,
            ProductType.ONE_TIME,
            uid
          );
        } catch (err) {
          switch (err.name) {
            case PurchaseUpdateError.CONFLICT: {
              logAndThrowHttpsError('already-exists', err.message);
            }
            case PurchaseUpdateError.INVALID_TOKEN: {
              logAndThrowHttpsError('not-found', err.message);
            }
            default: {
              logAndThrowHttpsError('internal', err.message);
            }
          }
        };

        const data = await getOneTimePurchasesResponseObject(uid);
        response.send(data);
      }).catch((error: functions.https.HttpsError) => {
        sendHttpsError(error, response);
      });
  });

  /* HTTPS request that returns a list of active OTPs
    *
    * @param {Request} request
    * @param {Response} response
    */
   export const otp_status = functions.https.onRequest(async (request, response) => {
     return verifyFirebaseAuthIdToken(request, response)
       .then(async decodedToken => {
         const uid = decodedToken.uid;
         const responseData = await getOneTimePurchasesResponseObject(uid)
         response.send(responseData);
       }).catch((error: functions.https.HttpsError) => {
         sendHttpsError(error, response);
       });
   });

  /**
    * HTTPS request that acknowledges an OTP purchased in Android app via
    * Google Play Billing to an user.
    *
    * @param {Request} request
    * @param {Response} response
    */
   export const otp_acknowledge = functions.https.onRequest(async (request, response) => {
     console.log('otp_acknowledge called server side');
     return verifyFirebaseAuthIdToken(request, response)
     .then(async (decodedToken) => {
       const product = request.body.product;
       const uid = decodedToken.uid;
       const token = request.body.purchaseToken;

       if (!token || !uid) {
         throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters!');
       }
       try {
         await playBilling.purchases().acknowledgeOtpPurchase(
           PACKAGE_NAME,
           product,
           token
         );
       } catch (err) {
         console.log('There was an error', err.message);
       }

       const data = await getOneTimePurchasesResponseObject(uid);
       console.log('data back from Firestore: ', data);
       response.send(data);
     })
   })

   /**
       * HTTPS request that consume an OTP purchase in Android app via
       * Google Play Billing to an user.
       *
       * @param {Request} request
       * @param {Response} response
       */

   export const otp_consume = functions.https.onRequest(async (request, response) => {
       console.log('consume_purchase called server side');
       return verifyFirebaseAuthIdToken(request, response)
       .then(async (decodedToken) => {
         const product = request.body.product;
         const uid = decodedToken.uid;
         const token = request.body.purchaseToken;
         console.log('product: ', product);
         console.log('uid: ', uid);
         console.log('token: ', token);
         if (!token || !uid) {
           throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters!');
         }
         try {
           await playBilling.purchases().consumePurchase(
             PACKAGE_NAME,
             product,
             token
           );
         } catch (err) {
           console.log('There was an error', err.message);
         }
         const data = await getOneTimePurchasesResponseObject(uid);
         console.log('data back from Firestore: ', data);
         response.send(data);
       })
   })

   // Util method to get a list of one-time products belong to an user, in the format that can be returned to client app
   // It also handles library internal error and convert it to an HTTP error to return to client.
   async function getOneTimePurchasesResponseObject(userId: string): Promise<Object> {
     try {
       // Fetch purchase list from purchase records
       const purchaseList = await playBilling.users().queryCurrentOneTimeProductPurchases(userId);
       // Convert Purchase objects to OneTimeProductPurchaseStatus objects
       const oneTimeProductPurchaseStatusList = purchaseList.map(oneTimeProductPurchase => new OneTimeProductPurchaseStatus(oneTimeProductPurchase));
       // Return them in a format that is expected by client app
       return { oneTimeProductPurchases: oneTimeProductPurchaseStatusList }
     } catch (err) {
       console.error(err.message);
       throw new functions.https.HttpsError('internal', 'Internal server error');
     }
   }