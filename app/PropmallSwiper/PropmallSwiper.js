import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  ImageBackground, 
  TouchableOpacity,
  TextInput,
  FlatList,
  AsyncStorage  
} from 'react-native';
import Swiper from 'react-native-swiper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HeaderBackButton } from 'react-navigation';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading';
import styles from './PropmallSwiperStyle.js';

const HOSTNAME  = 'https://alice.edgeprop.my/api/user/v1/save-search' 

export default class PropmallSwiper extends Component {
  constructor(props) {
      super(props);
      this.state = {
        data: [] ,
        hasError: false,
        userInfo: {} ,
        hasUpdateError: false,
        success: false,
        index : 0            
      };
      this._formtTypes = this._formtTypes.bind(this)
      this._dots = this._dots.bind(this)
    }
    
    componentDidMount() {
      if(this.props.propertyTypes && this.props.propertyTypes.length > 0) {
        this._formtTypes(this.props.propertyTypes)
      }
    }
    
    handleSwipeIndexChange = index => {
      this.setState({ index });
    };

    _formtTypes(items) {
      let data = []
   console.log('sdaa',items)
      data = items.map((item,i) => {
        //console.log(item.image[0])
        let title = captions = area = beds = price = uri = ''; 
        if(item.area && item.area != '') {
         // console.log(item.area.split(' '))
          let areaArray = item.area.split(' ');
          if(areaArray[0] != '') {
            area = areaArray[0]+' sqft'
          } else {
            area = areaArray[1]+' sqft'
          }
          
        }
        if(item.bed && item.bed != '') {
          beds = item.bed + ' bedrooms'
        }
        if(item.caption && item.caption != '') {
          captions = item.caption
        }
        if(item.price && item.price != '' ) {
          price = this._formatMoney(item.price)
        }
        if(item.type && item.type != '') {
          title = item.type
        }
        if(item.image && item.image.length > 0) {
          uri = item.image[0].cdn_uri?item.image[0].cdn_uri:'https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png'
        }

        return {
          'area'    : area,
          'beds'    : beds,
          'caption' : captions,
          'price'   : price,
          'title'   : title,
          'uri'     : uri
        }
      })
      this.setState({ data })
    }

    _dots() {
     
      let dots = []  
      this.state.data.map((item) => {
         //console.log(item.title)
         dots.push(item.title)
         //return item.title
      })
      return dots
    }

    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) + ' onwards' : '-'
    }
    render() {
     var {height, width} = Dimensions.get('window')
     let dots = this._dots()
     //console.log('ds', this.state.index, dots[this.state.index]);
     return (
          <View style={styles.container}>
            <View style={styles.sectionHeader}>
              <Text allowFontScaling={false} style={styles.propSectionTitle}>Type of Properties</Text>
            </View>
            <Swiper height={ 620 }
              dot={
                <View style={{backgroundColor:'#462B5A', width: 12, height: 12,borderRadius: 6, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />
              }
              activeDot={
                <View style={{backgroundColor:'#FA477B', width: 12, height: 12,borderRadius: 6, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />
              }
              ref={component => this.swiper = component}
              onIndexChanged={this.handleSwipeIndexChange}
              index={this.state.index}
              pagingEnabled={true}
              paginationStyle={{
                top: 120, position: 'absolute', zIndex: 9999
              }} loop>
              {this.state.data.length > 0 && this.state.data.map((item,i) => {
            //  console.log(item)
              // let uri = item.img
                return (
                  <View key={i} >
                    <View style={styles.propImgSliderWrapper}>
                      <Image
                        key={i}
                        style={{ width: width , height : 260, maxHeight: 260, overFlow: 'hidden' }}
                        source={{ uri : item.uri }}
                        resizeMode='contain'
                      />
                    </View>
                    <View style={styles.propContentSliderWrapper}>
                      <View style={styles.propSliderContent}>
                          <Text allowFontScaling={false} style={styles.propSliderTitle}>Type {item.title}</Text>
                          <Text allowFontScaling={false} style={styles.propSliderSubTitle}>{item.caption}</Text>
                        <View>
                          { item.area != '' && (
                          <View style={styles.propTwoWay}>
                            <View style={styles.propListIcon}>
                              <Image
                                style={{width: 22, height: 22 }}
                                source={require('../../assets/icons/p-area.png')}
                              />
                            </View>
                            <View style={styles.propProviderContent}>
                              <Text allowFontScaling={false} style={styles.propTwoWayList}>{item.area}</Text>
                            </View>
                          </View>
                          )}
                          {item.beds != '' && (
                          <View style={styles.propTwoWay}>
                            <View style={styles.propListIcon}>
                              <Image
                                style={{width: 26, height: 22 }}
                                source={require('../../assets/icons/p-bed.png')}
                              />
                            </View>
                            <View style={styles.propProviderContent}>
                              <Text allowFontScaling={false} style={styles.propTwoWayList}>{item.beds}</Text>
                            </View>
                          </View>
                          )}
                          {item.price != '' && (
                            <View style={styles.propTwoWay}>
                              <View style={styles.propListIcon}>
                                <Image
                                  style={{width: 28, height: 16}}
                                  source={require('../../assets/icons/p-money.png')}
                                />
                              </View>
                              <View style={styles.propProviderContent}>
                                <Text allowFontScaling={false} style={styles.propTwoWayList}>{item.price}</Text>
                              </View>
                            </View>
                          )}
                        </View>
                        <View style={styles.interestButtonWrapper}>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
            </Swiper>
          </View>   
        );
      }
}