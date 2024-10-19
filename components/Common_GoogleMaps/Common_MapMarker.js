import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	TouchableHighlight
} from 'react-native'
import MapView from 'react-native-maps'

export default class Common_MapMarker extends Component {
	constructor(props) {
		super(props)
		this.coordinate = props.coordinate
		this._onPress = this._onPress.bind(this)
		this._onLongPress = this._onLongPress.bind(this)
		this.markerRef = null
	}

	componentDidMount() {
		if (this.props.isShowCallout != undefined) {
			if (this.props.isShowCallout) this.showCallout()
		}
		if (this.props.isHideCallout != undefined) {
			if (this.props.isHideCallout) this.hideCallout()
		}
	}

	componentDidUpdate() {
		if (this.props.isShowCallout != undefined) {
			if (this.props.isShowCallout) this.showCallout()
		}
		if (this.props.isHideCallout != undefined) {
			if (this.props.isHideCallout) this.hideCallout()
		}
	}

	_onPress() {
		if (this.props.onPress) {
			this.props.onPress(this.latitude, this.longitude)
		}
	}

	_onLongPress() {
		if (this.props.onLongPress) {
			this.props.onLongPress(this.latitude, this.longitude)
		}
	}

	_init() {
		if (this.props.coordinate != undefined && JSON.stringify(this.props.coordinate) != JSON.stringify(this.coordinate)) {
			this.coordinate = this.props.coordinate
		}
	}

	showCallout() {
		this.markerRef.showCallout()
	}

	hideCallout() {
		this.markerRef.hideCallout()
	}

	render() {
		this._init()

		return (
			<MapView.Marker
				// {...this.props}
				ref={(ref) => this.markerRef = ref}
				image={this.props.image}
				coordinate={this.coordinate}
				stopPropagation={this.props.stopPropagation}
				onPress={this._onPress}>
				{this.props.children}
			</MapView.Marker>
		)
	}
}