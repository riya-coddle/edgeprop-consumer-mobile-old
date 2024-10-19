import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		paddingLeft: 25, 
		paddingRight: 25, 
		paddingTop: 40
	},
	userTitle: {
		fontFamily: 'Poppins-Medium',
		fontSize: 22, 
		color: '#333333' 
	},
   itemContainer: {
		paddingTop: 40,
      width: '100%',
		display: 'flex', 
		flexDirection: 'row', 
		justifyContent: 'space-between',
		alignItems: 'center'
   },
   itemText: {
   		fontFamily: 'Poppins-Medium',
		fontSize: 15, 
		color: '#414141' 	
   },
   itemValue: {
   	fontFamily: 'Poppins-Light',
		fontSize: 15, 
		color: '#606060',
      textAlign: 'right',
       
     },
   separator: {
   	marginTop: 5,
   	borderBottomColor: '#ECECEC',
      borderBottomWidth: 1,
   },
   logout: {
   	fontFamily: 'Poppins-Light',
		fontSize: 17, 
		color: '#ED4949',
   }	

});

