import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Switch,
    Slider,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from "react-native-modal";
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
//import BrightnessSetting from '../BrightnessSetting/BrightnessSetting.js'

var active = require('../../assets/icons/font-active.png');
var inactive = require('../../assets/icons/font-inactive.png');
var br_high  = require('../../assets/icons/brightness-high.png');
var br_low   = require('../../assets/icons/brightness-low.png');

const {width, height} = Dimensions.get('window');
class ModalLanding extends Component {
    constructor(props) {
      super(props)
          this.state = {
            switchValue: props.darkMode || false,
            fontFactor : props.fontFactor || 0,
            disableHigh: props.disableHigh,
            disableLow: props.disableLow
          }
      this.toggleSwitch = this.toggleSwitch.bind(this);
      this.fontChange = this.fontChange.bind(this);
    }
    toggleSwitch() {
      this.setState({ switchValue: !this.state.switchValue });
      if(this.props.handleDarkMode){
        this.props.handleDarkMode();
      }
    }

    fontChange(flag){
      let fontFactor = this.state.fontFactor;
      let disableLow = this.state.disableLow;
      let disableHigh = this.state.disableHigh;
      if(flag === 1){
        if(!this.state.disableHigh){
          fontFactor++;
          disableLow = false;
          if(fontFactor == 5){
            disableHigh = true;
          }
        }
      }else{
        if(!this.state.disableLow){
          fontFactor--;
          disableHigh= false
          if(fontFactor == 0){
            disableLow = true;
          }
        }
      }
      this.setState({
            fontFactor,
            disableLow,
            disableHigh
          }, () =>{
            if(this.props.handleFontSize){
              this.props.handleFontSize(this.state.fontFactor,this.state.disableHigh,this.state.disableLow)
            }
          })
    }
    render() {
        return (
            <View style={styles.container}>
            <Modal
              isVisible={true}
              onSwipeComplete={() => this.props.closeModal()}
              onRequestClose={() => this.props.closeModal()}
              swipeDirection={['up', 'left', 'right', 'down']}
              onBackdropPress={() => this.props.closeModal()}
              style={styles.bottomModal}
              transparent={true} >
                <View style={styles.content}>
                  <View style={styles.fontContainer}>
                      <View style={{ width: '50%', alignItems: 'center', padding: 24 }}>
                        <TouchableOpacity disabled={this.state.disableLow} onPress={() =>this.fontChange(0)} style={styles.fullWidthButton}>
                          <Image
                            style={{ width: 14, height: 14 }} 
                            source={this.state.disableLow? active : inactive}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: '50%', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#DCDCDC', padding: 20 }}>  
                        <TouchableOpacity disabled={this.state.disableHigh} onPress={() =>this.fontChange(1)} style={styles.fullWidthButton}>
                          <Image
                            style={{ width: 26, height: 26 }} 
                            source={this.state.disableHigh? active : inactive}
                          />
                        </TouchableOpacity>
                      </View> 
                  </View>
                  {/*<View style={{ borderBottomWidth: 1, borderBottomColor: '#DCDCDC', paddingLeft: 10, paddingRight: 10  }}/>
                    <View style={styles.brightContainer}>
                        <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 10 }} disabled={true}>
                          <Image
                            style={{ width: 16, height: 16 }} 
                            source={br_low}
                          />
                        </View>
                        <View style={{ width: '70%'}}>
                        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={0}
                            maximumValue={1}
                            minimumTrackTintColor="#000000"
                            maximumTrackTintColor="#FFFFFF"
                          />
                         <View />

                        </View>
                        <View style={{ marginTop: 20, marginBottom: 20, marginRight: 17 }}> 
                          <Image
                            style={{ width: 26, height: 26 }} 
                            source={br_high}
                          />
                      </View>  
                    </View>*/}
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#DCDCDC' }}/>
                  <View style={styles.modeChange}>
                    <View style={{ paddingTop: 15, paddingBottom: 15, marginRight: 15, marginLeft: 10}}>
                      <Text allowFontScaling={false} style={styles.textLable}>Night Mode</Text>
                    </View>
                    <View style={{ paddingTop: 15, paddingBottom: 15, marginRight: 10 }}>
                      <Switch
                          onValueChange = {this.toggleSwitch}
                          value = {this.state.switchValue}/>
                    </View>
                  </View>
                </View>
                <View>
                <Image
                  style={{ width: 23, height: 23 , position: 'absolute', marginTop: -7, right: width * 0.215 }} 
                  source={require('../../assets/icons/down_icon.png')}
                />
              </View>
            </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',

  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    bottom: 100,
    paddingBottom: 50,
    width: '60%',
    right: 0
  },
  fontContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  borderLine: {
    borderLeftWidth: 1,
    borderLeftColor: '#DCDCDC',
  },
  brightContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center'
  },
  textLable: {
    color: '#2F2F2F',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    paddingLeft: 5
  },
  modeChange: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4
  },
  fullWidthButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: 40,
    padding: 10
  }  
});


export default ModalLanding;
