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

package com.sample.android.classytaxijava.data.network.firebase;

import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.google.gson.Gson;
import com.sample.android.classytaxijava.SubApp;
import com.sample.android.classytaxijava.data.SubscriptionStatusList;

import java.util.Map;

import androidx.annotation.Nullable;

public class SubscriptionMessageService extends FirebaseMessagingService {

    private static final String TAG = "SubscriptionMsgService";
    private static final String REMOTE_MESSAGE_SUBSCRIPTIONS_KEY = "currentStatus";
    private final Gson gson = new Gson();

    @Override
    public void onMessageReceived(@Nullable RemoteMessage remoteMessage) {
        if (remoteMessage == null) {
            Log.i(TAG, "Received null remote message");
            return;
        }

        Map<String, String> data = remoteMessage.getData();
        if (data.isEmpty()) {
            Log.i(TAG, "Remote message is empty");
            return;
        }

        if (!data.containsKey(REMOTE_MESSAGE_SUBSCRIPTIONS_KEY)) {
            Log.e(TAG, "Remote message does not contain key");
            return;
        }

        SubscriptionStatusList result = gson.fromJson(data.get(REMOTE_MESSAGE_SUBSCRIPTIONS_KEY), SubscriptionStatusList.class);
        if (result == null) {
            Log.e(TAG, "Received null subscription data");
        } else {
            ((SubApp) getApplication()).getRepository().updateSubscriptionsFromNetwork(result.getSubscriptions());
        }
    }
}
