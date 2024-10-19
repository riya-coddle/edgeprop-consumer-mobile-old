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
  },
  propItemImage: {
    width: width * 0.88,
    height: width * 1.1,
    position: 'relative',
    overflow: 'hidden',
  },
  propOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 1
  },
   discoverTitle: {
    fontSize: width * 0.037,
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '500',
    textAlign: 'center',
    padding: 5,
    width: '100%',
    marginTop: 100,
  },
});
