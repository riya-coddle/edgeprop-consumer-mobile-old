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
    Dimensions,
    FlatList,
    ScrollView
} from 'react-native'
import Common_BlockListItem from '../../components/Common_BlockListItem/Common_BlockListItem'
export default class Common_BlockList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            focusIndex: props.initFocusIndex,
            disable: props.disable,
            anySelection: props.anySelection,
            selectedIndex: props.selectedIndex
        }
        
        this.style = {
            // default value
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 13,
            width: '100%',
            justifyContent:'center',
            lineHeight: 38,
            color: '#265075',
            fontSize: 16,
            fontFamily: 'Poppins-Regular'
        }
        this.item={
            criteria: '',
            data:{},
        }
        this._onPress=this._onPress.bind(this);
    }

    _initStyle() {
        // init marginTop
        if (this.props.marginTop!=undefined && this.props.marginTop != this.style.marginTop) {
            this.style.marginTop = this.props.marginTop
        }
        // init marginBottom
        if (this.props.marginBottom!=undefined && this.props.marginBottom != this.style.marginBottom) {
            this.style.marginBottom = this.props.marginBottom
        }
        // init marginLeft
        if (this.props.marginLeft!=undefined && this.props.marginLeft != this.style.marginLeft) {
            this.style.marginLeft = this.props.marginLeft
        }
        // init width
        if (this.props.width!=undefined && this.props.width != this.style.width) {
            this.style.width = this.props.width
        }
        // init justifyContent
        if (this.props.justifyContent!=undefined && this.props.justifyContent != this.style.justifyContent) {
            this.style.justifyContent = this.props.justifyContent
        }
        // init lineHeight
        if (this.props.lineHeight!=undefined && this.props.lineHeight != this.style.lineHeight) {
            this.style.lineHeight = this.props.lineHeight
        }
        // init color
        if (this.props.color!=undefined && this.props.color != this.style.color) {
            this.style.color = this.props.color
        }
        // init fontSize
        if (this.props.fontSize!=undefined && this.props.fontSize != this.style.fontSize) {
            this.style.fontSize = this.props.fontSize
        }
        // init fontFamily
        if (this.props.fontFamily!=undefined && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }


    }
    _initItem(){
        // init criteria
        if (this.props.criteria && this.props.criteria != this.item.criteria) {
            this.item.criteria = this.props.criteria
        }
        // init data
        if (this.props.data && this.props.data != this.item.data) {
            this.item.data = this.props.data
        }
    }

    _onPress(isSelected, name, index, id){
        if(this.props.onPress){
          this.props.onPress(isSelected, name, index, id)
        }
        if(this.props.toggle == true){
            if(index != this.state.focusIndex){
                this.setState({
                    focusIndex: index
                })
            }
        }
        if(this.props.anySelection){
            if(name == 'Any'){
                this.setState({
                    anySelection: true
                })
            }
            else{
                this.setState({
                    anySelection: false,
                    selectedIndex: [index]
                })
            }
        }
  }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillReceiveProps(nextProps){
        if(this.props.toggle == true){
            if (nextProps.initFocusIndex != this.props.initFocusIndex) {
                this.setState({
                    focusIndex: nextProps.initFocusIndex
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.disable !== this.props.disable) {
        this.setState({
                    disable: this.props.disable
                })
      }
      if (prevProps.selectedIndex !== this.props.selectedIndex) {
          if(JSON.stringify(this.props.selectedIndex) == JSON.stringify([0])){
              this.setState({
                          selectedIndex: this.props.selectedIndex,
                          anySelection: true
                      })
          }
      }
    }
    _renderItem(item, index) {
        const Style = {}

        var width = 100/this.props.numOfColumn+'%';
        return (
            <View style={{flexDirection:'row', width:width}}>
                <Common_BlockListItem
                    isLeftRounded={(this.props.style && index===0) ? (this.props.style.borderRadius || 0) : 0}
                    isRightRounded={(this.props.style && index===this.item.data.length-1) ? (this.props.style.borderRadius || 0) : 0}
                    toggle={this.props.toggle}
                    textValue={item.value}
                    id={item.id}
                    onPress={this._onPress}
                    disable={this.state.disable}
                    key={index}
                    index = {index}
                    isLeftNeighborFocused={this.props.isRounded!=undefined ? (index==this.state.focusIndex-1) : null}
                    isRightNeighborFocused={this.props.isRounded!=undefined ? (index==this.state.focusIndex+1) : null}
                    isFocused={index==this.state.focusIndex}
                    style={this.props.style?this.props.style:Style}
                    selectedIndex={this.props.selectedIndex && this.props.selectedIndex.indexOf(index) !== -1}
                    anySelection = {this.state.anySelection}
                />
            </View>
        )

    }

    render() {
        this._initStyle()
        this._initItem()
        return (
            <View style={{width: this.style.width}}>
                <View style={{
                    marginTop: this.style.marginTop,
                    marginBottom: this.style.marginBottom,
                    marginLeft: this.style.marginLeft,
                    justifyContent: this.style.justifyContent,
                    display: this.item.criteria != undefined ? 'flex' : 'none',
                }}>
                    <Text allowFontScaling={false} style={{
                        color: this.style.color,
                        fontSize: this.style.fontSize,
                        fontFamily: this.style.fontFamily,
                    }}>
                    {this.item.criteria}
                    </Text>
                </View>

                <FlatList
                    keyboardShouldPersistTaps={'always'}
                    numColumns={this.props.numOfColumn}
                    flexDirection={'column'}
                    data={this.item.data}
                    renderItem={({ item, index }) => this._renderItem(item, index)}
                    keyExtractor={(item, index) => item.id}
                    scrollEnabled = {false}
                    extraData = {this.state}
                />
            </View>
        );
    }
}
