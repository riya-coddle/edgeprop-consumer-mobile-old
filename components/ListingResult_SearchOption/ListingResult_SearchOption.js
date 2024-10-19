import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native'
import Button from '../Common_Button/Common_Button'
import IconMenu from '../Common_IconMenu/Common_IconMenu'
var dropdownIcon = require('../../assets/icons/dropdown-blue.png')

class ListingResult_SearchOption extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.style = {
            color: 'rgb(243,246,249)',
            marginVertical: 2,
            sortingValue: 'Latest First',
        }
        this._onSortPress = this._onSortPress.bind(this)
        this._onSaveSearchPress = this._onSaveSearchPress.bind(this)
    }

    _init() {
        if (this.props.color && this.props.color != this.style.color) {
            this.style.color = this.props.color
        }
        if (this.props.marginVertical && this.props.marginVertical != this.style.marginVertical) {
            this.style.marginVertical = this.props.marginVertical
        }
        if (this.props.sortingValue && this.props.sortingValue != this.style.sortingValue){
            this.style.sortingValue = this.props.sortingValue
        }
    }

    _onSortPress() {
        if (this.props.onPress) {
            this.props.onPress()
        }
    }

    _onSaveSearchPress() {
        console.log('coming sooon')
    }

    render() {
        this._init()
        const containerStyle = {
            marginVertical: this.style.marginVertical,
        }
        return (
            <View style={[styles.inline, containerStyle]}>
                <View style={{
                    width: '54%',
                }}>
                    {/*<Button
                        backgroundColor={this.style.color}
                        height={32}
                        borderRadius={1}
                        textValue={'Save this search'}
                        textSize={14}
                        textColor={'rgb(39,80,117)'}
                        fontFamily={'Poppins-Medium'}
                        onPress={this._onSaveSearchPress} />*/}
                </View>
                <View style={{
                    width: '45%',
                }}>
                    <Button
                        backgroundColor={this.style.color}
                        height={32}
                        borderRadius={1}
                        textValue={'Save this search'}
                        textSize={14}
                        textColor={'rgb(39,80,117)'}
                        fontFamily={'Poppins-Medium'}
                        onPress={this._onSortPress}>
                        <IconMenu
                            type={'icon-text'}
                            textPosition={'left'}
                            textValue={this.style.sortingValue}
                            textSize={15}
                            textColor={'rgb(47,47,47)'}
                            fontFamily={'Poppins-Regular'}
                            imageSource={dropdownIcon}
                            imageWidth={10}
                            imageHeight={5.6}
                            ellipsize={true}
                            gapAround={
                                {
                                    marginTop: 2.5,
                                    marginRight: 2.5,
                                    marginBottom: 2.5,
                                    marginLeft: 2.5,
                                }} />
                    </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inline: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})

export default ListingResult_SearchOption
