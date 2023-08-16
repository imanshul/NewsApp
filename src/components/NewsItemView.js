import {Image, Text, TouchableOpacity, View} from "react-native";
import Styles from "../constants/Styles";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Colors from "../constants/Colors";
import Images from "../images/Images";

function NewsItemView(props) {
    let {item, index} = props

    const renderRightActions = (progress, dragX, onPin, onRemove) => {
        return (
            <View style={{width: 100, flexDirection: 'row', borderRadius: 4,}}>
                <TouchableOpacity onPress={() => onPin(index)} style={{
                    backgroundColor: 'blue',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{color: Colors.white}}>{item.pinned ? 'UnPin' : 'Pin'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onRemove(index)} style={{
                    backgroundColor: 'red',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{color: Colors.white}}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{padding: 8}}>
            <Swipeable
                renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, props.onPinView, props.onRemoveView)
                }
                onSwipeableOpen={() => props.closeRow(index)}
                ref={props.setRef}
                containerStyle={[{borderRadius: 4, backgroundColor: 'white'}, Styles.shadowStyle]}
                rightOpenValue={-100}>
                <View style={[{
                    padding: 16,
                    flex: 1,
                    backgroundColor: 'white'
                }, Styles.shadowStyle]}>
                    <View style={{flexDirection: 'row', flex: 1,}}>
                        <Image source={item.urlToImage ? {
                            uri: item.urlToImage,
                        } : Images.PlaceHolder} style={{width: 60, height: '100%'}} resizeMode={'stretch'}/>
                        <Text style={{fontWeight: 'bold', marginStart: 8, flexShrink: 1}}>{item.title}</Text>
                    </View>
                    <Text style={{marginTop: 8}}>{item.description}</Text>
                </View>
            </Swipeable>
            {item.pinned &&
            <Image source={Images.Pin} style={{width: 20, height: 20, position: "absolute", right: 0}}
                   resizeMode={'contain'}/>
            }
        </View>

    )

}

export default NewsItemView