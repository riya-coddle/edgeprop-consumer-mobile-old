import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
  	borderBottomColor: '#E9E9E9', 
    paddingBottom: 22,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20

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
     paddingHorizontal: 10,
     width: '100%'
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
   	letterSpacing: 3,
    width: '100%',
    textAlign: 'left'
  },
  shortlistGrid: {
  	flexDirection: 'row'
   },
  shortlist: {
  	flexDirection: 'row'
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
   shortlistText: {
   	color: '#414141',
   	fontSize: 15,
   	fontWeight: '400',
   	letterSpacing: 3
  },
  ShortlistImageOne: {
  	backgroundColor: '#E3E4E5',
  	height: 30,
  	width: 44,
  	marginLeft: 4
  },
   ShortlistImageTwo: {
  	backgroundColor: '#E3E4E5',
  	height: 30,
  	width: 44,
  	marginLeft: 4,
  	marginTop: 4,
  	marginRight: 20,
  	marginLeft: 4
  }
 
  
 

});
