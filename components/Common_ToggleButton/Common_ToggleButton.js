import React, { Component } from 'React'
import {
    TouchableOpacity,
    View,
    Text,
} from 'react-native'
import ToggleButtonItem from '../../components/Common_ToggleButtonItem/Common_ToggleButtonItem.js'

export default class ToggleButton extends Component {
    borderRadius = 5
    data = []
    initFocusIndex = 0
    constructor(props) {
        super(props)
        this.state = {
            focusIndex: props.initFocusIndex
        }

        this.containerStyle = {
            flexDirection: 'row',
            paddingVertical: 1,
            paddingHorizontal: 10,
            marginVertical: 0,
            marginHorizontal: 0,
        }

        this.itemContainerStyle = {
            width: 80,
            height: 20,
        }

        this._handleOnItemPress = this._handleOnItemPress.bind(this)
    }

    _handleOnItemPress(index, id, title){
        if(index != this.state.focusIndex){
            this.setState({
                focusIndex: index
            })
        }
        if(this.props.onItemPress){
            this.props.onItemPress(index, id, title)
        }
    }

    _init(){
        if(this.props.containerStyle != undefined){
            this.containerStyle = {...this.containerStyle, ...this.props.containerStyle}
        }
        if(this.props.itemContainerStyle != undefined){
            this.itemContainerStyle = {...this.itemContainerStyle, ...this.props.itemContainerStyle}
        }
        if(this.props.data != undefined && this.props.data != this.data){
            this.data = this.props.data
        }
        if(this.props.borderRadius != undefined && this.props.borderRadius != this.borderRadius){
            this.borderRadius = this.props.borderRadius
        }
    }

    render(){
        this._init();
        var renderToggleItem = () => {
            return Object.keys(this.data).map((index) => {
                return(
                    <ToggleButtonItem
                        roundedBorderLeft={index==0? true: false}
                        roundedBorderRight={index==this.data.length-1? true: false}
                        borderLeft={index==0? true: false}
                        borderRight={true}
                        borderRadius = {this.borderRadius}
                        key={index}
                        index = {index}
                        onPress = {this._handleOnItemPress}
                        isFocused={index==this.state.focusIndex}
                        id = {this.data[index].id}
                        title={this.data[index].value}
                        containerStyle={this.itemContainerStyle}
                    />
                )
            })
        }
        return(
            <View style={this.containerStyle}>
                {renderToggleItem()}
            </View>
        )
    }
}
