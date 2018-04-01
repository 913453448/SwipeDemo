/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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
const SCREEN_H = Dimensions.get('window').height-(Platform.OS==='android'?StatusBar.currentHeight:0);
import SwipeRow from './SwipeRow';

export default class App extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
          // 初始状态
          this._panResponder = PanResponder.create({
              onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponderCapture.bind(this),
              onStartShouldSetResponderCapture:this._handleMoveShouldSetPanResponderCapture.bind(this),
              onPanResponderMove: this._handlePanResponderMove.bind(this),
              onPanResponderRelease: this._handlePanResponderEnd.bind(this),
              onPanResponderGrant:this._handlePanGrant.bind(this),
              onPanResponderTerminate:()=>{
                  console.log('onPanResponderTerminate');
                  this._aniBack1.setValue(0);
                  Animated.spring(this._aniBack1,{
                      toValue:1
                  }).start(()=>{
                      this._handlePanResponderEnd();
                  });
              },
              onShouldBlockNativeResponder: (event, gestureState) => false,//表示是否用 Native 平台的事件处理，默认是禁用的，全部使用 JS 中的事件处理，注意此函数目前只能在 Android 平台上使用
          });
          this._panResponder2 = PanResponder.create({
              onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponderCapture2.bind(this),
              onStartShouldSetResponderCapture:this._handleMoveShouldSetPanResponderCapture2.bind(this),
              onPanResponderMove: this._handlePanResponderMove2.bind(this),
              onPanResponderRelease: this._handlePanResponderEnd2.bind(this),
              onPanResponderGrant:this._handlePanGrant2.bind(this),
              onPanResponderTerminate:()=>{
                  this._container2.setNativeProps({
                      marginTop:0
                  })
                  this._aniBack2.setValue(0);
                  Animated.spring(this._aniBack2,{
                      toValue:1
                  }).start(()=>{
                      this._handlePanResponderEnd2();
                  });
                  console.log('onPanResponderTerminate2');
              },
              onShouldBlockNativeResponder: (event, gestureState) => false,//表示是否用 Native 平台的事件处理，默认是禁用的，全部使用 JS 中的事件处理，注意此函数目前只能在 Android 平台上使用
          });
          this._reachEnd1=false;
          this._reachEnd2=true;
          this._aniBack=new Animated.Value(0);
          this._aniBack1=new Animated.Value(0);
          this._aniBack2=new Animated.Value(0);
      }
    _handlePanGrant(event: Object, gestureState: Object,){
        this._scroll1.setNativeProps({
            scrollEnabled:false
        })
    }
    _handleMoveShouldSetPanResponderCapture(event: Object, gestureState: Object,): boolean {
        console.log('_handleMoveShouldSetPanResponderCapture');
        console.log(gestureState.dy);
        return this._reachEnd1&&gestureState.dy<0;
    }
    _handlePanResponderMove(event: Object, gestureState: Object): void {
          this._scroll1.setNativeProps({
              scrollEnabled:false
          })
        let nowLeft =gestureState.dy*0.5;
        this._container1.setNativeProps({
            marginTop:nowLeft
        })
        console.log('_handlePanResponderMove',gestureState.dy);
    }
    _handlePanResponderEnd(event: Object, gestureState: Object): void {
        this._aniBack.setValue(0);
        this._scroll1.setNativeProps({
            scrollEnabled: true
        })
        this._scroll1.scrollTo({y:0},true);
        Animated.timing(this._aniBack, {
            duration: 500,
            toValue: 1
        }).start();
        this._aniBack1.setValue(1);
        Animated.spring(this._aniBack1, {
            toValue: 0
        }).start();
    }

    _handleMoveShouldSetPanResponderCapture2(event: Object, gestureState: Object,): boolean {
          console.log(gestureState.dy);
          console.log('_handleMoveShouldSetPanResponderCapture2');
        return this._reachEnd2&&gestureState.dy>=0;
    }
    _handlePanResponderMove2(event: Object, gestureState: Object): void {
          console.log('_handlePanResponderMove2');
        let nowLeft =gestureState.dy*0.5;
        this._scroll2.setNativeProps({
            scrollEnabled:false
        })
        this._container2.setNativeProps({
            marginTop:-100+nowLeft
        })
        console.log('_handlePanResponderMove2',gestureState.dy);
    }
    _handlePanGrant2(event: Object, gestureState: Object,){
        this._scroll2.setNativeProps({
            scrollEnabled:false
        })
    }

    _handlePanResponderEnd2(event: Object, gestureState: Object): void {
        this._aniBack.setValue(1);
        this._scroll2.setNativeProps({
            scrollEnabled: true
        })
        Animated.timing(this._aniBack, {
            duration: 500,
            toValue: 0
        }).start();
        this._aniBack2.setValue(1);
        Animated.spring(this._aniBack2, {
            toValue: 0
        }).start();

    }
    render() {
        return (
            <View
                style={[styles.container]}
            >
                {/*第一部分*/}
                <Animated.View
                    style={[styles.container1,{
                        marginTop:this._aniBack.interpolate({
                            inputRange:[0,1],
                            outputRange:[0,-SCREEN_H],
                        })
                    }]}
                    {...this._panResponder.panHandlers}
                >
                    <Animated.View
                        ref={(ref) => this._container1 = ref}
                        style={{width: SCREEN_W, height: SCREEN_H,
                            marginTop:this._aniBack1.interpolate({
                                inputRange:[0,1],
                                outputRange:[0,-100],
                            })}}
                    >
                        <ScrollView
                            ref={(ref)=>this._scroll1=ref}
                            bounces={false}
                            scrollEventThrottle={10}
                            onScroll={this._onScroll.bind(this)}
                            overScrollMode={'never'}
                        >
                            {this._getContent()}
                        </ScrollView>
                    </Animated.View>
                    <View style={{width:SCREEN_W,height:100,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                        <Text>上拉查看详情</Text>
                    </View>
                </Animated.View>

                {/*第二部分*/}
                <View
                    style={styles.container2}
                      {...this._panResponder2.panHandlers}
                >
                    <Animated.View
                        ref={(ref) => this._container2 = ref}
                        style={{
                            width:SCREEN_W,height:100,backgroundColor:'white',alignItems:'center',justifyContent:'center',
                            marginTop:this._aniBack2.interpolate({
                                inputRange:[0,1],
                                outputRange:[-100,0],
                            })
                        }}
                    >
                        <Text>下拉回到顶部</Text>
                    </Animated.View>
                    <View
                        style={{width: SCREEN_W, height: SCREEN_H,}}
                    >
                        <ScrollView
                            ref={(ref)=>this._scroll2=ref}
                            bounces={false}
                            scrollEventThrottle={10}
                            onScroll={this._onScroll2.bind(this)}
                            overScrollMode={'never'}
                        >
                            {this._getContent()}
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
    _onScroll(event){
        this._reachEnd1=false;
        let y = event.nativeEvent.contentOffset.y;
        let height = event.nativeEvent.layoutMeasurement.height;
        let contentHeight = event.nativeEvent.contentSize.height;
        if (contentHeight > height && (y + height >= contentHeight)) {
            this._reachEnd1=true;
        }
    }
    _onScroll2(event){
        this._reachEnd2=false;
        let y = event.nativeEvent.contentOffset.y;
        if(y<=0){
            this._reachEnd2=true;
        }
    }
    _getContent(){
        let contents=[];
        for (let i = 0; i < 50; i++) {
            contents.push(
                <Text style={{color:'#fff',marginTop:10}} key={'item'+i}>content-->{i}</Text>
            );
        }
        return contents;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        width: '100%',
        // transform:[{translateY:-SCREEN_H}]
    },
    container1:{
        width:SCREEN_W,
        height:SCREEN_H,
        backgroundColor:'red'
    },
    container2:{
        width:SCREEN_W,
        height:SCREEN_H,
        backgroundColor:'blue',
        overflow:'hidden'
    },
});
