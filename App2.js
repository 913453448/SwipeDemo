/**
 * @author YASIN
 * @version [React-Native Ocj V01, 2018/3/28]
 * @date 17/2/23
 * @description App2
 */
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    PanResponder,
    Animated,
    StatusBar,
} from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height - (Platform.OS === 'android' ? StatusBar.currentHeight : 0);

import SmallLayout from './SmartRefreshLayout';

export default class App2 extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            loadMore1: false,
            loadMore1: false,
        };
        this.aniBack = new Animated.Value(0);
    }

    render() {
        return (
            <Animated.View
                style={[styles.container, {
                    marginTop: this.aniBack.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -SCREEN_H],
                    })
                }]}
            >
                {/*第一部分*/}
                <SmallLayout
                    style={{width: '100%', height: SCREEN_H, backgroundColor: 'red'}}
                    loadMore={this.state.loadMore1}
                    refreshEnable={false}
                    onLoadMore={() => {
                        this._startAniNext();
                    }}
                >
                    <ScrollView
                    >
                        {this._getContent()}
                    </ScrollView>
                </SmallLayout>
                {/*第二部分*/}
                <SmallLayout
                    key={'small2'}
                    style={{width: '100%', height: SCREEN_H, backgroundColor: 'blue'}}
                    refreshing={this.state.loadMore2}
                    loadMoreEnable={false}
                    onRefresh={()=>{
                        this._startAniBackTop();
                    }}
                >
                    <ScrollView
                    >
                        {this._getContent()}
                    </ScrollView>
                </SmallLayout>
            </Animated.View>
        );
    }

    _startAniBackTop() {
        this.aniBack.setValue(1);
        Animated.timing(this.aniBack, {
            duration: 1000,
            toValue: 0,
        }).start(() => {
        });
    }

    _startAniNext() {
        this.aniBack.setValue(0);
        Animated.timing(this.aniBack, {
            duration: 1000,
            toValue: 1,
        }).start(() => {
        });
    }

    _getContent() {
        let contents = [];
        for (let i = 0; i < 50; i++) {
            contents.push(
                <Text style={{color: '#fff', marginTop: 10}} key={'item' + i}>content-->{i}</Text>
            );
        }
        return contents;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    }
});