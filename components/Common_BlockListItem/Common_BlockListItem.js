import React, { Component } from 'React'
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native'
export default class Common_BlockListItem extends Component {
    isFocused = false
    constructor(props) {
        super(props)
        this.state = {
            isSelected: false,
            name: '',
            disable: props.disable,//=='partial' || props.disable==true ? true : false
            toggle: props.toggle
        }

        this.style = {
            // default value
            margin: 0,
            backgroundColor: '#ffffff',
            backgroundColorDisable: '#B5B5B5',
            backgroundColorSelected: '#275075',
            width: '100%',
            height: 50,
            textValue: 'item',
            textSize: 15,
            textColor: '#4A4A4A',
            textColorSelected: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Poppins-Medium',
            fontFamilySelected: 'Poppins-Medium',
            borderColor: "#E7E7E7",
            borderWidth: 1,
            borderRadius: 0,
            marginVertical: 0,
            fontStyle: 'normal',
        }
        this._onPress = this._onPress.bind(this)
    }

    _initStyle() {
        // init margin
        if (this.props.style.margin != undefined && this.props.style.margin != this.style.margin) {
            this.style.margin = this.props.style.margin
        }
        // init backgroundColor
        if (this.props.style.backgroundColor != undefined && this.props.style.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.style.backgroundColor
        }
        // init backgroundColorDisable
        if (this.props.style.backgroundColorDisable != undefined && this.props.style.backgroundColorDisable != this.style.backgroundColorDisable) {
            this.style.backgroundColorDisable = this.props.style.backgroundColorDisable
        }
        // init backgroundColorSelected
        if (this.props.style.backgroundColorSelected != undefined && this.props.style.backgroundColorSelected != this.style.backgroundColorSelected) {
            this.style.backgroundColorSelected = this.props.style.backgroundColorSelected
        }
        // init width
        if (this.props.style.width != undefined && this.props.style.width != this.style.width) {
            this.style.width = this.props.style.width
        }
        // init height
        if (this.props.style.height != undefined && this.props.style.height != this.style.height) {
            this.style.height = this.props.style.height
        }
        // init textValue
        if (this.props.textValue && this.props.textValue != this.style.textValue) {
            this.style.textValue = this.props.textValue
        }
        // init textSize
        if (this.props.style.textSize != undefined && this.props.style.textSize != this.style.textSize) {
            this.style.textSize = this.props.style.textSize
        }
        // init textColor
        if (this.props.style.textColor != undefined && this.props.style.textColor != this.style.textColor) {
            this.style.textColor = this.props.style.textColor
        }
        // init textColorSelected
        if (this.props.style.textColorSelected != undefined && this.props.style.textColorSelected != this.style.textColorSelected) {
            this.style.textColorSelected = this.props.style.textColorSelected
        }
        // init alignItems
        if (this.props.style.alignItems != undefined && this.props.style.alignItems != this.style.alignItems) {
            this.style.alignItems = this.props.style.alignItems
        }
        // init justifyContent
        if (this.props.style.justifyContent != undefined && this.props.style.justifyContent != this.style.justifyContent) {
            this.style.justifyContent = this.props.style.justifyContent
        }
        // init fontFamily
        if (this.props.style.fontFamily != undefined) {
            this.style.fontFamily = ((this.props.isFocused || this.state.isSelected) && this.props.style.fontFamilySelected!=undefined) ? this.props.style.fontFamilySelected : this.props.style.fontFamily
        }
        // init borderColor
        if (this.props.style.borderColor != undefined && this.props.style.borderColor != this.style.borderColor) {
            this.style.borderColor = this.props.style.borderColor
        }
        // init borderWidth
        if (this.props.style.borderWidth != undefined && this.props.style.borderWidth != this.style.borderWidth) {
            this.style.borderWidth = this.props.style.borderWidth
        }
        // init borderWidth
        if (this.props.style.borderRadius != undefined && this.props.style.borderRadius != this.style.borderRadius) {
            this.style.borderRadius = this.props.style.borderRadius
        }
        // init marginVertical
        if (this.props.style.marginVertical != undefined && this.props.style.marginVertical != this.style.marginVertical) {
            this.style.marginVertical = this.props.style.marginVertical
        }
        // init fontStyle
        if (this.props.style.fontStyle != undefined && this.props.style.fontStyle != this.style.fontStyle) {
            this.style.fontStyle = this.props.style.fontStyle
        }
        if(this.props.isFocused != undefined && this.props.isFocused!=this.isFocused){
            this.isFocused = this.props.isFocused
        }
    }


  _onPress() {
      if (this.props.onPress) {
          this.state.toggle == true
          ?
            this.props.onPress(this.state.isSelected,this.style.textValue, this.props.index, this.props.id)
          :
          this.state.isSelected == false
            ?
            this.setState({ isSelected: true, name: this.style.textValue }, () =>
                this.props.onPress(this.state.isSelected,this.style.textValue, this.props.index, this.props.id)
              )
            :
            this.props.anySelection == true && this.style.textValue == 'Any'
                ?
                console.log('doing nothing')
                :
                this.setState({ isSelected: false, name: this.style.textValue }, () =>
                    this.props.onPress(this.state.isSelected,this.style.textValue, this.props.index, this.props.id)
                );


      }
  }

