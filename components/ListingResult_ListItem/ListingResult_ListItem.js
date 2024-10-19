import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert
} from 'react-native'
import ListingResult_ListItemDetail from '../ListingResult_ListItemDetail/ListingResult_ListItemDetail'
import ImageSlider from '../Common_Swiper/Common_Swiper'
import IconMenu from '../Common_IconMenu/Common_IconMenu'

const { height, width } = Dimensions.get('window');
const itemWidth = width;

class ListingResult_ListItem extends Component {
    constructor(props) {
        super(props)

        this._onPress = this._onPress.bind(this)

        this.style = {
            // default value
            backgroundColor: '#f1f5f8',
            borderColor: '#fff',
            width: '100%',
        }
        // data for listItemDetail
        this.item = {
            listingId: null,
            isBookmark: false,
            agentName: null,
            proAgent: null,
            agentPhoto: "https://sg.tepcdn.com/images/avatar.png",
            agentMobile: null,
            exclusive: false,
            images: null,
            itemDetail: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps.item) !== JSON.stringify(this.item))
    }

    _init() {
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        if (this.props.width && this.props.width != this.style.width) {
            this.style.width = this.props.width
        }
        if (this.props.item) {
                item = this.props.item
                this.item.listingId = item.listingId,
                this.item.isBookmark = false
                if(item.isBookmark!=undefined){
                  this.item.isBookmark = item.isBookmark
                }
                this.item.agentID = item.agentID || this.item.agentID,
                this.item.agentName = item.agentName || this.item.agentName,
                this.item.proAgent = item.proAgent || this.item.proAgent,
                this.item.agentPhoto = item.agentPhoto || this.item.agentPhoto,
                this.item.agentMobile = item.agentMobile || this.item.agentMobile,
                this.item.exclusive = item.exclusive || this.item.exclusive,
                this.item.images = item.images || this.item.images,
                this.item.itemDetail = {
                    askingPrice: item.askingPrice,
                    askingPriceType: item.askingPriceType,
                    title: item.title,
                    bedrooms: item.bedrooms,
                    bathrooms: item.bathrooms,
                    district: item.district,
                    streetName: item.streetName,
                    propertySubType: item.propertySubType,
                    askingPriceUnitPsf: item.askingPriceUnitPsf,
                    floorAreaSqft: item.floorAreaSqft,
                    floorAreaSqm: item.floorAreaSqm,
                    postalCode: item.postalCode,
                    yearCompleted: item.yearCompleted,
                    tenure: item.tenure,
                    belowEfvPercentage: item.belowEfvPercentage,
                    changed: item.changed
                }
        }
    }
    _onPress() {
        if (this.props.onPress) {
            this.props.onPress()
        }
    }

    _handleEmptyvalue(value) {
        if (value == null || value == '' || value == 'Uncompleted') {
            return ''
        }
        return value
    }

    render() {
        this._init()
        let imagesData = []
        if(this.item.images != undefined && Array.isArray(this.item.images)){
          for (i = 0; i < this.item.images.length; i++) {
              var item = {
                  image: this.item.images[i],
                  link: this.item.itemDetail.title
              }
              imagesData.push(item)
          }
        }
        if(this.item.images== null || this.item.images.length <= 0){
            imagesData = [{image: "https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png",link: ""}]
        }

        var _renderImageSlider = () => {
            //console.log(imagesData)
            return (
                <ImageSlider
                  id = {`${this.props.id}-imageSlider`}
                  width={0.90 * itemWidth}
                  height = {(this.props.item.isFeatured)?190:150}
                  isDisabled={false}
                  data = {imagesData}
                  transitionInterval = {1}
                  showInterval = {2}
                  slideInterval = {0.3}
                  overlayText = {true}
                  autoPlay = {false}
                  navigation = {true}
                  carouselNavigation = {true}
                  showIndex = {0}
                  hasHeartIcon={true}
                  hasCheckBoxIcon={true}
                  lazyLoad = {false}
                  resizeMode = {"cover"}
                  handleNavigation = {this._onPress}>
                </ImageSlider>
            )
        }

        var _renderAgentInfo = () => {
          if((this.item.agentName != undefined && this.item.agentName.length>0) && !this.props.newLaunch){
            return (
                <IconMenu
                  type={'icon-text'}
                    textPosition={'right'}
                    textValue={this.item.agentName}
                    textFontFamily={'Poppins-SemiBold'}
                    textFontSize={10}
                    textSizeColor={'rgb(45,45,45)'}
                    textWidth={0.3 * itemWidth}
                    defaultSource={"https://sg.tepcdn.com/images/avatar.png"}
                    imageSource={{ uri: this.item.agentPhoto || 'https://sg.tepcdn.com/images/avatar.png' }}
                    imageWidth={40}
                    imageHeight={40}
                    imageBorderRadius={20}
                    imageBorderColor={'rgb(151,151,151)'}
                    imageBorderWidth={0.5}
                    imageResizeMode={'cover'}
                    // paddingLeft={5}
                    // paddingHorizontal={5}
                    // paddingVertical={5}
                    gapAround={{
                        marginTop: 2,
                        marginRight: 3,
                        marginBottom: 3,
                        marginLeft: 5,
                    }} />
            )
          }
        }

        var _renderListItemDetail = () => {

            return (
                <ListingResult_ListItemDetail
                    item={this.props.item}
                    nid={this.item.listingId}
                    isBookmark={this.item.isBookmark}
                    navigation={this.props.navigation}
                    itemDetail={this.item.itemDetail}
                    onUpdateBookmark={this.props.onUpdateBookmark}
                />
            )
        }

        var _renderExclusiveInfo = () => {
            return (
                <IconMenu
                    width={65}
                    height={18}
                    backgroundColor={'rgb(52,150,238)'}
                    type={'text'}
                    textPosition={'right'}
                    fontFamily={"Poppins-Regular"}
                    textSize={11}
                    gapWidth={2}
                    textColor={'rgb(255,255,255)'}
                    textValue={'EdgeProp Only'}
                    paddingHorizontal={2.5} />
            )
        }

        return (
            <View>
                <TouchableOpacity
                    style={[{
                        backgroundColor: this.style.backgroundColor
                    },
                    styles.inline]}
                    onPress={this._onPress}>
                    {!this.props.isRelated && (
                        <View style={{ alignItems: 'flex-start' }}>
                            {_renderImageSlider()}
                        </View>

                    )}
                    
                    <View style={{ flex: 1 }}>
                        {_renderListItemDetail()}
                    </View>

                </TouchableOpacity>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inline: {
        // flexDirection: 'row',
    }
})

export default ListingResult_ListItem
