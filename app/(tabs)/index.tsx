import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions  } from "react-native";
import Swiper from "react-native-swiper";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import * as Location from 'expo-location';
import { getAuth  } from '@react-native-firebase/auth';
import seedData from './db/seedData';
import GlobalBackground  from '@/components/GlobalBackground';
import { ThemedText } from '@/components/ThemedText';
const { width, height } = Dimensions.get("window");
export default function OnboardingScreen() {
  const router = useRouter();
  const auth = getAuth()
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true); // Track initialization state
  const [user, setUser] = useState(null); // Track user state

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false); // Only set once Firebase is ready
  }
  useEffect(() => {
    //seedData();
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
    };
    getCurrentLocation();
  }, []);

  useEffect(() => {

    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  if (initializing) {
    return <View />;
  }
  const onPressGetStarted = () => {
    if (user) {
      router.replace('/pages');
    } else {
      router.push("/auth/login");
    }
  };
  
  return (
    <GlobalBackground>
    <View style={styles.container}>
  
          <View style={styles.textOverlay}>
            <ThemedText style={styles.title}>Find Professionals</ThemedText>
            <ThemedText style={styles.text}>
              Get trusted professionals for all your home and car needs.
            </ThemedText>
          </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={onPressGetStarted}
          style={styles.loginButton}
        >
          Get Started
        </Button>
      </View>
      
    </View>
    </GlobalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textOverlay: {
    top: height * 0.76, // Position text above the button
    left: 0,
    right: 0,
    padding: 20,
  },
  title: {
    fontSize: 26,
    padding:5,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    padding:5,
    textAlign: "center",
  },
  buttonContainer: {
    top: height * 0.76, // Position text above the button
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  loginButton: {
    paddingVertical: 10,
    backgroundColor: '#463458', 
    borderRadius: 10,
  }
 
});