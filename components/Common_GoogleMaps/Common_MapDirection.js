import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	Platform
} from 'react-native'
import MapView from 'react-native-maps'
import Polyline from '@mapbox/polyline'
import Image from '../../components/Common_Image/Common_Image'

const TIMEOUT = 1000
const GOOGLE_API_KEY = 'AIzaSyAolhQX2D4GawzDjLBvQKhYc2L-YVhK1dE'

export default class Common_MapDirection extends Component {
	constructor(props) {
		super(props)
		this.state = {
			direction: {
				startAddress: '',
				endAddress: '',
				coords: []
			},
		}
		this.travelMode = 'walking'
		this.origin = props.origin || {}
		this.dest = props.dest || {}
		this.style = {
			strokeWidth: 5,
			strokeColor: "#73B1FF",
		}

		this._onChangeDirection = this._onChangeDirection.bind(this)
		this._onError = this._onError.bind(this)
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.state.direction.error) return true
		else if ((JSON.stringify(nextProps.origin) != JSON.stringify(this.props.origin)) ||
			(JSON.stringify(nextProps.dest) != JSON.stringify(this.props.dest)) ||
			nextProps.travelMode != this.props.travelMode ||
			nextProps.originDesc != this.props.originDesc ||
			nextProps.destDesc != this.props.destDesc) return true

