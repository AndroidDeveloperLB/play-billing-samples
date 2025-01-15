/*
 * Copyright 2021 Google LLC. All rights reserved.
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

package com.sample.android.classytaxijava.data.network.retrofit;

import com.sample.android.classytaxijava.data.ContentResource;
import com.sample.android.classytaxijava.data.SubscriptionStatus;
import com.sample.android.classytaxijava.data.SubscriptionStatusList;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.PUT;

/**
 * Retrofit API Interfaces.
 */
public interface SubscriptionStatusApiCall {
    public static final String BASIC_CONTENT = "content_basic";
    public static final String PREMIUM_CONTENT = "content_premium";
    public static final String SUBSCRIPTION_STATUS = "subscription_status";
    public static final String REGISTER_SUBSCRIPTION = "subscription_register";
    public static final String TRANSFER_SUBSCRIPTION = "subscription_transfer";
    public static final String REGISTER_INSTANCE_ID = "instanceId_register";
    public static final String UNREGISTER_INSTANCE_ID = "instanceId_unregister";

    // Fetch Basic content.
    @GET(BASIC_CONTENT)
    Call<ContentResource> fetchBasicContent();

    // Fetch Premium content.
    @GET(PREMIUM_CONTENT)
    Call<ContentResource> fetchPremiumContent();

    // Fetch Subscription Status.
    @GET(SUBSCRIPTION_STATUS)
    Call<SubscriptionStatusList> fetchSubscriptionStatus();

    // Registers Instance ID for Firebase Cloud Messaging.
    @PUT(REGISTER_INSTANCE_ID)
    Call<String> registerInstanceID(@Body Map<String, String> instanceId);

    // Unregisters Instance ID for Firebase Cloud Messaging.
    @PUT(UNREGISTER_INSTANCE_ID)
    Call<String> unregisterInstanceID(@Body Map<String, String> instanceId);

    // Registers subscription status to the server.
    @PUT(REGISTER_SUBSCRIPTION)
    Call<SubscriptionStatusList> registerSubscription(@Body SubscriptionStatus registerStatus);

    // Transfers subscription status to another account.
    @PUT(TRANSFER_SUBSCRIPTION)
    Call<SubscriptionStatusList> transferSubscription(@Body SubscriptionStatus transferStatus);
}