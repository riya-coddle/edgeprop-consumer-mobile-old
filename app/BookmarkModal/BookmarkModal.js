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
} from 'react-native';
import Modal from "react-native-modal";
import { HeaderBackButton } from 'react-navigation';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import styles from './BookmarkModalStyles.js';

export default class BookmarkModal extends Component {
	
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };

  constructor(props) {
    	super(props);
    	this.state = {  	        	
      };
      this._addToBookmark = this._addToBookmark.bind(this)
  	}
    
    _addToBookmark() {
        
    }

  	render() {
    	return (
          <Modal
              isVisible={true}
              onSwipeComplete={() => this.props.closeModal()}
              onRequestClose={() => this.props.closeModal()}
              transparent={true} >
              <View style={styles.modalContainer}>
                 <View style={styles.modal}>
                    <View style={styles.modalInner}>
                       <Image style={{marginRight: 10, marginLeft: 10}}
                        source={require('../../assets/icons/bookmark_modal.png')}
                       />
                       <Text allowFontScaling={false} style={styles.shortlistText}>Added to Shortlisted News</Text> 
                    </View>
                    <View style={styles.noteForNewsSection}>
                          <Image style={{marginRight: 6, marginLeft: 10, width: 42, height: 42}}
                            source={{uri: this.props.coverImage }}
                          />
                         <View style={styles.textInputPopup}>
                            <TextInput
                              allowFontScaling={false}
                              multiline={true}
                              placeholder="Write a note for the news (optional)"
                              style={styles.inputStyles}
                              textAlignVertical={'top'}
                              onChangeText={(text) => this.setState({text})}
                              />
                         </View>
                     </View>
                     <View style={styles.folderListing}>
                        <Text allowFontScaling={false} style={styles.folderText}>Folder</Text>
                        <Text allowFontScaling={false} style={styles.folderText}>My First Listing News</Text>
                     </View>
                     <View style={styles.folderLinksContainer}>
                        <TouchableOpacity onPress={() => this.props.closeModal()}>
                          <Text allowFontScaling={false} style={styles.folderLinkOne}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._addToBookmark}>  
                          <Text allowFontScaling={false} style={styles.folderLink}>Done</Text>
                        </TouchableOpacity>    
                     </View>
                 </View>
                
              </View>
          </Modal>    
      	);
      }
}