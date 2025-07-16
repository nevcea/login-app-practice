import { useState } from "react";
import {Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const MainScreen = () => {
    const [count, setCount] = useState(0);

    const onPressPlusButton = async () => {
        const token = await AsyncStorage.getItem("token");

        const res = await axios.post(
            "http://localhost:3000/increase-number",
            {count, token}
        );

        if (res.data.isSuccess === true) {
            setCount((prev) => {return res.data.count;});
        }
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