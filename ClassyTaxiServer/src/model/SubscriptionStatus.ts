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

 import * as PlayBilling from "../play-billing";

 /* SubscriptionStatus is part of Model layer.
  * It's an entity represents a subcription purchase from client app's perspective
  * It wraps the more general purpose SubscriptionPurchase class of Play Billing reusable component
  */
 export class SubscriptionStatus {
   product: string;
   purchaseToken: string;
   isEntitlementActive: boolean;
   willRenew: boolean;
   activeUntilMillisec: number;
   isGracePeriod: boolean;
   isAccountHold: boolean;
   isPaused: boolean;
   isAcknowledged: boolean;
   autoResumeTimeMillis: number;

   constructor(subcriptionPurchase: PlayBilling.SubscriptionPurchaseV2) {
     this.product = subcriptionPurchase.product;
     this.purchaseToken = subcriptionPurchase.purchaseToken;
     this.isEntitlementActive = subcriptionPurchase.isEntitlementActive();
     this.willRenew = subcriptionPurchase.willRenew();
     this.activeUntilMillisec = subcriptionPurchase.activeUntilDate();
     this.isGracePeriod = subcriptionPurchase.isGracePeriod();
     this.isAccountHold = subcriptionPurchase.isAccountHold();
     this.isPaused = subcriptionPurchase.isPaused();
     this.isAcknowledged = subcriptionPurchase.isAcknowledged();
     this.autoResumeTimeMillis = subcriptionPurchase.autoResumeTime();
   }
 }