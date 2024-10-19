import React, { Component } from 'React'
import {
    TouchableHighlight,
    View,
    Image,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native'
const {width, height} = Dimensions.get('window');

class News_ListItemDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {}

        this.style = {
            // default value
            // component
            // height: 90,
            width: '100%',//(0.5104 * width), // constant 0.5104 is ratio of view width on the screen
            backgroundColor: 'rgba(0,0,0,0)',
            marginVertical: 1,
            marginHorizontal: 1,
            borderRadius: 0,
            borderWidth: 0,
            borderColor: '#fff',
            // header text
            headerTxtSize: 11,
            headerTxtColor: '#366084',
            headerFontStyle: 'normal',
            headerFontWeight: 'normal',
            headerFontFamily: 'Poppins-Regular',
            // content text
            contentTxtSize: 14,
            contentTxtColor: '#000',
            contentFontStyle: 'normal',
            contentFontWeight: 'normal',
            contentFontFamily: 'Poppins-Regular',
        }

        this.data = {
            headerTxt: '',
            contentTxt: '',
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps.data) !== JSON.stringify(this.data) || nextProps.darkMode != this.props.darkMode)
    }

    componentWillReceiveProps(nextProps) {
    }

    _initStyle() {
        // init height
        if (this.props.height && this.props.height != this.style.height) {
            this.style.height = this.props.height
        }
        // init width
        if (this.props.width && this.props.width != this.style.width) {
            this.style.width = this.props.width
        }
        // init backgroundColor
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        // init marginVertical
        if (this.props.marginVertical && this.props.marginVertical != this.style.marginVertical) {
            this.style.marginVertical = this.props.marginVertical
        }
        // init marginHorizontal
        if (this.props.marginHorizontal && this.props.marginHorizontal != this.style.marginHorizontal) {
            this.style.marginHorizontal = this.props.marginHorizontal
        }
        // init borderRadius
        if (this.props.borderRadius && this.props.borderRadius != this.style.borderRadius) {
            this.style.borderRadius = this.props.borderRadius
        }
        // init borderWidth
        if (this.props.borderWidth && this.props.borderWidth != this.style.borderWidth) {
            this.style.borderWidth = this.props.borderWidth
        }
        // init borderColor
        if (this.props.borderColor && this.props.borderColor != this.style.borderColor) {
            this.style.borderColor = this.props.borderColor
        }
        // init headerTxtSize
        if (this.props.headerTxtSize && this.props.headerTxtSize != this.style.headerTxtSize) {
            this.style.headerTxtSize = this.props.headerTxtSize
        }
        // init headerTxtColor
        if (this.props.headerTxtColor && this.props.headerTxtColor != this.style.headerTxtColor) {
            this.style.headerTxtColor = this.props.headerTxtColor
        }
        // init headerFontStyle
        if (this.props.headerFontStyle && this.props.headerFontStyle != this.style.headerFontStyle) {
            this.style.headerFontStyle = this.props.headerFontStyle
        }
        // init headerFontWeight
        if (this.props.headerFontWeight && this.props.headerFontWeight != this.style.headerFontWeight) {
            this.style.headerFontWeight = this.props.headerFontWeight
        }
        // init headerFontFamily
        if (this.props.headerFontFamily && this.props.headerFontFamily != this.style.headerFontFamily) {
            this.style.headerFontFamily = this.props.headerFontFamily
        }
        // init contentTxtSize
        if (this.props.contentTxtSize && this.props.contentTxtSize != this.style.contentTxtSize) {
            this.style.contentTxtSize = this.props.contentTxtSize
        }
        // init contentTxtColor
        if (this.props.contentTxtColor && this.props.contentTxtColor != this.style.contentTxtColor) {
            this.style.contentTxtColor = this.props.contentTxtColor
        }
        // init contentFontStyle
        if (this.props.contentFontStyle && this.props.contentFontStyle != this.style.contentFontStyle) {
            this.style.contentFontStyle = this.props.contentFontStyle
        }
        // init contentFontWeight
        if (this.props.contentFontWeight && this.props.contentFontWeight != this.style.contentFontWeight) {
            this.style.contentFontWeight = this.props.contentFontWeight
        }
        // init contentFontFamily
        if (this.props.contentFontFamily && this.props.contentFontFamily != this.style.contentFontFamily) {
            this.style.contentFontFamily = this.props.contentFontFamily
        }
    }

    _initData() {
        // init headerTxtValue
        if (this.props.headerTxtValue && this.props.headerTxtValue != this.data.headerTxt) {
            this.data.headerTxt = this.props.headerTxtValue
        }
        // init contentTxtValue
        if (this.props.contentTxtValue && this.props.contentTxtValue != this.data.contentTxt) {
            this.data.contentTxt = this.props.contentTxtValue
        }
    }

    render() {
    //   console.log("render");
        this._initStyle()
        this._initData()

        const containerStyle = {
            height: this.style.height,
            width: this.style.width
        }
        const headerTextStyle = {
            fontFamily: this.style.headerFontFamily,
            color: '#909090',
            fontSize: width * 0.33,
            paddingTop: 10,
        }
        const contentTextStyle = {
            fontFamily: 'Poppins-Semibold',
            color: this.props.darkMode? '#a4b6cc' : '#3C4755',
            fontSize: width * 0.04,
            fontWeight: 'bold'
        }
        const descTextStyle = {
            color: this.props.darkMode? '#a4b6cc' : '#3C4755',
            fontSize: width * 0.033,
        }
        return (
            <View style={[styles.container, containerStyle]}>
                {/* header */}
                {/* content */}
                <View style={styles.contentTxt}>
                    <Text
                        allowFontScaling={false}
                        style={
                            contentTextStyle
                            }>
                        {this.data.contentTxt}
                    </Text>
                </View>
                <View style={styles.contentTxt}>
                    <Text allowFontScaling={false} numberOfLines = { 2 } ellipsizeMode = 'tail'
                        style={
                            descTextStyle
                            }>
                        {this.props.description?(this.props.description.length>100?this.props.description:this.props.description):''}
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
    },
    headerTxt: {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 2, // make space between header and content
        marginLeft: 0,
    },
    contentTxt: {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
    }
})

export default News_ListItemDetail
