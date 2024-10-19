import React, { Component } from 'react'
import { StyleSheet, StatusBar, Alert, Text, View, Slider, TouchableOpacity, Switch, ActivityIndicator, ScrollView, Platform } from 'react-native'

import SystemSetting from 'react-native-system-setting'

export default class BrightnessSetting extends Component {

    isAndroid = Platform.OS === 'android'

    constructor(props) {
        super(props)
        this.state = {
            brightness: 0,
        }
    }

    async componentDidMount() {
        this.setState({
            brightness: await SystemSetting.getBrightness(),
        })
        // just init slider value directly
        this._changeSliderNativeVol(this.sliderBri, this.state.brightness)

       
    }

    _changeSliderNativeVol(slider, value) {
        slider.setNativeProps({
            value: value
        })
    }



    _changeBrightness = async (value) => {
        const result = await SystemSetting.setBrightnessForce(value)
        if (!result) {
            Alert.alert('Permission Deny', 'You have no permission changing settings', [
                { 'text': 'Ok', style: 'cancel' },
                { 'text': 'Open Setting', onPress: () => SystemSetting.grantWriteSettingPremission() }
            ])
            return
        }
        this.setState({
            brightness: value,
        })
    }

    _restoreBrightness = () => {
        const saveBrightnessVal = SystemSetting.restoreBrightness()
        if (saveBrightnessVal > -1) {
            // success
            this.setState({
                brightness: saveBrightnessVal
            })
            this._changeSliderNativeVol(this.sliderBri, saveBrightnessVal)
        }
    }



    render() {
        const {  brightness,
        } = this.state
        return (
            <View>
                <StatusBar />
                <ValueView
                    title='Brightness'
                    value={brightness}
                    changeVal={(val) => this._changeBrightness(val)}
                    refFunc={(sliderBri) => this.sliderBri = sliderBri}
                />
            </View>
        )
    }
}

const ValueView = (props) => {
    const { title, value, changeVal, refFunc, btn } = props
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                {btn && <TouchableOpacity onPress={btn.onPress}>
                    <Text allowFontScaling={false} style={styles.btn}>{btn.title}</Text>
                </TouchableOpacity>}
            </View>
            <Slider
                ref={refFunc}
                style={styles.slider}
                onValueChange={changeVal} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E7E8'
    },
    head: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 64,
    },
    card: {
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        alignItems: 'stretch'
    },
    row: {
        flexDirection: 'row',
        alignSelf: 'center'      
    },
    title: {
        fontSize: 16,
        color: '#6F6F6F'
    },
    value: {
        fontSize: 14,
        flex: 1,
        textAlign: 'right',
        color: '#904ED9'
    },
    split: {
        marginVertical: 16,
        height: 1,
        backgroundColor: '#ccc',
    },
    btn: {
        fontSize: 16,
        padding: 8,
        paddingVertical: 8,
        color: '#405EFF'
    }
})