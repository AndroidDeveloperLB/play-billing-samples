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

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;

import com.sample.android.classytaxijava.R;
import com.sample.android.classytaxijava.databinding.FragmentHomeBinding;
import com.sample.android.classytaxijava.databinding.FragmentPremiumBinding;
import com.sample.android.classytaxijava.databinding.FragmentSettingsBinding;

/**
 * {@link Fragment} for Home, Premium, and Settings tabs.
 */
public class TabFragment extends Fragment {

    private static final String TAG = "TabFragment";

    /**
     * The fragment argument representing the section number for this
     * fragment.
     */
    private static final String ARG_SECTION_NUMBER = "section_number";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstancedState) {
        BillingViewModel billingViewModel = ViewModelProviders.of(requireActivity()).get(BillingViewModel.class);
        SubscriptionStatusViewModel subscriptionViewModel =
                ViewModelProviders.of(requireActivity()).get(SubscriptionStatusViewModel.class);

        int section = getArguments().getInt(ARG_SECTION_NUMBER);

        switch (section) {
            case MainActivity.HOME_PAGER_INDEX:
                return createHomeView(inflater, container, billingViewModel, subscriptionViewModel);
            case MainActivity.PREMIUM_PAGER_INDEX:
                return createPremiumView(inflater, container, billingViewModel, subscriptionViewModel);
            case MainActivity.SETTINGS_PAGER_INDEX:
                return createSettingsView(inflater, container, billingViewModel, subscriptionViewModel);
            default:
                Log.e(TAG, "Unrecognized fragment index");
                return createHomeView(inflater, container, billingViewModel, subscriptionViewModel);
        }
    }

    /**
     * Inflate the UI view for the Home tab and bind to the ViewModel.
     */
    private View createHomeView(LayoutInflater inflater, ViewGroup container,
                                BillingViewModel billingViewModel,
                                SubscriptionStatusViewModel subscriptionViewModel) {
        // Data binding with a ViewModel.
        FragmentHomeBinding fragmentBinding =
                DataBindingUtil.inflate(inflater, R.layout.fragment_home, container, false);
        fragmentBinding.setLifecycleOwner(this);
        fragmentBinding.setBillingViewModel(billingViewModel);
        fragmentBinding.setSubscriptionViewModel(subscriptionViewModel);
        return fragmentBinding.getRoot();
    }

    /**
     * Inflate the UI view for the Premium tab and bind to the ViewModel.
     */
    private View createPremiumView(LayoutInflater inflater, ViewGroup container,
                                   BillingViewModel billingViewModel,
                                   SubscriptionStatusViewModel subscriptionViewModel) {
        // Data binding with a ViewModel.
        FragmentPremiumBinding fragmentBinding = DataBindingUtil.inflate(
                inflater, R.layout.fragment_premium, container, false);
        fragmentBinding.setLifecycleOwner(this);
        fragmentBinding.setBillingViewModel(billingViewModel);
        fragmentBinding.setSubscriptionViewModel(subscriptionViewModel);
        return fragmentBinding.getRoot();
    }

    /**
     * Inflate the UI view for the Settings tab and bind to the ViewModel.
     */
    private View createSettingsView(LayoutInflater inflater, ViewGroup container,
                                    BillingViewModel billingViewModel,
                                    SubscriptionStatusViewModel subscriptionViewModel) {
        // Data binding with a ViewModel.
        FragmentSettingsBinding fragmentBinding =
                DataBindingUtil.inflate(
                        inflater, R.layout.fragment_settings, container, false);
        fragmentBinding.setLifecycleOwner(this);
        fragmentBinding.setBillingViewModel(billingViewModel);
        fragmentBinding.setSubscriptionViewModel(subscriptionViewModel);
        return fragmentBinding.getRoot();
    }

    public static TabFragment newInstance(int sectionNumber) {
        Bundle args = new Bundle();
        args.putInt(ARG_SECTION_NUMBER, sectionNumber);
        TabFragment tabFragment = new TabFragment();
        tabFragment.setArguments(args);
        return tabFragment;
    }
}