  componentDidMount() {
      if(this.props.disable=='partial'){
          if(this.props.textValue == 'Specialised' || this.props.textValue == 'Independent'){
              this.setState({
                          disable: true,
                          isSelected: false,
                          toggle: false
                      })
              }
          else{
              this.setState({
                          disable: false,
                          isSelected: this.props.selectedIndex
                      })
              }
      }
      else{
          this.setState({
                      disable: this.props.disable,
                      isSelected: this.props.selectedIndex,
                      toggle: this.props.toggle
            })
      }
  }

  componentDidUpdate(prevProps, prevState) {
    // only update chart if the props has changed
    if (prevProps.disable !== this.props.disable) {
        // console.log(this.props.disable);
        if(this.props.disable=='partial'){
            if(this.props.textValue == 'Specialised' || this.props.textValue == 'Independent'){
                this.setState({
                        disable: true,
                        isSelected: false,
                        toggle: false
                    })
            }
            else{
                this.setState({
                            disable: false,
                            isSelected: this.props.selectedIndex
                        })
                }
        }
        else{
            this.setState({
                    disable: this.props.disable,
                    isSelected: this.props.selectedIndex,
                    toggle: this.props.toggle
                })
            }
    }

    if(prevProps.anySelection !== this.props.anySelection){
        if(this.props.anySelection == true){
            if(this.props.textValue == 'Any'){
                this.setState({
                            isSelected: true,
                        })
            }
            else{
                this.setState({
                            isSelected: false,
                    })
            }
        }
        else{
            this.setState({
                        isSelected: this.props.selectedIndex,
                })
        }
    }
  }
    render() {
        this._initStyle()
        return (
            <TouchableOpacity onPress= {this._onPress} disabled={this.state.disable== 'partial' ? true:this.state.disable}
                style={
                {
                    margin: this.style.margin,
                    marginVertical: this.style.marginVertical,
                    alignItems: this.style.alignItems,
                    justifyContent: this.style.justifyContent,
                    backgroundColor:this.state.disable == true
                                    ?
                                    this.style.backgroundColorDisable
                                    :
                                    this.state.toggle == true
                                        ?
                                            this.isFocused
                                                ?  this.style.backgroundColorSelected
                                                : this.style.backgroundColor
                                        :
                                            this.state.isSelected
                                                ? this.style.backgroundColorSelected
                                                : this.style.backgroundColor,
                    width: this.style.width,
                    height: this.style.height,
                    borderTopColor: this.style.borderColor,
                    borderBottomColor: this.style.borderColor,
                    borderLeftColor: (((!this.props.isLeftRounded && this.isFocused) || this.props.isRightNeighborFocused) && this.props.isLeftRounded!=undefined && !this.state.disable) ? this.style.backgroundColorSelected : this.style.borderColor,
                    borderRightColor: (((!this.props.isRightRounded && this.isFocused) || this.props.isLeftNeighborFocused) && this.props.isRightRounded!=undefined && !this.state.disable) ? this.style.backgroundColorSelected : this.style.borderColor,
                    borderTopWidth: this.style.borderWidth,
                    borderBottomWidth: this.style.borderWidth,
                    borderLeftWidth: ((this.props.isLeftRounded!=undefined && !this.props.isLeftRounded) ? this.style.borderWidth/2 : this.style.borderWidth),
                    borderRightWidth: ((this.props.isRightRounded!=undefined && !this.props.isRightRounded) ? this.style.borderWidth/2 : this.style.borderWidth),
                    borderTopLeftRadius: (this.props.isLeftRounded ? this.style.borderRadius : 0),
                    borderBottomLeftRadius: (this.props.isLeftRounded ? this.style.borderRadius : 0),
                    borderTopRightRadius: (this.props.isRightRounded ? this.style.borderRadius : 0),
                    borderBottomRightRadius: (this.props.isRightRounded ? this.style.borderRadius : 0),
                }}>

                <View style={{
                    height: this.style.height,
                    alignItems: this.style.alignItems,
                    justifyContent: this.style.justifyContent,
                }}>
                    <Text allowFontScaling={false} style={
                        {
                            fontSize : this.style.textSize,
                            fontStyle: this.style.fontStyle,
                            fontFamily: this.style.fontFamily,
                            color: this.state.disable == true
                                            ?
                                            this.style.textColor
                                            :
                                            this.state.toggle == true
                                                ?
                                                    this.isFocused
                                                        ?  this.style.textColorSelected
                                                        : this.style.textColor
                                                :
                                                    this.state.isSelected
                                                        ? this.style.textColorSelected
                                                        : this.style.textColor,
                        }}>
                        {this.style.textValue}
                    </Text>
                </View>

            </TouchableOpacity>
        );
    }
}
