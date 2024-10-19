import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
  	borderBottomColor: '#E9E9E9', 
    paddingBottom: 22,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
 
  },
  linksContainer: {
  	flexDirection: 'row',
  	paddingTop: 10,
  	paddingBottom: 32,
  	paddingHorizontal: 10
  },
  linksActive: {
  	color: '#488BF8',
  	fontSize: 15,
  	paddingRight: 15,
  	textDecorationLine: 'underline'
  },
  links: {
  	paddingRight: 14,
  	fontSize: 15,
  	color: '#414141'
  },
  addBoxContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingHorizontal: 10
  },
  addBox: {
  	 width: 95,
  	 height: 65,
  	 backgroundColor: '#E3E4E5',
  	 marginRight: 16,
  	 alignItems: 'center',
  	 justifyContent: 'center'
  },
  addBoxText: {
   	color: '#488BF8',
   	fontSize: 15,
   	fontWeight: '400',
   	letterSpacing: 3
  },
  shortlistGrid: {
  	flexDirection: 'row'
   },
  shortlist: {
  	flexDirection: 'row',
    marginTop: 10,
  }, 
  imgShortlist: {
    height: 65,
    width: 45,
    marginLeft: 30,
    backgroundColor: '#E3E4E5',
   },
  shortlistTextArrow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '52%'
  },
   shortlistTextOne: {
   	color: '#6C747D',
   	fontSize: 15,
   	fontWeight: '400',
     marginLeft: 10,
     fontWeight: '400',
     fontFamily: 'Poppins-Medium'
    }, 
    shortlistTextTwo: {
    color: '#6C747D',
    fontSize: 15,
      marginBottom: 17,
     marginLeft: 10,
      fontWeight: '400',
      fontFamily: 'Poppins-Regular'
    },
    shortlistTextThree: {
    color: '#6C747D',
    fontSize: 15,
     marginBottom: 10,
    marginLeft: 10,
     fontWeight: '400',
     fontFamily: 'Poppins-Regular'
    },
  ShortlistImageOne: {
  	backgroundColor: '#E3E4E5',
  	height: 30,
  	width: 44,
  	marginLeft: 4
  },
   ShortlistImageTwo: {
   	height: 30,
  	width: 44,
  	marginLeft: 4,
  	marginTop: 4,
  	marginRight: 20,
  	marginLeft: 4
  },
  savedSearchContainer: {
    width: width * 0.87,
     flexDirection: 'column',
    justifyContent: 'flex-end',
    marginHorizontal: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
    shadowColor: "rgba(0,0,0,0.16)",
    shadowOffset: {
      width: 3,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 2
  },
  close: {
    position: 'absolute',
    top: 13,
    right: 10,

   }
});
