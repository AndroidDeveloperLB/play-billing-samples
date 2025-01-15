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

package com.sample.android.classytaxijava.ui;

import android.app.Application;
import android.util.Log;

import com.google.firebase.iid.FirebaseInstanceId;
import com.sample.android.classytaxijava.SubApp;
import com.sample.android.classytaxijava.data.ContentResource;
import com.sample.android.classytaxijava.data.DataRepository;
import com.sample.android.classytaxijava.data.SubscriptionStatus;

import java.util.List;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

public class SubscriptionStatusViewModel extends AndroidViewModel {

    private static final String TAG = "SubViewModel";

    /**
     * Data repository.
     */
    private DataRepository repository;

    /**
     * True when there are pending network requests
     */
    public LiveData<Boolean> loading;

    /**
     * Subscriptions LiveData
     */
    public LiveData<List<SubscriptionStatus>> subscriptions;

    public LiveData<ContentResource> basicContent;

    public LiveData<ContentResource> premiumContent;

    /**
     * Keep track of the last Instance ID to be registered, so that it
     * can be unregistered when the user signs out.
     */
    private String instanceIdToken = null;

    public SubscriptionStatusViewModel(Application application) {
        super(application);
        repository = ((SubApp) application).getRepository();
        loading = repository.getLoading();
        subscriptions = repository.getSubscriptions();
        basicContent = repository.getBasicContent();
        premiumContent = repository.getPremiumContent();
    }

    public void unregisterInstanceId() {
        // Unregister current Instance ID before the user signs out.
        // This is an authenticated call, so you cannot do this after the sign-out has completed.
        if (instanceIdToken != null) {
            repository.unregisterInstanceId(instanceIdToken);
        }
    }

    public void userChanged() {
        repository.deleteLocalUserData();
        String token = FirebaseInstanceId.getInstance().getToken();
        if (token != null) {
            registerInstanceId(token);
        }
        repository.fetchSubscriptions();
    }

    public void manualRefresh() {
        repository.fetchSubscriptions();
    }

    private void registerInstanceId(String token) {
        repository.registerInstanceId(token);
        // Keep track of the Instance ID so that it can be unregistered.
        instanceIdToken = token;
    }

    /**
     * Register a new subscription.
     */
    public void registerSubscription(String sku, String purchaseToken) {
        repository.registerSubscription(sku, purchaseToken);
    }

    /**
     * Transfer the subscription to this account.
     */
    public void transferSubscriptions() {
        Log.d(TAG, "transferSubscriptions");
        List<SubscriptionStatus> subs = subscriptions.getValue();
        if (subs != null) {
            for (SubscriptionStatus subscription : subs) {
                String sku = subscription.getSku();
                String purchaseToken = subscription.getPurchaseToken();
                if (sku != null && purchaseToken != null) {
                    repository.transferSubscription(sku, purchaseToken);
                }
            }
        }
    }
}
