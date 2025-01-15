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

package com.sample.android.classytaxijava.data.network.retrofit.authentication;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sample.android.classytaxijava.data.network.retrofit.ServerFunctionImpl;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.converter.scalars.ScalarsConverterFactory;

/**
 * Creates Retrofit instances that
 * {@link ServerFunctionImpl}
 * uses to make authenticated HTTPS requests.
 *
 * @param <S>
 */
public class RetrofitClient<S> {
    private final S service;
    private static final int NETWORK_TIMEOUT_SECONDS = 60;

    public RetrofitClient(String baseUrl, Class<S> serviceClass) {
        final OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .connectTimeout(NETWORK_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .readTimeout(NETWORK_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .writeTimeout(NETWORK_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .addInterceptor(new UserIdTokenInterceptor())
                .build();

        final Gson gson = new GsonBuilder().create();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(baseUrl)
                .client(okHttpClient)
                .addConverterFactory(ScalarsConverterFactory.create())
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build();
        service = retrofit.create(serviceClass);
    }

    public S getService() {
        return service;
    }
}
