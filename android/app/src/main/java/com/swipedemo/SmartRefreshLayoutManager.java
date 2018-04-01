/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 * <p>
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.swipedemo;


import android.support.annotation.NonNull;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.scwang.smartrefresh.layout.SmartRefreshLayout;
import com.scwang.smartrefresh.layout.api.RefreshLayout;
import com.scwang.smartrefresh.layout.listener.OnLoadMoreListener;
import com.scwang.smartrefresh.layout.listener.OnRefreshListener;

import java.util.Map;

/**
 * ViewManager for {@link com.facebook.react.views.swiperefresh.ReactSwipeRefreshLayout} which allows the user to "pull to refresh" a
 * child view. Emits an {@code onRefresh} event when this happens.
 */
@ReactModule(name = SmartRefreshLayoutManager.REACT_CLASS)
public class SmartRefreshLayoutManager extends ViewGroupManager<SmartRefreshLayout> {

    protected static final String REACT_CLASS = "AndroidSmartRefreshLayout";

    @ReactProp(name = "refreshing")
    public void setRefreshing(SmartRefreshLayout view, boolean refreshing) {
        if (refreshing) {
            view.autoRefresh();
        } else {
            view.finishRefresh();
        }
    }

    @ReactProp(name = "loadMore")
    public void setLoadMore(SmartRefreshLayout view, boolean refreshing) {
        if (refreshing) {
            view.autoLoadMore();
        } else {
            view.finishLoadMore();
        }
    }
    @ReactProp(name = "loadMoreEnable")
    public void setLoadMoreEnable(SmartRefreshLayout view, boolean enable) {
        view.setEnableLoadMore(enable);
    }
    @ReactProp(name = "refreshEnable")
    public void setRefreshEnable(SmartRefreshLayout view, boolean enable) {
        view.setEnableRefresh(enable);
    }
    @Override
    protected SmartRefreshLayout createViewInstance(ThemedReactContext reactContext) {
        final SmartRefreshLayout smartRefreshLayout = new SmartRefreshLayout(reactContext);
        smartRefreshLayout.setOnLoadMoreListener(new OnLoadMoreListener() {
            @Override
            public void onLoadMore(@NonNull final RefreshLayout refreshLayout) {
                dispatchEvent(smartRefreshLayout,new LoadMoreEvent(smartRefreshLayout.getId()));
            }
        });
        smartRefreshLayout.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh(@NonNull RefreshLayout refreshLayout) {
                dispatchEvent(smartRefreshLayout,new RefreshEvent(smartRefreshLayout.getId()));
            }
        });
        //触发自动刷新
        smartRefreshLayout.setRefreshHeader(new CustHeader(reactContext));
//        smartRefreshLayout.setEnableOverScrollBounce(true);
        smartRefreshLayout.setEnableOverScrollDrag(false);
        smartRefreshLayout.setEnableAutoLoadMore(false);
        smartRefreshLayout.setRefreshFooter(new CustFooter(reactContext));
        return smartRefreshLayout;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("topRefresh", MapBuilder.of("registrationName", "onRefresh"))
                .put("bottomRefresh", MapBuilder.of("registrationName", "onLoadMore"))
                .build();
    }
    protected static void dispatchEvent(SmartRefreshLayout refreshLayout, Event event) {
        ReactContext reactContext = (ReactContext) refreshLayout.getContext();
        EventDispatcher eventDispatcher =
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        eventDispatcher.dispatchEvent(event);
    }
}
