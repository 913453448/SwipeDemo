/**
 * @author YASIN
 * @version [React-Native Ocj V01, 2018/3/28]
 * @date 17/2/23
 * @description SmartRefreshLayout.android
 */
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const PropTypes = require('prop-types');
const ViewPropTypes = require('ViewPropTypes');
const requireNativeComponent = require('requireNativeComponent');
export default class SmartRefreshLayout extends Component {
    static propTypes = {
        ...ViewPropTypes,
        refreshing: PropTypes.bool,
        loadMore: PropTypes.bool,
        onLoadMore: PropTypes.func,
        onRefresh: PropTypes.func,
        loadMoreEnable: PropTypes.bool,
        refreshEnable: PropTypes.bool,
    };
    static defaultProps = {
        refreshing: false,
        loadMore: false,
        refreshEnable: true,
        loadMoreEnable: true,
    };

    // 构造
    constructor(props) {
        super(props);
        this._lastNativeLoadMore = false;
        this._lastNativeRefresh = false;
    }

    render() {
        const {children, style, loadMore, refreshing, refreshEnable, loadMoreEnable} = this.props;
        return (
            <AndroidSmartRefreshLayout
                ref={ref => {
                    this._nativeRef = ref;
                }}
                style={[style]}
                onLoadMore={this._onLoadMore}
                onRefresh={this._onRefresh}
                loadMore={loadMore}
                refreshEnable={refreshEnable}
                loadMoreEnable={loadMoreEnable}
                refreshing={refreshing}
            >
                {React.Children.toArray(children)}
            </AndroidSmartRefreshLayout>
        );
    }

    componentDidMount() {
        this._lastNativeLoadMore = this.props.refreshing;
    };

    componentDidUpdate(prevProps: { loadMore: boolean }) {
        // RefreshControl is a controlled component so if the native refreshing
        // value doesn't match the current js refreshing prop update it to
        // the js value.
        if (this.props.loadMore !== prevProps.loadMore) {
            this._lastNativeLoadMore = this.props.loadMore;
        } else if (this.props.loadMore !== this._lastNativeLoadMore) {
            this._nativeRef.setNativeProps({loadMore: this.props.loadMore});
            this._lastNativeLoadMore = this.props.loadMore;
        }

        if (this.props.refreshing !== prevProps.refreshing) {
            this._lastNativeRefresh = this.props.refreshing;
        } else if (this.props.refreshing !== this._lastNativeRefresh) {
            this._nativeRef.setNativeProps({refreshing: this.props.refreshing});
            this._lastNativeRefresh = this.props.refreshing;
        }
    }

    _onLoadMore = (event) => {
        this._lastNativeLoadMore = true;

        this.props.onLoadMore && this.props.onLoadMore();
        // The native component will start refreshing so force an update to
        // make sure it stays in sync with the js component.
        this.forceUpdate();
    }
    _onRefresh=(event)=>{
        this._lastNativeRefresh = true;

        this.props.onRefresh && this.props.onRefresh();
        // The native component will start refreshing so force an update to
        // make sure it stays in sync with the js component.
        this.forceUpdate();
    }
}
const AndroidSmartRefreshLayout = requireNativeComponent('AndroidSmartRefreshLayout', SmartRefreshLayout);
