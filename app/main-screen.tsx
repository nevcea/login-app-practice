import { useState } from "react";
import {Text, TouchableOpacity, View} from "react-native";

const MainScreen = () => {
    const [count, setCount] = useState(0);

    const onPressPlusButton = () => {
        setCount((prev) => {
            return prev + 1;
        });
    }

    const onPressMinusButton = () => {
        setCount((prev) => {
            return prev - 1;
        });
    }

    return (
        <>
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: 40, marginBottom: 40}}>{count}</Text>
                <TouchableOpacity style={{backgroundColor: "#2f38ff", padding: 20, borderRadius: 8}} onPress={onPressPlusButton}>
                    <Text style={{fontSize: 20, color: "#fff"}}>클릭하면 숫자가 증가합니다.</Text>
                </TouchableOpacity>
                <View style={{height: 10}}/>
                <TouchableOpacity style={{backgroundColor: "#2f38ff", padding: 20, borderRadius: 8}} onPress={onPressMinusButton}>
                    <Text style={{fontSize: 20, color: "#fff"}}>클릭하면 숫자가 감소합니다.</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default MainScreen;