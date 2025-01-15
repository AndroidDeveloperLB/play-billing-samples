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

import * as firebase from 'firebase-admin';
firebase.initializeApp();

import { content_basic, content_premium, content_otp } from './controller/functions/content'
import { subscription_register, subscription_status, subscription_transfer, acknowledge_purchase,realtime_notification_listener } from './controller/functions/subscription'
import { otp_register, otp_status, otp_acknowledge, otp_consume } from './controller/functions/one_time_product'
import { instanceId_register, instanceId_unregister } from './controller/functions/instance_id'

/*
 * This file is the main entrance for Cloud Functions for Firebase.
 * It exposes functions that will be deployed to the backend
 */

// This is a trick to improve performance when there are many functions,
// by only exporting the function that is needed by the particular instance.
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'content_basic') {
  exports.content_basic = content_basic;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'content_premium') {
  exports.content_premium = content_premium;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'content_otp') {
  exports.content_otp = content_otp;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'subscription_register') {
  exports.subscription_register = subscription_register;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'subscription_transfer') {
  exports.subscription_transfer = subscription_transfer;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'subscription_status') {
  exports.subscription_status = subscription_status;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'realtime_notification_listener') {
  exports.realtime_notification_listener = realtime_notification_listener;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'instanceId_register') {
  exports.instanceId_register = instanceId_register;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'instanceId_unregister') {
  exports.instanceId_unregister = instanceId_unregister;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'acknowledge_purchase') {
  exports.acknowledge_purchase = acknowledge_purchase;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'otp_register') {
  exports.otp_register = otp_register;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'otp_status') {
  exports.otp_status = otp_status;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'otp_acknowledge') {
  exports.otp_acknowledge = otp_acknowledge;
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'otp_consume') {
  exports.otp_consume = otp_consume;
}