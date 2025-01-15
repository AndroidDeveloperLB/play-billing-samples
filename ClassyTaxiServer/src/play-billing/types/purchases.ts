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

 import { NotificationType } from "./notifications";

 // This file defines types that are exposed externally to the library consumers.

 /* An abstract representation of a purchase made via Google Play Billing
  * It includes both one-time purchase and recurring subscription purchase.
  * The intention is to expose the raw response from Google Play Developer API,
  * while adding some fields to support user-purchase management.
  */
 export interface Purchase {
   // Library-managed properties that represents a purchase made via Google Play Billing
   packageName: string;
   purchaseToken: string;
   product: string;
   userId?: string; // userId of the user who made this purchase
   verifiedAt: number; // epoch timestamp of when the server last queried Play Developer API for this purchase
   isRegisterable(): boolean; // determine if a purchase can be registered to an user
 }
 /*
  * Representing a one-time purchase made via Google Play Billing
  */
 export interface OneTimeProductPurchase extends Purchase {
   // Raw response from server
   // https://developers.google.com/android-publisher/api-ref/purchases/products
   purchaseTimeMillis: number;
   purchaseState: number;
   consumptionState: number;
   orderId: string;
   purchaseType?: number;
   quantity: number;
   acknowledgementState: number;

   // These methods below are convenient utilities that developers can use to interpret Play Developer API response
   isAcknowledged(): boolean;
   isConsumed(): boolean;
   isEntitlementActive(): boolean;
 }

 /*
  * Representing a recurring subscription purchase made via Google Play Billing
  * It exposes the raw response received from Google Play Developer API,
  * and adds some util methods that interprets the API response to a more human-friendly format.
  */
 export interface SubscriptionPurchase extends Purchase {
   // Raw response from server
   // https://developers.google.com/android-publisher/api-ref/purchases/subscriptions/get
   startTimeMillis: number;
   expiryTimeMillis: number;
   autoResumeTimeMillis: number;
   autoRenewing: boolean;
   priceCurrencyCode: string;
   priceAmountMicros: number;
   countryCode: string
   paymentState: number
   cancelReason: number
   userCancellationTimeMillis: number
   orderId: string;
   linkedPurchaseToken: string;
   purchaseType?: number;
   acknowledgementState: number;

   // Library-managed Purchase properties
   replacedByAnotherPurchase: boolean;
   isMutable: boolean; // indicate if the subscription purchase details can be changed in the future (i.e. expiry date changed because of auto-renewal)
   latestNotificationType?: NotificationType; // store the latest notification type received via Realtime Developer Notification

   isRegisterable(): boolean;

   // These methods below are convenient utilities that developers can use to interpret Play Developer API response
   isEntitlementActive(): boolean;
   willRenew(): boolean;
   isTestPurchase(): boolean;
   isFreeTrial(): boolean;
   isGracePeriod(): boolean;
   isAccountHold(): boolean;
   isPaused(): boolean;
   isAcknowledged(): boolean;
   activeUntilDate(): Date;
 }

 // Item-level info for a subscription purchase.
 export type SubscriptionPurchaseLineItem = {
   productId: string;
   expiryTime: number;
   autoRenewingPlan: AutoRenewingPlan;
   prepaidPlan: PrepaidPlan;
 }

 // Information related to an auto renewing plan.
 export type AutoRenewingPlan = {
   autoRenewEnabled: boolean;
 }

 // Information related to a prepaid plan.
 export type PrepaidPlan = {
   allowExtendAfterTime: string;
 }

  // The possible acknowledgement states for a subscription.
 export enum SubscriptionState {
   SUBSCRIPTION_STATE_UNSPECIFIED = "SUBSCRIPTION_STATE_UNSPECIFIED",
   SUBSCRIPTION_STATE_PENDING = "SUBSCRIPTION_STATE_PENDING",
   SUBSCRIPTION_STATE_ACTIVE = "SUBSCRIPTION_STATE_ACTIVE",
   SUBSCRIPTION_STATE_PAUSED = "SUBSCRIPTION_STATE_PAUSED",
   SUBSCRIPTION_STATE_IN_GRACE_PERIOD = "SUBSCRIPTION_STATE_IN_GRACE_PERIOD",
   SUBSCRIPTION_STATE_ON_HOLD = "SUBSCRIPTION_STATE_ON_HOLD",
   SUBSCRIPTION_STATE_CANCELED = "SUBSCRIPTION_STATE_CANCELED",
   SUBSCRIPTION_STATE_EXPIRED = "SUBSCRIPTION_STATE_EXPIRED"
 }

 // Information specific to a subscription in paused state.
 export type PausedStateContext = {
   autoResumeTime: string;
 }

 // Additional context around canceled subscriptions. Only present if the
 // subscription currently has subscription_state SUBSCRIPTION_STATE_CANCELED.
 export type CanceledStateContext = {
   userInitiatedCancellation: UserInitiatedCancellation;
   systemInitiatedCancellation: any;
   developerInitiatedCancellation: any;
   replacementCancellation: any;
 }

 // Information specific to cancellations initiated by users.
 export type UserInitiatedCancellation = {
   cancelSurveyResult: CancelSurveyResult;
   cancelTime: number;
 }

 // Result of the cancel survey when the subscription was canceled by the user.
 export type CancelSurveyResult = {
   reason: CancelSurveyReason;
   reasonUserInput: string;
 }

 // The reason the user selected in the cancel survey.
 export enum CancelSurveyReason {
   CANCEL_SURVEY_REASON_UNSPECIFIED = "CANCEL_SURVEY_REASON_UNSPECIFIED",
   CANCEL_SURVEY_REASON_NOT_ENOUGH_USAGE = "CANCEL_SURVEY_REASON_NOT_ENOUGH_USAGE",
   CANCEL_SURVEY_REASON_TECHNICAL_ISSUES = "CANCEL_SURVEY_REASON_TECHNICAL_ISSUES",
   CANCEL_SURVEY_REASON_COST_RELATED = "CANCEL_SURVEY_REASON_COST_RELATED",
   CANCEL_SURVEY_REASON_FOUND_BETTER_APP = "CANCEL_SURVEY_REASON_FOUND_BETTER_APP",
   CANCEL_SURVEY_REASON_OTHERS = "CANCEL_SURVEY_REASON_OTHERS"
 }

 // The possible acknowledgement states for a subscription.
 export enum AcknowledgementState {
   ACKNOWLEDGEMENT_STATE_UNSPECIFIED = "ACKNOWLEDGEMENT_STATE_UNSPECIFIED",
   ACKNOWLEDGEMENT_STATE_PENDING = "ACKNOWLEDGEMENT_STATE_PENDING",
   ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED= "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED"
 }

 // User account identifier in third-party service.
 export type ExternalAccountIdentifiers = {
   externalAccountId: string;
   obfuscatedExternalAccountId: string;
   obfuscatedExternalProfileId: string;
 }

 // Information associated with purchases made with [Subscribe with Google]{@link
 // https://developers.google.com/news/subscribe}.
 export type SubscribeWithGoogleInfo = {
   profileId: string;
   profileName: string;
   emailAddress: string;
   givenName: string;
   familyName: string;
 }
 /*
  * Respresenting a recurring subscription purchase made via Google Play Billing
  * It exposes the raw response received from Google Play Developer API,
  * and adds some util methods that interpretes the API response to a more human-friendly format.
  *
  * @todo Replace the subscriptionsV2 "get" method link with the public link when
  * the API is released.
  */
 export interface SubscriptionPurchaseV2 extends Purchase {
   // Raw response from server
   // https://developers.devsite.corp.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2/get
   kind: string;
   regionCode: string;
   lineItems: Array<SubscriptionPurchaseLineItem>;
   startTime: number;
   subscriptionState: SubscriptionState;
   linkedPurchaseToken: string;
   pausedStateContext: PausedStateContext;
   canceledStateContext: CanceledStateContext;
   testPurchase: any;
   acknowledgementState: AcknowledgementState;
   externalAccountIdentifiers: ExternalAccountIdentifiers;
   subscribeWithGoogleInfo: SubscribeWithGoogleInfo;
   etag: string;

   // Library-managed Purchase properties
   replacedByAnotherPurchase: boolean;
   isMutable: boolean; // indicate if the subscription purchase details can be changed in the future (i.e. expiry date changed because of auto-renewal)
   latestNotificationType?: NotificationType; // store the latest notification type received via Realtime Developer Notification

   isRegisterable(): boolean;

   // These methods below are convenient utilities that developers can use to interpret Play Developer API response
   isEntitlementActive(): boolean;
   willRenew(): boolean;
   isTestPurchase(): boolean;
   isGracePeriod(): boolean;
   isAccountHold(): boolean;
   isPaused(): boolean;
   activeUntilDate(): number;
   isAcknowledged(): boolean;
   autoResumeTime(): number;
 }

 // Representing type of a purchase / product.
 // https://developer.android.com/reference/com/android/billingclient/api/BillingClient.SkuType.html
 export enum ProductType {
   ONE_TIME = 'inapp',
   SUBS = 'subs'
 }