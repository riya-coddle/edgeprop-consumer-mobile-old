import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
     modalContainer: {
        width: '100%',
        height: 205,
        flexDirection: 'row',
        justifyContent: 'center'
      },
     modal:{
        backgroundColor: '#fff',
        width: 275,
        paddingHorizontal: 11,
        borderRadius: 6,
        paddingTop: 23
     },
     modalInner: {
     	flexDirection: 'row',
     	paddingBottom: 15
     },
     shortlistText: {
     	color: '#2F2F2F',
     	paddingLeft: 3
     },
     noteForNewsSection: {
        flexDirection: 'row',
        alignItems: 'center'
     },
     folderListing: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       paddingHorizontal: 8,
       borderTopWidth: 1,
       borderColor: '#DADFE4',
       marginTop: 13,
       marginLeft: 9,
       marginRight: 9
     },
     folderText: {
     	color: '#414141',
     	fontSize: 10,
     	marginLeft: -6,
     	marginRight: -6,
     	paddingTop:4,
      },
      folderLinksContainer: {
      	flexDirection: 'row',
      	justifyContent: 'flex-end',
       	paddingTop: 35,
 
      },
       folderLink: {
      	color: '#488BF8',
      	paddingRight: 10,
      	fontWeight: '600',
      },
      folderLinkOne: {
      	paddingRight: 30,
      	color: '#488BF8',
      	fontWeight: '600'
      },
      textInputPopup: {
        width: '70%',
        paddingRight: 30,
        position: 'relative'
       },
      inputStyles: {
        justifyContent: "flex-start",
       	fontSize: 10,
       	paddingBottom: 4,
       	position: 'absolute',
       	top: -33,
       	left: 0,
       	width: '100%',
       	height: 60
       }

});
