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

const HOSTNAME = "https://prolex.edgeprop.my"
const HOSTNAME2 = "https://www.edgeprop.my"
const API_DOMAIN = "/getAmenitiesNearBy/"
const API_DOMAIN_2 = "/api/v1/fetchOne";
//const API_GET_LISTING_DETAILS = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/getListingDetail.php?")
const API_GET_LISTING_DETAILS_FULL = HOSTNAME + API_DOMAIN_2;
const API_GET_LISTING_AMENITIES = HOSTNAME2 + API_DOMAIN;
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
			didMount: false,
			showNearBy: false,
			calcFun: props.calcFun
		}
		this._callAPI = this._callAPI.bind(this);
		this._constructData = this._constructData.bind(this);
	}

	async componentDidMount() {
		//console.log('did mount');
		let nid = '652613';//this.props.navigation.state.params.data.nid
		let property_id = this.props.navigation.state.params.data.property_id;
        let key = this.props.navigation.state.params.data.key;
        let listing_type = this.props.navigation.state.params.data.listing_type;
        let uid = this.props.navigation.state.params.data.uid;
        let param = "type="+key+"&property_id="+property_id+"&field_prop_listing_type="+listing_type;
		let listingDetailURL = API_GET_LISTING_DETAILS_FULL

		let listingDetail = await this._callAPI(listingDetailURL,'listingDetail',1,param)
		//console.log('listingDetail', listingDetail);
		if(listingDetail.status_code ==0){
			Alert.alert('Oops', listingDetail.message);
			this.props.navigation.goBack()
		}
		this._constructData(listingDetail.result,property_id,key)
	}

	async _constructData(result,property_id,key){
		let locationDetails = {
            title: result.title,
            lat: result.field_geo_lat_lng? (result.field_geo_lat_lng.und? (result.field_geo_lat_lng.und[0] ? Number(result.field_geo_lat_lng.und[0].lat) : 0): 0) : 0,
            lon: result.field_geo_lat_lng? (result.field_geo_lat_lng.und? (result.field_geo_lat_lng.und[0] ? Number(result.field_geo_lat_lng.und[0].lng) : 0): 0) : 0,
			listing_type: result.field_prop_listing_type? (result.field_prop_listing_type.und? (result.field_prop_listing_type.und[0] ? result.field_prop_listing_type.und[0].value : ''): '') : '',
			property_id: property_id,
			key: key
        }
		//console.log('locationDetails',locationDetails);
		if( locationDetails.lat && locationDetails.lon){
			let listingAmenitiesURL = API_GET_LISTING_AMENITIES+locationDetails.lat+'/'+locationDetails.lon+'/2000'
			let destinations = await this._callAPI(listingAmenitiesURL,'destinations',0)
			//console.log('destinations',destinations);
			let positions = this._handleSamePositionMarker(destinations)
			if(this.props.calcFun){
				let list = positions.map(item => item.type)
                                      .filter((value, index, self) => self.indexOf(value) === index);
				this.props.calcFun(list);
			}

			this.setState({
				listingDetail: locationDetails,
				destinations: positions,
				didMount: true,
				showNearBy: this.props.showNearBy != false?true:false
			})
		}
		//console.log('check 1',this.state.listingDetail);
		//console.log('check 2',this.state.destinations);
	}

	async _callAPI(apiUrl,stateName,flag,params) {
		//console.log('apiUrl',apiUrl);
		let resp = '';
		if(flag){
			resp = await fetch(apiUrl,
				{
					method: 'POST',
					headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
					body: params
				})
		}else{
			resp = await fetch(apiUrl)
		}
		let respJson = await resp.json();
		return respJson
	}

	_handleSamePositionMarker(data, lat = 0.00001, lon = 0.000005) {
		if (!data) return null
		for (var index = 0; index < data.length; index++) {
			for (var result = 0; result < index; result++) {
				if (Math.abs(data[index].lat - data[result].lat) <= lat
					|| Math.abs(data[index].lon - data[result].lon) <= lon) {
					data[index].lat = Number(data[index].lat)+lat;
					data[index].lon = Number(data[index].lon) + lon;
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
