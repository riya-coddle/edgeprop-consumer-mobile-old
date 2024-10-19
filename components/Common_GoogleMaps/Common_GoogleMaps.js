import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	TouchableHighlight,
	Text,
	Platform
} from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import MapMarker from './Common_MapMarker'
import MapDirection from './Common_MapDirection'
import CalloutImage from './Common_CalloutImage'

class Common_GoogleMaps extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isMapReady: false
		}
		this.mapRef = null
		this.latitude =  1.352083
		this.longitude = 103.819836
		this.latitudeDelta = 0.22000000000000003
		this.longitudeDelta = 0.20999999999999996
		this.minZoomLevel = 10
		this.maxZoomLevel = 20
		this.zoomLevel = this._getZoomLevel(this.longitudeDelta)
		this._onMapready = this._onMapready.bind(this)
		this._onRegionChange = this._onRegionChange.bind(this)
		this._onPress = this._onPress.bind(this)
		this._onLongPress = this._onLongPress.bind(this)
		this._zoomIn = this._zoomIn.bind(this)
		this._zoomOut = this._zoomOut.bind(this)
	}

	_onPress(e) {
		if (this.props.onPress) {
			this.props.onPress(e.nativeEvent.coordinate)
		}
	}

	_onLongPress(evt) {
		if (this.props.onLongPress) {
			this.props.onLongPress(evt.nativeEvent)
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.region != undefined) {
			this.latitude = nextProps.region.latitude || this.latitude
			this.longitude = nextProps.region.longitude || this.longitude
			this.latitudeDelta = nextProps.region.latitudeDelta || this.latitudeDelta
			this.longitudeDelta = nextProps.region.longitudeDelta || this.longitudeDelta
		}
	}

	_onMapready() {
		// uncomment this if u want to reload component after map is already
		// this.setState({
		// 	isMapReady: true
		// })
		if (this.props.onMapReady) {
			this.props.onMapReady()
		}
	}

	_onRegionChange(preregion) {
		let region = {
			...preregion,
			zoomLevel: this._getZoomLevel(preregion.longitudeDelta)
		}
		this.latitude = region.latitude
		this.longitude = region.longitude
		this.latitudeDelta = region.latitudeDelta
		this.longitudeDelta = region.longitudeDelta
		this.zoomLevel = region.zoomLevel


		if (this.props.onRegionChangeComplete) {
			this.props.onRegionChangeComplete(region)
		}
	}

	_getZoomLevel(longitudeDelta) {
		return (
			Math.round(Math.log(360 / longitudeDelta) / Math.LN2)
		)
	}

	_zoomIn() {
		let latitudeDelta = this.latitudeDelta / 2
		let longitudeDelta = this.longitudeDelta / 2
		if (latitudeDelta >= 0.00001 && longitudeDelta >= 0.00001) {
			this.latitudeDelta = latitudeDelta
			this.longitudeDelta = longitudeDelta
			this.mapRef.animateToRegion({
				latitude: this.latitude,
				longitude: this.longitude,
				latitudeDelta: this.latitudeDelta,
				longitudeDelta: this.longitudeDelta
			});
		}
	}

	_zoomOut() {
		let latitudeDelta = this.latitudeDelta * 2
		let longitudeDelta = this.longitudeDelta * 2
		if (latitudeDelta <= 1 && longitudeDelta <= 1) {
			this.latitudeDelta = latitudeDelta
			this.longitudeDelta = longitudeDelta
			this.mapRef.animateToRegion({
				latitude: this.latitude,
				longitude: this.longitude,
				latitudeDelta: this.latitudeDelta,
				longitudeDelta: this.longitudeDelta
			});
		}
	}

	getRegion() {
		return {
			latitude: this.latitude,
			longitude: this.longitude,
			latitudeDelta: this.latitudeDelta,
			longitudeDelta: this.longitudeDelta
		}
	}

	animateToRegion(region, duration) {
		this.mapRef.animateToRegion(region, duration)
	}

	fitToCoordinates(coords, options) {
		this.mapRef.fitToCoordinates(coords, options)
	}

	_init() {
		if (this.props.region != undefined) {
			this.latitude = this.props.region.latitude
			this.longitude = this.props.region.longitude
			this.latitudeDelta = this.props.region.latitudeDelta
			this.longitudeDelta = this.props.region.longitudeDelta
			this.zoomLevel = this.props.region.zoomLevel
		}
		if (this.props.minZoomLevel != undefined && this.props.minZoomLevel != this.minZoomLevel) {
			this.minZoomLevel = this.props.minZoomLevel
		}
		if (this.props.maxZoomLevel != undefined && this.props.maxZoomLevel != this.maxZoomLevel) {
			this.maxZoomLevel = this.props.maxZoomLevel
		}
	}

	render() {
		this._init()
		return (
			<View style={{ width: '100%' }}>
				<MapView
					{...this.props}
					onMapReady={this._onMapready}
					onRegionChangeComplete={this._onRegionChange}
					ref={(ref) => this.mapRef = ref}
					style={this.props.mapStyle}
					minZoomLevel={this.minZoomLevel}
					maxZoomLevel={this.maxZoomLevel}
					zoomEnabled={true} //pinch in and out
					//zoomControlEnabled={true} //[Android only] to make button control
					provider={PROVIDER_GOOGLE}
					initialRegion={{
						latitude: this.latitude,
						longitude: this.longitude,
						latitudeDelta: this.latitudeDelta,
						longitudeDelta: this.longitudeDelta
					}}
					onPress={this._onPress}
					onLongPress={this._onLongPress}>
					{this.props.children}
				</MapView>
				<View
					style={{
						// display: (Platform.OS == 'ios' ? 'flex' : 'none'), // uncomment this if u want use only in ios
						position: 'absolute',
						top: 10,
						right: 20,
						width: 35,
						height: 70,
						justifyContent: 'center',
						backgroundColor: '#ffff',
						borderRadius: 2,
						borderColor: 'rgba(0,0,0,0.11)',
						borderWidth: 1,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.8,
						shadowRadius: 2,
						elevation: 1
					}}>
					<TouchableHighlight
						underlayColor={'rgb(255,255,255)'}
						onPress={this._zoomIn}
					>
						<Text allowFontScaling={false} style={{
							includeFontPadding: false,
							textAlign: 'center',
							fontFamily: 'Poppins-Bold',
							fontSize: 23,
							color: '#4f4e4e'
						}}>
							{'+'}
						</Text>
					</TouchableHighlight>
					<View style={{ paddingHorizontal: 6, flexDirection: 'row' }}>
						<View
							style={{
								borderColor: '#e8e8e8',
								borderWidth: 0.5,
								flex: 1,
							}} />
					</View>
					<TouchableHighlight
						underlayColor={'rgb(255,255,255)'}
						onPress={this._zoomOut}>
						<Text allowFontScaling={false} style={{
							includeFontPadding: false,
							textAlign: 'center',
							fontFamily: 'Poppins-Bold',
							fontSize: 23,
							color: '#4f4e4e'
						}}>
							{'-'}
						</Text>
					</TouchableHighlight>
				</View>
			</View>
		)
	}
}

Common_GoogleMaps.Marker = MapMarker;
Common_GoogleMaps.Polyline = MapView.Polyline;
Common_GoogleMaps.Polygon = MapView.Polygon;
Common_GoogleMaps.Circle = MapView.Circle;
Common_GoogleMaps.UrlTile = MapView.UrlTile;
Common_GoogleMaps.LocalTile = MapView.LocalTile;
Common_GoogleMaps.Overlay = MapView.Overlay;
Common_GoogleMaps.Callout = MapView.Callout;
Common_GoogleMaps.Direction = MapDirection;
Common_GoogleMaps.CalloutImage = CalloutImage;

export default Common_GoogleMaps