import { StyleSheet, Dimensions, Platform } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
     paddingLeft: 10,
     paddingRight: 10,
     paddingTop: 25,
     paddingBottom: 20
    },
    containerTitle: {
      color: '#414141',
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      paddingLeft: 7,
    },
    itemContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 7,
      paddingRight: 7,
    },
    itemList: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexBasis: '100%',
      flex: 1,
      overflow: 'hidden',
      paddingLeft: 7,
      paddingRight: 7,
      paddingBottom: 7,
     },
    itemTitle: {
      color: '#414141',
      fontSize: 15,
      fontFamily: 'Poppins-Medium',
      paddingTop: 10

    },
    info: {
      color: '#414141',
      fontSize: 10,
      paddingTop: 5,
      fontFamily: 'Poppins-Regular',
      maxWidth: '100%'
    },
    imageContainer: {
      borderWidth: 0.3,
      borderRadius: 2,
      overflow: 'hidden'
    },
    parentContainer: { 
   },
   shortlist: {
     paddingLeft: 23,
     paddingRight: 23,
   },
   bottomIcons : { 
    width: width, 
    height: 50,
    left: -30,
    bottom: 0,
    position: 'absolute',
    borderWidth:1,
     borderColor: '#DCDCDC',
    shadowOffset:{  width: 4,  height: 0  },
    shadowColor: '#ACACAC',
    shadowOpacity: 3,
    backgroundColor: '#FFF'
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 23,
    paddingRight: 23, 
    paddingTop: 12,
    paddingBottom: 12,
    width: width,
  },
  listContainer: {
    zIndex: -1,
  }, 
  shortlistOptions: {
    zIndex: -1,
    marginBottom: 50
  },
  optionsStyle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#414141',
    textAlign: 'center'
  },
  listingItems:{
    height: '100%',
  },
  relatedListing: {
    height: '100%',
 //   paddingBottom: -10
  },
  bottomStyles: {
    height: '100%',
    marginBottom: 10

  },
  shortListTabs:{
    height: '100%',
  },
  searchTabs: {
    width: width, 
    height: 50,
    left: -30,
    bottom: 0,
    position: 'absolute',
    borderWidth:1,
    borderColor: '#DCDCDC',
    shadowOffset:{  width: 4,  height: 0  },
    shadowColor: '#ACACAC',
    shadowOpacity: 3,
    backgroundColor: '#FFF'
  },
  shortlistBottom: {
    width: width, 
    height: 50,
    left: 0,
    bottom: 0,
    position: 'absolute',
    borderWidth:1,
    borderColor: '#DCDCDC',
    shadowOffset:{  width: 4,  height: 0  },
    shadowColor: '#ACACAC',
    shadowOpacity: 3,
    backgroundColor: '#FFF'
    }
});