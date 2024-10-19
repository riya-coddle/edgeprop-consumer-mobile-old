import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
    //  padding: 8,
     // margin: 10
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
      flexWrap: 'wrap',
      width: '100%',
      paddingTop: 20,
    },
    itemList: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexBasis: '50%',
      maxWidth: '50%',
      flex: 1,
      overflow: 'hidden',
      paddingLeft: 7,
      paddingRight: 7,

    },
    itemTitle: {
      color: '#414141',
      fontSize: 13,
      fontFamily: 'Poppins-Medium'
    },
    info: {
      color: '#414141',
      fontSize: 13,
      paddingTop: 5,
      fontFamily: 'Poppins-Regular',
      maxWidth: '100%'
    },
    imageContainer: {
      borderWidth: 0.3,
      borderRadius: 2,
      overflow: 'hidden'
    }

});
