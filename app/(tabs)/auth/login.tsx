import React, { useState, useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, ActivityIndicator, StyleSheet, Alert,TouchableOpacity,Platform } from 'react-native';
import authGoogle, { FirebaseAuthTypes, getAuth  } from '@react-native-firebase/auth';
import { useRouter, useNavigation } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import CountryFlag from 'react-native-country-flag';
import { parsePhoneNumberFromString, getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import {  Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Location from 'expo-location';
import database from '../db';
import { Q } from '@nozbe/watermelondb';
import User from '../model/userprofile';
import { ThemedView } from '@/components/ThemedView';
import GlobalBackground  from '@/components/GlobalBackground';
import { MMKV } from 'react-native-mmkv'
export const storage = new MMKV()

// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

export default function PhoneSignIn() {
  const socialButtons = [
    { icon: <Ionicons name="logo-apple" size={25} color="#fff" />, backgroundColor: '#000000', onPress: () => {} }, // Apple
    { icon: <Ionicons name="logo-google" size={25} color="#fff" />, backgroundColor: '#2B60D9', onPress: () => {onGoogleButtonPress()}   }, // Google
    { icon: <MaterialCommunityIcons name="email" size={25} color="#fff" />, backgroundColor: '#2B60D9',onPress: () => console.log('Apple Sign-In clicked') }, // Email
    { icon: <MaterialCommunityIcons name="facebook" size={25} color="#fff" />, backgroundColor: '#2B60D9', onPress: () => {} }, // Email
    { icon: <MaterialCommunityIcons name="odnoklassniki" size={25} color="#fff" />, backgroundColor: '#F7852D', onPress: () => console.log('Apple Sign-In clicked') }, // OK
  ];
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // State for the phone number without the country code
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState<string>(''); // OTP code
  const [isFocused, setIsFocused] = useState(false); // Input focus state
  const [countryisoCode, setCountryisoCode] = useState<string>('US'); // Default to 'US' if no valid country code is found
  const [timer, setTimer] = useState(60); // Timer state initialized to 60 seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Disable resend initially
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [beingConfirmed, setBeingConfirmed] = useState(false); // Track loading state

  const router = useRouter();
  const navigation = useNavigation();
  const auth = getAuth();
  
    const handleCountryCodes = async () => {
      const isAndroid = Platform.OS == 'android';
      let location = await Location.getLastKnownPositionAsync();
      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: isAndroid ? Location.Accuracy.Low : Location.Accuracy.Lowest,
        });
      }
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      let cciso,ccc;
      if (geocode.length > 0) {
        const userCountry = geocode[0].isoCountryCode;
        if (userCountry) {
          try {
            // Explicitly cast to CountryCode
            const code = getCountryCallingCode(userCountry as CountryCode);
            ccc = `+${code}`;
            cciso = userCountry.toLocaleLowerCase();
          } catch (error) {
            console.error('Error getting country code:', error);
          }
        }
      }
    if (ccc && typeof ccc === 'string') {
      if(!phoneNumber.includes(ccc)){
        setPhoneNumber(ccc+phoneNumber);// Update the country code
      }
    }

    if (cciso && typeof cciso === 'string') {
      setCountryisoCode(cciso); // Update the country code
    }
    setIsLoading(false);
  };
  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    const parsedPhoneNumber = parsePhoneNumberFromString(text);
    if (parsedPhoneNumber && parsedPhoneNumber.country) {
      setCountryisoCode(parsedPhoneNumber.country.toLocaleLowerCase())
    } 
  };

  useLayoutEffect(() => {
    if (confirm) {
      setTimer(60); // Reset timer when OTP screen is shown
      setIsResendDisabled(true); // Disable resend button
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setIsResendDisabled(false); // Enable resend button when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
  
      return () => clearInterval(countdown); // Clear interval on unmount
    } else {
      handleCountryCodes();
      GoogleSignin.configure({
        webClientId: '402166436116-21hm9jt82spfgkoa9nuij3g7m09acd24.apps.googleusercontent.com', // Get this from Firebase Console or Google Cloud
      }); 
    }
    

  }, [confirm]);
  const resendOTP = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }
    try {
      const confirmation = await auth.signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation); // Restart the confirmation process
      setTimer(60); // Restart the timer
      setIsResendDisabled(true); // Disable resend button again
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };
  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;
      if (!idToken) {
        Alert.alert('No ID token found');
      } 
      const googleCredential = authGoogle.GoogleAuthProvider.credential(idToken || null);
      // Sign-in to Firebase with Google credentials
      const signinObject = await auth.signInWithCredential(googleCredential);
      if (
        signinObject &&
        signinObject.additionalUserInfo &&
        signinObject.additionalUserInfo.profile?.email &&
        signinObject.additionalUserInfo.profile?.given_name
      ) {
        const postsCollection = database.get<User>('userprofile')
          const userExist = await postsCollection.query(
            Q.where('email', signinObject.additionalUserInfo?.profile.email)
          ).fetchCount();
          if(userExist == 1){
            console.log('user exist', userExist)
            console.log( storage.getAllKeys() )
            router.replace('/(tabs)/pages')
          } else {
            await database.write(async () => {
                let user = await postsCollection.create(user => {
                  user.firstName = signinObject.additionalUserInfo?.profile?.given_name || ''
                  user.lastName = signinObject.additionalUserInfo?.profile?.family_name || ''
                  user.email = signinObject.additionalUserInfo?.profile?.email || ''
                })
                storage.set('user.id', user.id)
                storage.set('is-mmkv-fast-asf', true)
                console.log('user added to db, didnt exist',user.id)
            })
            
            router.replace('/(tabs)/pages')
          }
      }
      // const endTime = Date.now(); // End timing
      // const duration = endTime - startTime; // Calculate time in milliseconds
      // console.log(`got signedin in ${duration} ms`);
      // router.replace('../(tabs)')
    } catch (error) {
      console.error(error);
    }
  };
  // const onfacebookButtonPress = async () => {
  //   const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  //   if (result.isCancelled) {
  //     throw 'User cancelled the login process';
  //   }

  //   // Once signed in, get the users AccessToken
  //   const data = await AccessToken.getCurrentAccessToken();

  //   if (!data) {
  //     throw 'Something went wrong obtaining access token';
  //   }

  //   // Create a Firebase credential with the AccessToken
  //   const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

  //   // Sign-in the user with the credential
  //   return auth().signInWithCredential(facebookCredential);
  // };
  // Handle the phone number submission
  const signInWithPhoneNumber = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }
    try {
      setBeingConfirmed(true);
      const confirmation = await auth.signInWithPhoneNumber(phoneNumber); // Combine country code and phone number
      setBeingConfirmed(false);
      setConfirm(confirmation); 
    } catch (error) {
      console.log('Error', 'Failed to send OTP. Please try again.'+error);
    }
  };

  // Handle the OTP confirmation
  const confirmCode = async () => {
    if (!confirm) return;
    try {
      await confirm.confirm(code);
      router.replace('../pages')
      Alert.alert('Success', 'Phone number verified!');
    } catch (error) {
      setCode(''); // Clear the entered code
      setConfirm(null); // Reset confirm to go back to the login page
    }
  };
  if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      );
    }
  if (!confirm) {
    return (
      <GlobalBackground>
      <ThemedView style={styles.container}>
        <Entypo name="cross" color="grey" size={28} onPress={() => navigation.goBack()} style={styles.iconImage} />
        <Text style={styles.title}>Enter your phone number</Text>
        <Text style={styles.subtitle}>We will send you SMS with a code</Text>
        <View style={styles.inputContainer}>
          <CountryFlag isoCode={countryisoCode} size={18} style={styles.countryFlag} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            maxLength={15}
            value={phoneNumber} // Use phoneNumber state directly
            onChangeText={handlePhoneNumberChange} // Update phoneNumber and country code dynamically
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
        {isFocused && (
          <TouchableOpacity style={styles.button} onPress={signInWithPhoneNumber}>
              <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

        )}
      <ThemedView style={styles.containerSocial}>
        <Text style={styles.subtitlesocial}>Connect using social media</Text>
        <View style={styles.buttonContainer}>
          {socialButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.buttonsocial, { backgroundColor: button.backgroundColor }]}
              onPress={button.onPress}
            >
              {button.icon}
            </TouchableOpacity>
          ))}
        
        </View>
        { beingConfirmed && <Text style={{alignSelf:"center", color: "grey", paddingTop: 100}}>Confirming...</Text>}
      </ThemedView>
      </ThemedView>
      </GlobalBackground>
    );
  }

  return (
    <GlobalBackground>
    <ThemedView style={styles.container}>
      <Entypo name="cross" color="grey" size={28} onPress={() => setConfirm(null)} style={styles.iconImage} />
      <Text style={styles.title}>Enter OTP</Text>
      <TouchableOpacity 
      style={styles.editPhoneContainer} 
      onPress={() => setConfirm(null)} // Reset to go back to phone input
    >
      <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
      <Entypo name="edit" size={14} color="" style={styles.editIcon} />
    </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter verification code"
          value={code}
          maxLength={6}
          onChangeText={(text) => setCode(text)}
          keyboardType="number-pad"
          style={styles.input}
        />
      </View>
      <Text style={{ textAlign: 'center', marginVertical: 10 }}>
      {timer > 0 ? `Wait for ${timer} seconds to resend OTP` : 'Didn’t receive the OTP?'}
    </Text>
    
      <TouchableOpacity style={styles.button} onPress={confirmCode}>
          <Text style={styles.buttonText}>Confirm Code</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      style={[styles.button, isResendDisabled && { backgroundColor: "rgba(128, 128, 128, 0.7)" }]}
      onPress={resendOTP} 
      disabled={isResendDisabled}
    >
      <Text style={styles.buttonText}>Resend OTP</Text>
    </TouchableOpacity>

    </ThemedView>
    </GlobalBackground>
  );
}

const styles = StyleSheet.create({
  editPhoneContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    width: '50%',
    padding: 10,
    borderWidth: 0.5,  // Purple border
    borderColor: '#463458',
    borderRadius: 10,
    marginBottom:15
  },
  
  phoneNumberText: {
    fontSize: 16,
    color: 'black',
  },
  
  editIcon: {
    marginLeft: 5,
    paddingTop:4
  },
  containerSocial: {
    flex: 1,
    paddingTop: 20,
    backgroundColor:'transparent'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'transparent'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'rgb(44, 44, 45)',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitlesocial: {
    fontSize: 14,
    paddingLeft:4,
    textAlign: 'left',
  },
  input: {
    paddingHorizontal: 10,
    paddingBottom:1,
    width: "100%",
    fontSize: 16,
  },

  button: {
    backgroundColor: "rgba(70, 52, 88, 0.9)",
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  iconImage: {
    paddingTop: 15,
    alignSelf:'flex-end'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
  },
  countryFlag: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop:5,
  },
  buttonsocial: {
    width: 70,
    height: 35,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
});
