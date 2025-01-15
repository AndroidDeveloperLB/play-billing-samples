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

package com.sample.android.classytaxijava.presenter;

import android.text.TextUtils;

import androidx.leanback.widget.AbstractDetailsDescriptionPresenter;

import com.sample.android.classytaxijava.data.SubscriptionContent;

/**
 * Presenter class used to bind and display metadata from a SubscriptionContent object
 */
public class SubscriptionDetailsPresenter extends AbstractDetailsDescriptionPresenter {

    @Override
    public void onBindDescription(ViewHolder viewHolder, Object item) {
        SubscriptionContent subscription = (SubscriptionContent) item;

        if (subscription != null) {
            viewHolder.getTitle().setText(subscription.title);
            viewHolder.getSubtitle().setText(subscription.subtitle);
            if (!TextUtils.isEmpty(subscription.description)) {
                viewHolder.getBody().setText(subscription.description);
            }
        }
    }
}
