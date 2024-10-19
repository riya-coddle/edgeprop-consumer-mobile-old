import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
} from 'react-native'

import IconMenu from '../Common_IconMenu/Common_IconMenu'
import HTMLText from '../Common_HTMLText/Common_HTMLText'

export default class Common_CollapsibleText extends Component {
    constructor(props) {
        super(props)
        this.state = {
            measured: false,
            shouldShowViewMore: false,
            showAllText: false,
            isPressed: false,
            isDesc: props.isDesc? true : false
        }
        this._handlePressViewMore = this._handlePressViewMore.bind(this)
        this._handlePressViewLess = this._handlePressViewLess.bind(this)
        this.style = {
            color: '#2D2D2D',
            fontSize: 13,
            fontFamily: 'Poppins-Light',
            alignItems: 'flex-start',
            lineHeight: 20,
            limitedHeight: 200
        }
        this.isRenderGradationLine = false
        this.gradationLine = null
    }

    _initStyle() {
        if (this.props.color && this.props.color != this.style.color) {
            this.style.color = this.props.color
        }
        if (this.props.fontSize && this.props.fontSize != this.style.fontSize) {
            this.style.fontSize = this.props.fontSize
        }
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        if (this.props.alignItems && this.props.alignItems != this.style.alignItems) {
            this.style.alignItems = this.props.alignItems
        }
        if (this.props.lineHeight && this.props.lineHeight != this.style.lineHeight) {
            this.style.lineHeight = this.props.lineHeight
        }
    }

    _handlePressViewMore() {
        this.setState({ showAllText: true, isPressed: true })
    }

    _handlePressViewLess() {
        this.setState({ showAllText: false })
    }

    componentDidUpdate(){
        let {shouldShowViewMore, measured, isPressed, showAllText} = this.state
        if(this.props.onLayoutChange && shouldShowViewMore && measured && isPressed){
            this.props.onLayoutChange(showAllText)
        }
    }

    render() {
        this._initStyle()
        let { measured, showAllText, } = this.state

        let { numberOfLines, } = this.props

        var _renderFooterWithGradationLine = (height, children, divider) => {
            let container = []
            let opacity = 0
            let divisor = divider || height
            level = (height / divisor)
            i = 1
            while (i <= divisor) {
                container.push(
                    (
                        <View
                            key={i}
                            style={{
                                backgroundColor: 'white',
                                width: '100%',
                                height: level,
                                opacity: opacity,
                            }} />
                    )
                )
                i++
                opacity += (1 / divisor)
            }

            this.isRenderGradationLine = true
            this.gradationLine = (
                <View style={{ width: '100%' }}>
                    {container}
                    {children}
                </View>
            )

            return this.gradationLine
        }

        var _renderViewMoreIcon = () => {
            return (
                <View style={[styles.icon, styles.overlay,]} >
                    <IconMenu
                        type={"text"}
                        textValue={"View more"}
                        fontFamily={"Poppins-SemiBold"}
                        textColor={"#488BF8"}
                        textSize={this.style.fontSize}
                        fontStyle={"normal"}
                        onPress={this._handlePressViewMore}
                        paddingHorizontal={1}
                    />
                </View>
            )
        }

        var _renderViewLessIcon = () => {
            return (
                <View style={styles.icon}>
                    <IconMenu
                        type={"text"}
                        textValue={"View less"}
                        fontFamily={"Poppins-SemiBold"}
                        textColor={"#275075"}
                        textSize={this.style.fontSize}
                        fontStyle={"normal"}
                        onPress={this._handlePressViewLess}
                    />
                </View>
            )
        }

        var _renderCollapseControl = () => {
            let { shouldShowViewMore, showAllText, } = this.state

            if (shouldShowViewMore && !showAllText) {
                if (this.props.renderTruncatedFooter) {
                    return this.props.renderTruncatedFooter(this._handlePressViewMore)
                }

                return (
                    <View style={[styles.overlay, { backgroundColor: 'transparent', width: '100%' }]}>
                        {this.isRenderGradationLine ? this.gradationLine : _renderFooterWithGradationLine(150, _renderViewMoreIcon())}
                    </View>
                )
            } 
        }

        // no need render if no string text
        if (!this.props.text) return null

        return (
            <View>
                <Text
                    allowFontScaling={false}
                    style={{
                        color: this.style.color,
                        fontSize: this.style.fontSize,
                        fontFamily: this.style.fontFamily,
                        alignItems: this.style.alignItems,
                        lineHeight: this.style.lineHeight,
                        marginBottom: (measured && !showAllText ? 20 : 0),
                    }}
                    onLayout={(event) => {
                        var { height } = event.nativeEvent.layout
                        this.setState({ measured: true })

                        if (height > this.style.limitedHeight) {
                            this.setState({ shouldShowViewMore: true })
                        }
                    }}
                    numberOfLines={measured && !showAllText ? numberOfLines : 0}>
                    <HTMLText
                      content={this.props.text}
                      fontFamily={'Poppins-Regular'}
                      isDesc={this.state.isDesc}
                    />
                </Text>
                {_renderCollapseControl()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    overlay: {
        left: 0,
        bottom: -5,
        position: 'absolute',
    },
    icon: {
        backgroundColor: 'transparent',
        width: '100%',
        alignItems: 'flex-start',
    }
})
