import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
 	info: {
 		fontSize: width* 0.03,
        fontFamily: 'Poppins-Regular',
        color: '#969696',
        paddingLeft: 20,
        marginTop: -2
 	},
 	separatorLine :{
 		borderTopWidth: 1, 
 		borderColor: '#DCDCDC'
 	},
 	itemsStyle: { 
 		flex: 1, 
 		flexDirection: 'column', 
 		justifyContent: 'center', 
 		alignItems: 'center', 
 		borderColor: '#DCDCDC', 
 		borderRightWidth: 1, 
 		padding: 5 , 
 		marginRight: 'auto'
 	},
 	itemLabel: {
 		fontFamily: 'Poppins-Regular',
 		fontSize: 10,
 	},
    textInfo : { 
        fontSize: 13,
        lineHeight: 19,
        fontFamily: 'Poppins-Regular',
        color: '#414141',
        fontWeight: 'normal',
        paddingLeft: 18
	},
 	infoContain: {
 		paddingBottom: 12
 	},
    infoCustom: {
        color: '#488BF8',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
         paddingLeft: 5,
     },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }

});
