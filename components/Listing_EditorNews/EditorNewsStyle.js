import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  newsContainer: {
  	display: 'flex',
  	flexDirection: 'row',
   	justifyContent: 'space-between',
   	alignItems: 'center',
    paddingTop: 15,
    paddingLeft: 25,
    paddingRight: 23,
    paddingBottom: 5 
  },
  title: {
  	fontFamily: 'Poppins-Medium',
    fontSize: width * 0.038,
    color: '#333333'
    /*paddingRight: 23, 
    paddingTop: 23*/
  },
  moreOption: {
  	fontSize: 13,
    color: '#275075',
    fontWeight: 'bold',
    textAlign: 'right'
  },
  moreTextContainer: {
  	//marginLeft: 30,
    flexShrink: 0
  }
});
