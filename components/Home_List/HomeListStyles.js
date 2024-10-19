import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  newsContainer: {
  	display: 'flex',
  	flexDirection: 'row',
   	justifyContent: 'space-between',
   	alignItems: 'center',
    paddingRight: 23,
    paddingLeft: 3,
    marginBottom: 10
  },
  title: {
  	fontFamily: 'Poppins-Medium',
    fontSize: width * 0.038,
    color: '#333333'
    /*paddingLeft: 23,
    paddingRight: 23,*/
  },
  titleBold: {
    color: '#414141',
    fontSize: width * 0.038, 
    fontFamily: 'Poppins-SemiBold', 
  },
  titleFeatured: {
    color: '#aaa',
    fontFamily: 'Poppins-Bold', 
    fontSize: width*0.028, 
    letterSpacing: 2,
    textAlign: 'center',
    fontWeight: "500",
    marginTop: -7,
    paddingBottom: 10,

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
  	/*paddingTop: 23,
  	paddingRight: 23,*/
  }
});
