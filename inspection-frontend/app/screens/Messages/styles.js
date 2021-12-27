import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  inputContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  userContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    marginTop: 2.4,
  },
  userContentMessage: {
    marginTop: 0,
    padding: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    
  },
  userContentDate: {justifyContent: 'flex-end'},

  meContent: {
    
    paddingVertical: 2,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  meContentDate: {
    flex: 3,
    marginTop:3,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop:1
  },
  meContentMessage: {

    marginTop: 0,
    padding: 10,
    paddingVertical:8,
    paddingHorizontal: 15,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    flex: 1,
  },
});
