import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  savedSearches: {
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 15,
    marginTop: 15,
     },
   savedSearchesHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    },
   searchesLink: {
    fontFamily: 'Poppins-Medium',
    color: '#488bf8',
    fontSize: 13
   },
   searchesHeading: {
    fontSize: width * 0.038,
    color: '#333333',
    paddingLeft : 0,
    fontStyle: 'normal',
    fontFamily: 'Poppins-Medium'
   },
   searchesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    marginBottom: 15,
    // borderBottomWidth: 0.3,
    // borderBottomColor: '#5A5A5A',
    // paddingBottom: 12
   },
   searchWrapper: {
    flexDirection: 'row',
   },
   searchesIconHeading: {
    color: '#414141',
    fontFamily: 'Poppins-Medium',
    fontSize: width * 0.035,
    width: '100%',
   },
   searchIconContainer: {
     paddingRight: 10,
     flexDirection: 'row',
     alignItems: 'center',
   },
   searchesIconText: {
    color: '#3C4755',
    fontSize: width * 0.030,
    flexWrap: 'wrap',
    marginRight: 8,
   },
   searchContentContainer: {
    paddingRight: 15,
    width: '100%',
   }

});
