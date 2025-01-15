/*
 * Copyright 2018 Google LLC. All rights reserved.
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

package com.example.billing

import android.app.Application
import com.example.billing.Constants.USE_FAKE_SERVER
import com.example.billing.gpbl.BillingClientLifecycle
import com.example.billing.data.BillingRepository
import com.example.billing.data.disk.BillingLocalDataSource
import com.example.billing.data.disk.db.OneTimePurchasesDatabase
import com.example.billing.data.disk.db.SubscriptionPurchasesDatabase
import com.example.billing.data.network.BillingRemoteDataSource
import com.example.billing.data.network.firebase.FakeServerFunctions
import com.example.billing.data.network.firebase.ServerFunctions

/**
 * Android Application class. Used for accessing singletons.
 */
class BillingApp : Application() {

    private val subscriptionsDatabase: SubscriptionPurchasesDatabase
        get() = SubscriptionPurchasesDatabase.getInstance(this)

    private val  oneTimeProductPurchasesDatabase: OneTimePurchasesDatabase
        get() = OneTimePurchasesDatabase.getInstance(this)

    private val billingLocalDataSource: BillingLocalDataSource
        get() = BillingLocalDataSource.getInstance(
            subscriptionsDatabase.subscriptionStatusDao(),
            oneTimeProductPurchasesDatabase.oneTimeProductStatusDao()
        )

    private val serverFunctions: ServerFunctions
        get() {
            return if (USE_FAKE_SERVER) {
                FakeServerFunctions.getInstance()
            } else {
                ServerFunctions.getInstance()
            }
        }

    private val billingRemoteDataSource: BillingRemoteDataSource
        get() = BillingRemoteDataSource.getInstance(serverFunctions)

    val billingClientLifecycle: BillingClientLifecycle
        get() = BillingClientLifecycle.getInstance(this)

    val repository: BillingRepository
        get() = BillingRepository.getInstance(billingLocalDataSource, billingRemoteDataSource, billingClientLifecycle)

}
