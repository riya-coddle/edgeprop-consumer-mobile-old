import React, { Component } from 'react'
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Alert
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import ListingDetailLocation from './ListingDetailLocation'
import ListingDetailSearchLocation from './ListingDetailSearchLocation'
import ListingDetailSearchDirection from './ListingDetailSearchDirection'
import Loading from '../../components/Common_Loading/Common_Loading'

const HOSTNAME = "https://www.edgeprop.sg"
const PROXY_URL = "/proxy?url="
const API_DOMAIN = "https://www.edgeprop.sg"
const API_DOMAIN_2 = "https://api.theedgeproperty.com.sg";
const API_GET_LISTING_DETAILS = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/getListingDetail.php?")
const API_GET_LISTING_DETAILS_FULL = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN_2 + "/listings/getlistingdetailsfull?type=web");
const API_GET_LISTING_AMENITIES = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN_2 + "/listings/amenities?")
const TIMEOUT = 1000

const stackScreens = {
	ListingDetailLocation: { screen: ListingDetailLocation },
	ListingDetailSearchLocation: { screen: ListingDetailSearchLocation },
	ListingDetailSearchDirection: { screen: ListingDetailSearchDirection }
}

const StackNav = StackNavigator(stackScreens, {
	headerMode: 'none',
	navigationOptions: {
		headerVisible: false,
	},
	initialRouteName: 'ListingDetailLocation', // set inital route
})

class ListingDetailLocationNav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			listingDetail: {},
			destinations: [],
			didMount: false
		}
		this._callAPI = this._callAPI.bind(this)
	}

	async componentDidMount() {
		let nid = 652613;//this.props.navigation.state.params.data.nid
		let listingDetailURL = API_GET_LISTING_DETAILS_FULL + encodeURIComponent('&nid=' + nid)
		let listingAmenitiesURL = API_GET_LISTING_AMENITIES + encodeURIComponent('nid=' + nid)
		let listingDetail = await this._callAPI(listingDetailURL)
		let destinations = await this._callAPI(listingAmenitiesURL)

		this.setState({
			listingDetail: listingDetail.response,
			destinations: this._handleSamePositionMarker(destinations.response),
			didMount: true
		})
	}

	async _callAPI(apiUrl) {
		let resp = await fetch(apiUrl)
		let respJson = await resp.json();
		return respJson
	}

	_handleSamePositionMarker(data, lat = 0.00001, lon = 0.000005) {
		if (!data) return null
		for (var index = 0; index < data.length; index++) {
			for (var result = 0; result < index; result++) {
				if (Math.abs(data[index].lat - data[result].lat) <= lat
					|| Math.abs(data[index].lon - data[result].lon) <= lon) {
					data[index].lat += lat;
					data[index].lon += lon;
				}
			}
		}
		return data;
	}

	render() {
		if (!this.state.didMount) return <Loading/>
		return (<StackNav screenProps={this.state} />)
	}
}

export default ListingDetailLocationNav
