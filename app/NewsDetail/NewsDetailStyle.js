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
	  width: '100%',
	  flexDirection: 'row',
	  justifyContent: 'space-around',
	  paddingLeft: 23,
	  paddingRight: 23,
	  alignSelf: 'flex-end'
	},
	fullWidthButton: {
  	flex: 1,
  	justifyContent: 'center',
  	alignItems: 'center',
  	paddingVertical: 12
  }

});
