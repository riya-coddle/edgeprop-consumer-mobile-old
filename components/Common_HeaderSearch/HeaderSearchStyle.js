import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  	homepageSearchContainer: {
  		paddingLeft: 23 , 
      paddingRight: 23,
      paddingTop: 32,
      /*borderColor: '#DCDCDC',
      borderWidth: 0.5,
      borderRadius: 5,*/
      /*shadowColor: '#cccccc',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 2*/
  	},
  	iconContainer: {
  		width: '80%',
  		borderLeftWidth: 1,
  		borderLeftColor: '#DCDCDC',

  	},
  	inputContainer: {
  		width: '100%'
  	},
    headerSearch: {
      borderColor: '#DCDCDC',
      borderWidth: 0.5,
      borderRadius: 5,
      shadowColor: '#e4e1e1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 4,
     // marginTop: 25,
      display: 'flex',
      marginBottom: 10,
      marginTop: 10,
    },
    detailsSearch: {
      borderColor: '#fff',
      borderWidth: 0.6,
      borderRadius: 8,
      display: 'flex'
    }
});
