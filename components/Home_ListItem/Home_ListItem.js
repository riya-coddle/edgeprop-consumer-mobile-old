import React, { Component } from 'react';
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
} from 'react-native'
import PropTypes from 'prop-types'
import Home_ListItemDetail from '../Home_ListItemDetail/Home_ListItemDetail'
import ImageSlider from '../Common_ImageSlider/Common_ImageSlider.js'
import TenureOptions from '../../assets/json/Search_Data/TenureOptions.json'

const {height, width} = Dimensions.get('window');
const itemWidth = (width - 26) / 2;

class Home_ListItem extends Component {
    imagesData = []
    constructor(props) {
        super(props)

        this._onPress = this._onPress.bind(this)

        this.style = {
            // default value
            backgroundColor: '#f1f5f8',
            borderRadius: 0,
            borderWidth: 0,
            borderColor: '#fff',
            fontFamily: 'Poppins',
            imageWidth:178,
            imageHeight:105,
        }
        // data for listItemDetail
        this.item = {
            headerTextValue: '',
            subjectTextValue: '',
            contentTextValue: '',
            image: null,
        }
    }


    _initStyle(){
        // init backgroundColor
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
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
        // init fontFamily
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        // init imageWidth
        if (this.props.imageWidth && this.props.imageWidth != this.style.imageWidth) {
            this.style.imageWidth = this.props.imageWidth
        }
        // init imageHeight
        if (this.props.imageHeight && this.props.imageHeight != this.style.imageHeight) {
            this.style.imageHeight = this.props.imageHeight
        }
    }
    _initItem() {
    if(this.props.item){
        this.item = this.props.item
          //console.log('property',this.item)
          /*this.item.asking_price = this.item.field_prop_asking_price? (this.item.field_prop_asking_price.und? (this.item.field_prop_asking_price.und[0]? this._formatMoney(this.item.field_prop_asking_price.und[0].value): ''): '') : '';
          this.item.bedrooms = this.item.field_prop_bedrooms? (this.item.field_prop_bedrooms.und? (this.item.field_prop_bedrooms.und[0]? this.item.field_prop_bedrooms.und[0].value: 0): 0) : 0;
          this.item.bathrooms = this.item.field_prop_bathrooms? (this.item.field_prop_bathrooms.und? (this.item.field_prop_bathrooms.und[0]? this.item.field_prop_bathrooms.und[0].value: 0): 0) : 0;
          this.item.street = this.item.field_prop_street? (this.item.field_prop_street.und? (this.item.field_prop_street.und[0]? this.item.field_prop_street.und[0].value: '') : '') : '';
          this.item.tenure = this._tenureValue(this.item.field_prop_lease_term)
          this.item.postcode = this.item.field_prop_postcode? (this.item.field_prop_postcode.und? (this.item.field_prop_postcode.und[0]? this.item.field_prop_postcode.und[0].value: '') : '') : '';
          this.item.year_completed = this.item.field_completion_year? (this.item.field_completion_year.und? (this.item.field_completion_year.und[0]? (this.item.field_completion_year.und[0].value): ''): '') : '';
          this.item.land_area = this.item.field_prop_land_area? (this.item.field_prop_land_area.und? (this.item.field_prop_land_area.und[0]? this.item.field_prop_land_area.und[0].value: '') : '') : '';
          this.item.images = this.item.field_prop_images? (this.item.field_prop_images.und? this.item.field_prop_images.und: []) :[];
          */
    }
    //console.log(this.item);
   }

   _formatNumber(num) {
       return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
   }

   _formatMoney(val) {
       return val ? 'RM ' + this._formatNumber(val) : '-'
   }

   _tenureValue(data){
       let value = data.und? (data.und[0]? data.und[0].value: ''): '';
       let tenure = TenureOptions.filter(tenure => tenure.id == value);
       return tenure[0]? tenure[0].value: '';
   }
   _onPress() {
       if (this.props.onPress) {
           //console.log('press', this.props);
           this.props.onPress()
       }
   }

   _handleEmptyvalue(value){
       if(value ==null || value == '' || value == 'Uncompleted'){
           return ''
       }
       return value
   }

   shouldComponentUpdate(nextProps, nextState){
     return (JSON.stringify(nextProps.item) !== JSON.stringify(this.item))
   }

    render() {
        this._initStyle()
        this._initItem()
        for(i =0 ; i<1 ; i++){
            var item = {
              image: this.item.images[0]
             // title: '',
            }
          this.imagesData.push(item)
        }
        //Alert.alert("hoam"+width);
        //Alert.alert('wew'+this.item.headerTextValue)
        var content =  this._handleEmptyvalue(this.item.street) +  this._handleEmptyvalue(this.item.postcode)
         +'\n'
         + ((this.item.year_completed != undefined && this.item.year_completed.length>0)? (this._handleEmptyvalue(this.item.year_completed) + (' \xB7 ')) : "")
        + ((this.item.tenure != undefined && this.item.tenure.length>0)? (this._handleEmptyvalue(this.item.tenure) + (' \xB7 ')) : "")  + this._handleEmptyvalue(this.item.land_area);

        return(
            <View style={{
             // paddingLeft: 23,
              width: itemWidth,
              marginLeft: 5,
              marginRight: 5,
            }}>
                <TouchableOpacity onPress={this._onPress}>
                    <View style={{ width: itemWidth, height: this.style.imageHeight , borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                        <ImageSlider
                          id={`${this.props.id}-imageSlider`}
                          width = {itemWidth}
                          height = {105}
                          data = {this.imagesData}
                          transitionInterval = {1}
                          showInterval = {2}
                          slideInterval = {0.3}
                          overlayText = {true}
                          autoPlay = {false}
                          navigation = {false}
                          showIndex = {0}
                          lazyLoad = {false}>
                        </ImageSlider>
                        {this.props.featured == true && (
                            <View style={{ position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(0,0,0,.5)', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1 }}>
                              <Text style= {{color: '#fff', textTransform: 'uppercase', fontSize: width * 0.030 }}> {this.item.listing_type}</Text>
                             </View>
                        )}
                        {this.props.featured == true && (
                            <View style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,.5)', paddingHorizontal: 5, paddingVertical: 1, borderColor: '#fff', borderWidth: 2, borderRadius: 5}}>
                              <Text style= {{color: '#fff', textTransform: 'uppercase', fontSize: width * 0.030 }}>MUST SEEs</Text>
                             </View>
                         )}
                    </View>
                    <View>
                        <Home_ListItemDetail
                            headerTextValue={this.item.asking_price}
                            subjectTextValue={this.item.title}
                            contentTextValue={content}
                            bedrooms={this.item.bedrooms}
                            bathrooms={this.item.bathrooms}
                            width={itemWidth}
                            totalSqft={this.item.total_sqft}
                            perSqft={this.item.perSqft}
                            />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Home_ListItem
