import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  bannerTitle:  {
    fontFamily: 'Poppins-Medium',
    fontSize: width * 0.055,
    paddingLeft: 23,
    paddingRight: 23,
    paddingBottom: 10, 
    paddingTop: 23,
    color: '#333333',
    width: '100%'
  },
  menuSectionTop :{
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
  },
  menuContainer: {
    width: '50%',
  },
  hpMainContainer: {
    backgroundColor: '#E0E0E0',
  },
  hpFirstSec: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    marginBottom: 10,
  },
  menuSectionBottom :{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
    marginBottom: 5
  },
  menuCard: {
    borderColor: '#DCDCDC',
    borderRadius: 3,
    margin: 5,
    borderWidth: 1,
    overflow: 'hidden'
    
  },
   labelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: width * 0.035,
    padding:6,
    color: '#414141'
   },
   menuImages: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
   },
   savedSearches: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 15
     },
   savedSearchesHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
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
    fontFamily: 'Poppins-Medium'
   },
   searchesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    // borderBottomWidth: 0.3,
    // borderBottomColor: '#5A5A5A',
    paddingBottom: 12
   },
   searchWrapper: {
    flexDirection: 'row',
   },
   searchesIconHeading: {
    color: '#414141',
    fontFamily: 'Poppins-Medium',
    fontSize: width * 0.035
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
    marginRight: 8
   },
   searchContentContainer: {
    paddingRight: 25,
    width: '100%',
   },
   pulloutSliderSection: {
    paddingTop: 15,
    paddingLeft: 25,
    paddingVertical: 25,
    backgroundColor: '#FFF'
   },
   pulloutSingleItem: {
    marginRight: 10
   },
   pulloutImage: {
    width: width * 0.425,
    height: width * 0.59
   },
   PulloutTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: width * 0.038,
    paddingRight: 25,
    paddingBottom: 10, 
    color: '#333333' 
   }
});
