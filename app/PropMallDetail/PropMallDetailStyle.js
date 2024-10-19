import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  propDetailHero: {
    backgroundColor: '#462B5A',
    padding: 30
  },
  propDetailHeroTitle: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 30
  },
  propHeroDesc: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22
  },
  propSectionTitle: {
    color: '#462B5A',
    fontSize: 22,
    fontWeight: '500',
    width: '100%',
    flex: 1
  },
  commonLink: {
    color: '#FA477B',
    fontSize: 14,
    paddingLeft: 10,
    paddingVertical: 10
  },
  horizontalTrack: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingLeft: 30
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 30,
  },
  socialWrapper: {
    marginTop: 20,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  detailSocialIcon: {
    marginRight: 10,
  },
  propDetailHeroImage: {
    width: width,
    height: 235,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  propDetailDescWrap: {
    paddingHorizontal: 30,
    paddingVertical: 15
  },
  propDetailDesc: {
    color: '#462B5A',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15
  },
  propTwoWay: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  propProviderContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingLeft: 15,
    marginBottom: 25
  },
  propProviderContentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#462B5A',
    lineHeight: 22
  },
  propProviderContentDesc: {
    fontSize: 15
  },
  sectionGallery: {
    marginTop: 30
  },
  galleryItem: {
    marginRight: 15,
    marginVertical: 15
  },
  galleryItemImage: {
    width: width * 0.82,
    height: width * 0.5,
    position: 'relative'
  },
  galleryLabel: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#462B5A',
    borderRadius: 3,
    position: 'absolute',
    right: 15,
    bottom: 15,
    zIndex: 1 
  },
  galleryLabelText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 10
  },
  sectionLocation: {
    marginTop: 30
  },
  sectionAmenities: {
    marginTop: 30
  },
  sectionFacilities: {
    marginTop: 30
  },
  sectionLocationContent: {
    paddingHorizontal: 30,
    paddingTop: 10
  },
  propTwoWayContent: {
    fontSize: 12,
    color: '#462B5A'
  },
  mapArea: {
    width: width,
    height: width * 0.6
  },
  sectionFeatures: {
    marginTop: 30
  },
  propListIcon: {
    width: 35,
    marginBottom: 25
  },
  propTwoWayList: {
    fontSize: 15,
    color: '#462B5A',
    lineHeight: 20,
  },
  propTwoWayListHead: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 15,
    color: '#462B5A',
    lineHeight: 20,
  },
  discoverTitle: {
    fontSize: 16,
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '500',
    textAlign: 'center',
    padding: 10
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
    padding: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1
  },
  propertyWrapper: {
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },  
  propertyItem: {
    marginVertical: 10,
    marginRight: 10
  },
  propertyItemImage: {
    width: width * 0.47,
    height: width * 0.57,
    position: 'relative',
    overflow: 'hidden',
  },
  sectionRelatedProps: {
    marginTop: 50,
    marginBottom: 70
  },
  regButton: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: '#FA477B',
    borderRadius: 4
  },
  regButtonText: {
    fontSize: 16,
    color: '#fff'
  },
  propFixedBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    zIndex: 2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: '#000000',
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)'
  },
  hpMainContainer: {
    backgroundColor: '#E0E0E0'
  },
  hpFirstSec: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    marginBottom: 10/*,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 3,
    shadowOpacity: 1*/
   }
});