		return (JSON.stringify(nextState) != JSON.stringify(this.state))
	}

	async componentDidMount() {
		if (this.props.origin.latitude != undefined && this.props.origin.longitude && this.props.dest.latitude != undefined && this.props.dest.longitude) {
			startLoc = `${this.origin.latitude},${this.origin.longitude}`
			destLoc = `${this.dest.latitude},${this.dest.longitude}`
			let travelMode = this.travelMode
			let direction = await this.getDirection(startLoc, destLoc, travelMode)
			if (!direction.error) {
				this._onChangeDirection(direction.coords)
				this.setState({
					direction: direction,
				})
			}
			else {
				this._onError(direction.error)
			}
		}
	}

	async componentDidUpdate() {
		if (this.props.origin.latitude != undefined &&
			this.props.origin.longitude &&
			this.props.dest.latitude != undefined &&
			this.props.dest.longitude) {
			startLoc = `${this.origin.latitude},${this.origin.longitude}`
			destLoc = `${this.dest.latitude},${this.dest.longitude}`
			let travelMode = this.travelMode
			let direction = await this.getDirection(startLoc, destLoc, travelMode)
			if (!direction.error) {
				this._onChangeDirection(direction.coords)
				this.setState({
					direction: direction,
				})
			}
			else {
				this._onError(direction.error)
			}
		}
	}

	_init() {
		if (this.props.strokeWidth != undefined && this.props.strokeWidth != this.style.strokeWidth) {
			this.style.strokeWidth = this.props.strokeWidth
		}
		if (this.props.strokeColor != undefined && this.props.strokeColor != this.style.strokeColor) {
			this.style.strokeColor = this.props.strokeColor
		}
		if (this.props.travelMode != undefined && this.props.travelMode != this.travelMode) {
			this.travelMode = this.props.travelMode
		}
		if (this.props.origin != undefined && JSON.stringify(this.props.origin) != JSON.stringify(this.origin)) {
			this.origin = this.props.origin
		}
		if (this.props.dest != undefined && JSON.stringify(this.props.dest) != JSON.stringify(this.dest)) {
			this.dest = this.props.dest
		}
		if (this.props.originDesc != undefined && this.props.originDesc != this.originDesc) {
			this.originDesc = this.props.originDesc
		}
		if (this.props.destDesc != undefined && this.props.destDesc != this.destDesc) {
			this.destDesc = this.props.destDesc
		}
	}

	_onChangeDirection(coords) {
		if (this.props.onChangeDirection) {
			let head = coords[0]
			let tail = coords[coords.length - 1]
			let mid = this.getMidPoint(coords)

			this.props.onChangeDirection(head, tail, mid, coords)
		}
	}

	_onError(error) {
		if (this.props.onError) {
			this.props.onError(error)
		}
	}

	async getDirection(startLoc, destinationLoc, travelMode) {
		try {
			let urlDirection = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&mode=${travelMode}&key=${GOOGLE_API_KEY}`
			console.log('urlDirection',urlDirection);
			let coords = []
			let resp = await fetch(urlDirection, {
				method: 'GET',
				timeout: TIMEOUT
			})
			let respJson = await resp.json();
			console.log('respJson',respJson);
			let leg = respJson.routes[0].legs[0]
			let startAddress = leg.start_address
			let endAddress = leg.end_address
			let steps = leg.steps
			for (i = 0; i < steps.length; i++) {
				let step = steps[i]
				let points = Polyline.decode(step.polyline.points)
				for (j = 0; j < points.length; j++) {
					let point = points[j]
					let coord = {
						latitude: point[0],
						longitude: point[1]
					}
					coords.push(coord)
				}
			}

			return { coords: coords, startAddress: startAddress, endAddress: endAddress, error: null }
		} catch (error) {
			console.log(error)
			return { error: error }
		}
	}

	getStartPoint() {
		if (this.state.direction && this.state.direction.coords.length == 0) return null
		return this.state.direction.coords[0]
	}

	getDestPoint() {
		if (!this.state.direction && this.state.direction.coords.length == 0) return null
		return this.state.direction.coords[this.state.direction.coords.length - 1]
	}

	getMidPoint(points) {
		let minX, maxX, minY, maxY

		// init first point
		((point) => {
			minX = point.latitude
			maxX = point.latitude
			minY = point.longitude
			maxY = point.longitude
		})(points[0])

		// calculate rect
		points.map((point) => {
			minX = Math.min(minX, point.latitude)
			maxX = Math.max(maxX, point.latitude)
			minY = Math.min(minY, point.longitude)
			maxY = Math.max(maxY, point.longitude)
		});

		const midX = (minX + maxX) / 2
		const midY = (minY + maxY) / 2
		const deltaX = (maxX - minX)
		const deltaY = (maxY - minY)

		return {
			latitude: midX,
			longitude: midY,
			latitudeDelta: deltaX,
			longitudeDelta: deltaY
		};
	}

	getCoordinates() {
		return this.state.direction.coords
	}

	render() {
		this._init()

		var _renderMarkerForDirection = () => {
			let origin = this.getStartPoint()
			let dest = this.getDestPoint()
			let isAndroid = Platform.OS == 'android'

			if (!origin ||
				!dest ||
				!origin.latitude ||
				!origin.longitude ||
				!dest.latitude ||
				!dest.longitude) return []

			return [
				(
					<MapView.Marker
						image={isAndroid ? this.props.startMarker : null}
						key={'0'}
						coordinate={{ latitude: origin.latitude, longitude: origin.longitude }}>
						{
							isAndroid ? null :
								<Image
									style={{ width: 35, height: 40 }}
									source={this.props.startMarker}
									resizeMode={'contain'} />
						}
						<MapView.Callout
							style={styles.callout}
							tooltip={false}>
							<View style={{ maxWidth: 150 }}>
								<Text
									allowFontScaling={false}
									style={{
										width: '100%',
										fontFamily: 'Poppins-Regular'
									}}>
									{this.state.direction.startAddress}
								</Text>
							</View>
						</MapView.Callout>
					</MapView.Marker>
				),
				(
					<MapView.Marker
						image={isAndroid ? this.props.destMarker : null}
						key={'1'}
						coordinate={{ latitude: dest.latitude, longitude: dest.longitude }}>
						{
							isAndroid ? null :
								<Image
									style={{ width: 35, height: 40 }}
									source={this.props.destMarker}
									resizeMode={'contain'} />
						}
						<MapView.Callout
							style={styles.callout}
							tooltip={false}>
							<View style={{ maxWidth: 150 }}>
								<Text
									allowFontScaling={false}
									style={{
										width: '100%',
										fontFamily: 'Poppins-Regular'
									}}>
									{this.state.direction.endAddress}
								</Text>
							</View>
						</MapView.Callout>
					</MapView.Marker>
				)
			]
		}

		if (!this.state.direction && this.state.direction.coords.length == 0 ||
			!this.origin ||
			!this.dest ||
			!this.origin.latitude ||
			!this.origin.longitude ||
			!this.dest.latitude ||
			!this.dest.longitude) return (<View />)

		return ([
			..._renderMarkerForDirection(),
			(
				<MapView.Polyline
					key={'2'}
					coordinates={this.state.direction.coords}
					strokeWidth={this.style.strokeWidth}
					strokeColor={this.style.strokeColor}
				/>
			)
		]
		)
	}
}

const styles = StyleSheet.create({
	callout: {
		flex: 1,
		...Platform.select({
			ios: { position: 'relative' },
			android: {}
		})
	}
})
