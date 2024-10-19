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
import styles from './EditorNewsItemStyle.js'
const {height, width} = Dimensions.get('window');
const itemWidth = (width - 26) / 2;

class EditorNewsItem extends Component {
    imagesData = []
    launchData = []
    constructor(props) {
        super(props)
        this.state = {
           indexPosition: 0,
        }
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
   getPriceData(num) {
      if(num.length > 0) {
        switch(num.length) {
            case 1:
                return num;
                break;
            case 2:
                return num;
                break;
            case 3:
                return num;
                break;
            case 4:
                return num.charAt(0)+'K and above';
                break;
            case 5:
                return num.charAt(0)+num.charAt(1)+'K and above';
                break;
            case 6:
                return num.charAt(0)+'M and above';
                break;
            case 7:
                return num.charAt(0)+num.charAt(1)+'M and above';
                break;
            case 8:
                return num.charAt(0)+num.charAt(1)+'M and above';
                break;
            case 9:         
                return num.charAt(0)+num.charAt(1)+num.charAt(2)+'M and above';
                break;
            case 10:
                return num.charAt(0)+'B and above';
                break;        
            default:
                return 'Invalid';
        }
      }
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
           this.props.onPress();
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
        //Alert.alert("hoam"+width);
        //Alert.alert('wew'+this.item.headerTextValue)
        if(this.props.isEditor){
	        for(i =0 ; i<1 ; i++){
	            var item = {
	              image: this.item.image_original
	            }
	          this.imagesData.push(item)
	        }
    	} 
    	if(!this.props.isEditor) {
    		for(i =0 ; i<1 ; i++){
	            var item = {
	              image: this.item.field_prop_images_txt[0]
	            }
	          this.launchData.push(item)
	        }
    	}
        var content =  this._handleEmptyvalue(this.item.street) +  this._handleEmptyvalue(this.item.postcode)
         +'\n'
         + ((this.item.year_completed != undefined && this.item.year_completed.length>0)? (this._handleEmptyvalue(this.item.year_completed) + (' \xB7 ')) : "")
        + ((this.item.tenure != undefined && this.item.tenure.length>0)? (this._handleEmptyvalue(this.item.tenure) + (' \xB7 ')) : "")  + this._handleEmptyvalue(this.item.land_area);

    	var {height, width} = Dimensions.get('window')
    	const monthNames = ["January", "February", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
		  ];
		  let publishedDate = '';
    	if(this.item.publishdate_react) {
    		var date  = new Date( this.item.publishdate_react * 1000 ).getDate();
    		var month = monthNames[new Date( this.item.publishdate_react * 1000 ).getMonth()];
    		var year  = new Date( this.item.publishdate_react * 1000 ).getFullYear();

    		publishedDate = month+' '+date+', '+year;
    	}
      let priceFrom = 0;
      if(this.item.field_prop_asking_price_d) {
        priceFrom = this.getPriceData(this.item.field_prop_asking_price_d.toString());
      }
      let desc = '';
      if(this.props.isEditor) {
        desc = this.props.item.desc?(this.props.item.desc.length>100?this.props.item.desc:this.props.item.desc):''
      } else {
        desc = this.props.item.field_listing_slogan_s_lower?(this.props.item.field_listing_slogan_s_lower.length>100?this.props.item.field_listing_slogan_s_lower:this.props.item.field_listing_slogan_s_lower):''
      }
        return(
            <View style={{
              marginLeft: 5,
              marginRight: 5,
             //paddingLeft: 23,
            }}>
            <TouchableOpacity onPress= {this._onPress} style={styles.sliderContainer}>
                <View style={{ borderRadius: 3, overflow: 'hidden'}}>
                    <ImageSlider
                          id={`${this.props.id}-imageSlider`}
                          width = {width*0.85}
                          height = {width*0.5}
                          data = {this.props.isEditor?this.imagesData:this.launchData}
                          style={styles.imageSlider}
                          transitionInterval = {1}
                          showInterval = {2}
                          slideInterval = {0.3}
                          overlayText = {true}
                          autoPlay = {false}
                          navigation = {false}
                          handleNavigation = {this._onPress}
                          showIndex = {0}
                          lazyLoad = {false}
                          resizeMode = {"cover"}>
                    </ImageSlider>
                </View>
               {/* <Text allowFontScaling={false} style={styles.labelStyle}>{this.props.isEditor?"EDITOR'S PICK":''}</Text> */}
                <View style={styles.info}>    
                  <Text allowFontScaling={false} style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: width * 0.038,
                    fontWeight: 'bold',
                    lineHeight: 23,
                    color: "#414141"
                  }}>{this.props.isEditor?this.props.item.title:this.props.item.title_t.toUpperCase()}</Text>
                  <Text 
                    allowFontScaling={false}
                    numberOfLines = { 2 } 
                    ellipsizeMode = 'tail'
                    style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: width * 0.03,
                    lineHeight: 23,
                    width: 'auto',
                    color: "#909090",
                  }}>{desc}</Text>
                </View>
                {this.props.isEditor && (
                  <Text allowFontScaling={false} style={styles.labelStyle}>{publishedDate}</Text>
                )}
                {!this.props.isEditor && (
                  <Text allowFontScaling={false} style={styles.priceStyle}>{'RM '+priceFrom}</Text>
                )}
                </TouchableOpacity>
            </View>
        )
    }
}

export default EditorNewsItem;
