import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  	bottomIcons : { 
	  width: width,
	  position:'absolute',
	  bottom:0, 
	  backgroundColor:'#FFF', 
	  borderColor: '#DCDCDC',
	  borderWidth: 1, 
	},
	iconContainer: {
	  display: 'flex',
	  flexDirection: 'row',
	  justifyContent: 'space-between',
	  paddingLeft: 23,
	  paddingRight: 23,	
	  paddingTop: 12,
	  paddingBottom: 12,
	  alignSelf: 'flex-end'
	},

});
