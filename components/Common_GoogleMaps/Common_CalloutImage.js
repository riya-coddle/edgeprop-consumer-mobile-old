import React, { Component } from 'react'
import {
  View,
  Text,
  WebView
} from 'react-native'

export default class Common_CalloutImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isError: false
    }
    this.style = {
      width: 50,
      height: 50
    }
    this.source = 'https://sg.tepcdn.com/s3fs-public/styles/project_image_medium/public/default_images/no_img.png'
    this._handleError = this._handleError.bind(this)
  }

  _init() {
    if (this.props.width != undefined && this.props.width != this.style.width) {
      this.style.width = this.props.width
    }
    if (this.props.height != undefined && this.props.height != this.style.height) {
      this.style.height = this.props.height
    }
    if (this.props.source != undefined && this.props.source != this.source) {
      this.source = this.props.source
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.source != this.source)
  }

  _handleError() {
    this.setState({
      isError: true
    })
  }

  render() {
    this._init()
    // if (this.state.isError) return <View />
    // var _renderError = () => <View />

    return <View/>
    
    return (
      <WebView
        // onError={this._handleError}
        // renderError={() => _renderError()}
        source={{
          html: `<img src="${this.source}" style="height:${this.style.height}px;width:${this.style.width}px"/>`
        }}
        style={{
          width: this.style.width,
          height: this.style.height,
          backgroundColor: 'rgba(0,0,0,0)',
          opacity: 1
        }}
      />
    )
  }
}