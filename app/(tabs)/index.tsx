import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions  } from "react-native";
import Swiper from "react-native-swiper";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import * as Location from 'expo-location';
import { getAuth  } from '@react-native-firebase/auth';
import seedData from './db/seedData';

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
    <View style={styles.container}>
      <Swiper
        showsButtons={false}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        paginationStyle={{ bottom: 100 }} // Position dots above the button
      >
        <View style={styles.slide}>
          <View style={styles.textOverlay}>
            <Text style={styles.title}>Find Professionals</Text>
            <Text style={styles.text}>
              Get trusted professionals for all your home and car needs.
            </Text>
          </View>
        </View>

        <View style={styles.slide}>
          <View style={styles.textOverlay}>
            <Text style={styles.title}>Easy Booking</Text>
            <Text style={styles.text}>
              Schedule appointments at your convenience.
            </Text>
          </View>
        </View>

        <View style={styles.slide}>
          <View style={styles.textOverlay}>
            <Text style={styles.title}>Secure Payments</Text>
            <Text style={styles.text}>
              Safe and secure payments for a hassle-free experience.
            </Text>
          </View>
        </View>
      </Swiper>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
  },
  textOverlay: {
    position: "absolute",
    bottom: 100, // Position text above the button
    left: 0,
    right: 0,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  loginButton: {
    paddingVertical: 10,
    backgroundColor: '#463458', 
    borderRadius: 10,
  },
  dot: {
    backgroundColor: "#E0E0E0",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#463458",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});