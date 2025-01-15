/*
 * Copyright 2020 Google LLC. All rights reserved.
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

package com.sample.android.classytaxijava;

import com.google.firebase.messaging.FirebaseMessagingService;

import androidx.annotation.NonNull;

/**
 * Gets a FCM registration token and sends it to Server for validation and registration.
 */
public class FcmRegistrationTokenService extends FirebaseMessagingService {
    /**
     * Called if registration token is updated. This may occur if the security of
     * the previous token had been compromised. Note that this is called when the token
     * is initially generated so this is where you would retrieve the token.
     */
    @Override
    public void onNewToken(@NonNull String token) {

        // If you want to send messages to this application instance or
        // manage this apps subscriptions on the server side, send the
        // FCM registration token to your app server.
        // Persists it to the server.
        ((SubApp) getApplication()).getRepository().registerInstanceId(token);

    }
}
