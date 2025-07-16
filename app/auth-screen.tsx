import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useState} from "react";
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

// AuthScreen 컴포넌트 정의
const AuthScreen = () => {
    // 사용자 이메일과 비밀번호 입력을 위한 상태 변수
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Expo Router 훅을 사용하여 라우터 객체 가져오기
    const router = useRouter();

    // 인증 관련 피드백 메시지 (예: 에러 메시지)를 위한 상태 변수
    const [authMessage, setAuthMessage] = useState('');

    /**
     * 이메일 입력 필드의 텍스트가 변경될 때 호출되는 핸들러
     * @param text 새로 입력된 이메일 텍스트
     */
    const handleEmailChange = (text: string) => {
        setEmail(text); // 이메일 상태 업데이트
    }

    /**
     * 비밀번호 입력 필드의 텍스트가 변경될 때 호출되는 핸들러
     * @param text 새로 입력된 비밀번호 텍스트
     */
    const handlePasswordChange = (text: string) => {
        setPassword(text); // 비밀번호 상태 업데이트
    }

    /**
     * 로그인 버튼 클릭 시 실행되는 비동기 함수
     * 백엔드 API로 로그인 요청을 보냅니다.
     */
    const handleSignIn = async () => {
        try {
            // Axios를 사용하여 로그인 API에 POST 요청 전송
            const response = await axios.post("http://localhost:3000/sign-in", {email, password});

            // 응답 데이터의 isSuccess 값 확인
            if (!response.data.isSuccess) {
                // 로그인이 실패했을 경우 에러 메시지 설정
                setAuthMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
            } else {
                // 로그인이 성공했을 경우 메시지 초기화 및 메인 화면으로 이동
                setAuthMessage('');
                await AsyncStorage.setItem("token", response.data.token);
                router.replace('/main-screen'); // 메인 화면으로 대체 (뒤로가기 방지)
            }
        } catch (error) {
            // API 요청 실패 시 (네트워크 오류, 서버 응답 없음 등) 콘솔에 에러 출력 및 메시지 설정
            console.error("로그인 API 요청 실패:", error);
            setAuthMessage('로그인 중 오류가 발생했습니다. 서버 상태를 확인해주세요.');
        }
    };

    /**
     * 회원가입 버튼 클릭 시 실행되는 비동기 함수
     * 백엔드 API로 회원가입 요청을 보냅니다.
     */
    const handleSignUp = async () => {
        try {
            // Axios를 사용하여 회원가입 API에 POST 요청 전송
            const response = await axios.post("http://localhost:3000/sign-up", {email, password});

            // 응답 데이터의 isSuccess 값 확인
            if (!response.data.isSuccess) {
                // 회원가입이 실패했을 경우 (예: 이미 가입된 이메일) 에러 메시지 설정
                setAuthMessage('이미 가입된 이메일입니다.');
            } else {
                // 회원가입이 성공했을 경우 메시지 초기화 및 성공 알림 표시
                setAuthMessage('');
                Alert.alert("가입되었습니다."); // 성공 메시지 Alert 표시
            }
        } catch (error) {
            // API 요청 실패 시 (네트워크 오류, 서버 응답 없음 등) 콘솔에 에러 출력 및 메시지 설정
            console.error("회원가입 API 요청 실패:", error);
            setAuthMessage('회원가입 중 오류가 발생했습니다. 서버 상태를 확인해주세요.');
        }
    }

    // 컴포넌트 UI 렌더링
    return (
        <>
            <View style={{flex: 1}}>
                {/* 상단 여백 및 이메일 입력 섹션 */}
                <View style={{flex: 3}}>
                    <View style={{height: 100}}/> {/* 상단 패딩 역할 */}
                    <View style={{
                        marginLeft: 20,
                        marginRight: 20,
                        marginBottom: 10
                    }}>
                        <Text style={{fontSize: 20}}>이메일을 입력하세요</Text>
                    </View>
                    <TextInput
                        value={email} // email 상태와 바인딩
                        onChangeText={handleEmailChange} // 텍스트 변경 시 handleEmailChange 호출
                        placeholder={"이메일을 입력하세요"}
                        inputMode={"email"} // 이메일 입력에 최적화된 키보드 모드 설정
                        style={{
                            borderWidth: 1,
                            borderColor: "#6c6c6c",
                            borderRadius: 8,
                            marginLeft: 20,
                            marginRight: 20,
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingVertical: 20, // paddingTop과 paddingBottom을 paddingVertical로 통합
                            fontSize: 16,
                        }}
                    />

                    <View style={{height: 20}}/> {/* 입력 필드 간 간격 */}

                    {/* 비밀번호 입력 섹션 */}
                    <View style={{
                        marginLeft: 20,
                        marginRight: 20,
                        marginBottom: 10
                    }}>
                        <Text style={{fontSize: 20}}>비밀번호를 입력하세요</Text>
                    </View>
                    <TextInput
                        value={password} // password 상태와 바인딩
                        onChangeText={handlePasswordChange} // 텍스트 변경 시 handlePasswordChange 호출
                        placeholder={"비밀번호를 입력하세요"}
                        secureTextEntry={true} // 입력 내용 숨김 (비밀번호용)
                        style={{
                            borderWidth: 1,
                            borderColor: "#6c6c6c",
                            borderRadius: 8,
                            marginLeft: 20,
                            marginRight: 20,
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingVertical: 20, // paddingTop과 paddingBottom을 paddingVertical로 통합
                            fontSize: 16,
                        }}
                    />

                    <View style={{height: 100}}/> {/* 하단 패딩 역할 */}
                </View>

                {/* 인증 결과 메시지 및 버튼 섹션 */}
                <View style={{flex: 1}}>
                    {/* 인증 결과 메시지 표시 (빨간색 텍스트) */}
                    <Text style={{
                        color: "red",
                        fontSize: 16,
                        textAlign: "center",
                        padding: 10,
                        margin: 5
                    }}>{authMessage}</Text>

                    {/* 로그인 버튼 */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#4447fe', // 파란색 배경
                            marginLeft: 20,
                            marginRight: 20,
                            paddingVertical: 15, // paddingTop과 paddingBottom을 paddingVertical로 통합
                            borderRadius: 8,
                            marginBottom: 10, // 버튼 간 간격 추가
                        }}
                        onPress={handleSignIn} // 클릭 시 handleSignIn 함수 호출
                    >
                        <Text style={{
                            color: "#ffffff", // 흰색 텍스트
                            fontSize: 16,
                            textAlign: "center"
                        }}>로그인</Text>
                    </TouchableOpacity>

                    {/* 회원가입 버튼 */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#4447fe', // 파란색 배경
                            marginLeft: 20,
                            marginRight: 20,
                            paddingVertical: 15, // paddingTop과 paddingBottom을 paddingVertical로 통합
                            borderRadius: 8,
                        }}
                        onPress={handleSignUp} // 클릭 시 handleSignUp 함수 호출
                    >
                        <Text style={{
                            color: "#ffffff", // 흰색 텍스트
                            fontSize: 16,
                            textAlign: "center"
                        }}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

export default AuthScreen;