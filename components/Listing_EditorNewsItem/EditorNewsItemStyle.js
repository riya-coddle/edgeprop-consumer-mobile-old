import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  sliderContainer: {
    flexDirection: 'column',
    flexShrink: 1,
    maxWidth: width
  },
  imageSlider: {
    marginLeft : -15,
  },
  slider: {
    borderColor: '#FFF',
    borderWidth: 0.5,
    borderRadius: 3,
  },
  info : {
    maxWidth: width * 0.85,
  },
  labelStyle: {
    color: '#909090',
    fontSize: 12,
    paddingTop: 6,
    paddingBottom: 6,
  },
  priceStyle: {
    fontFamily : 'Poppins-Medium',
    fontSize: 13,
    color: '#3C4755',
    paddingTop: 10,
    paddingBottom: 10,
  }
});
