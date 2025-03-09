import React, { useState,useCallback, useLayoutEffect } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Avatar, IconButton, Divider } from 'react-native-paper';
// import DateTimePicker, { DateType, getDefaultStyles } from 'react-native-ui-datepicker';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import { Q } from '@nozbe/watermelondb';
import { useNavigation } from 'expo-router';
import dayjs from 'dayjs';
import database from '../db';
import User from '../model/userprofile';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from '@/components/ThemedView';

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const initialProfile = {
    firstName: '',
    lastName: '',
    aboutme: '',
    gender: '',
    city: '',
    dob: '',
    email: '',
    phone: '',
    profilePicture: ''
  };
  const [profile, setProfile] = useState(initialProfile);
  const [isChanged, setIsChanged] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  useLayoutEffect(() => {
    const fetchProfile = async () => {
      try {
        const postsCollection = database.get<User>('userprofile');
        const users = await postsCollection.query().fetch(); // Use the correct email or ID to query the profile
        // console.log(users[0])
        // await database.write(async () => {
        //   await users[0].destroyPermanently();
        // });
        
        if (users.length > 0) {
          const user = users[0];
          setProfile({
            firstName: user.firstName,
            lastName: user.lastName,
            aboutme: user.aboutme,
            gender: user.gender,
            city: user.city,
            dob: user.dob,
            email: user.email,
            phone: user.phone,
            profilePicture: user.profilePicture
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);
  
  const onChange = useCallback((event: any, selectedDate: any) => {
    handleInputChange('dob', selectedDate)
    const formattedDate = dayjs(selectedDate).format('DD.MM.YYYY');
    setProfile((prev) => ({ ...prev, dob: formattedDate }));
  }, [profile.dob]);

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange,
      mode: currentMode,
      maximumDate: new Date()
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };
  const handleBlur = () => {
    setFocusedField(null);
  };
  const handleInputChange = (key: string, value: string) => {
    setProfile((prev) => {
      const updatedProfile = { ...prev, [key]: value };
      setIsChanged(JSON.stringify(updatedProfile) !== JSON.stringify(initialProfile)); // Check if changed
      return updatedProfile;
    });
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile((prev) => ({ ...prev, profilePicture: result.assets[0].uri }));
      setIsChanged(true);
    }
  };
  const handleSave = async () => {
    try {
      const postsCollection = database.get<User>('userprofile');
      const users = await postsCollection.query(Q.where('email', profile.email)).fetch();
  
      await database.write(async () => {
          await users[0].update(user => {
            user.firstName = profile.firstName;
            user.lastName = profile.lastName;
            user.aboutme = profile.aboutme;
            user.gender = profile.gender;
            user.city = profile.city;
            user.dob = profile.dob;
            user.phone = profile.phone
            user.profilePicture = profile.profilePicture
          }); 
      });
  
      setIsChanged(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };
  
  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <ThemedView style={styles.header}>
        <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => {navigation.goBack()}} />
        <Text style={styles.headerTitle}>Personal Information</Text>
        {isChanged && <Text onPress={handleSave} style={styles.headerSave}>Save</Text>} 
      </ThemedView>

      {/* Scrollable Content */}
      <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <ThemedView style={styles.profileSection}>
        {profile.profilePicture ? (
          <ThemedView style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: profile.profilePicture }} style={styles.picture} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleInputChange('profilePicture', '')} style={styles.deleteIcon}>
              <Avatar.Icon size={24} icon="close" color="white" style={{ backgroundColor: '#463458' }} />
            </TouchableOpacity>
          </ThemedView>
        ) : (
            <TouchableOpacity onPress={pickImage} >
              <Avatar.Icon size={120} icon="account" color="#A9A9A9" style={styles.avatar} />
            </TouchableOpacity>
          )}
        </ThemedView>

        {/* Editable Fields */}
        <Text style={styles.label}>First Name</Text>
        <TextInput onBlur={handleBlur} onFocus={() => handleFocus('firstName')} style={[styles.input, focusedField === 'firstName' && styles.inputFocused]} value={profile.firstName} onChangeText={(text) => handleInputChange('firstName', text)} />
        <Text style={styles.label}>About Me</Text>
        <TextInput multiline onBlur={handleBlur} onFocus={() => handleFocus('aboutme')} style={[styles.input, focusedField === 'aboutme' && styles.inputFocused]} value={profile.aboutme} onChangeText={(text) => handleInputChange('aboutme', text)} />

        <Text style={styles.label}>Last Name</Text>
        <TextInput onBlur={handleBlur} onFocus={() => handleFocus('lastName')} style={[styles.input, focusedField === 'lastName' && styles.inputFocused]}  value={profile.lastName} onChangeText={(text) => handleInputChange('lastName', text)} />
      
        {/* Gender Selection */}
        <ThemedView style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, profile.gender === 'male' && styles.selectedGender]}
            onPress={() => handleInputChange('gender', 'male')}
          >
            <Text style={[styles.genderText, profile.gender === 'male' && styles.selectedGenderText]}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.genderButton, profile.gender === 'female' && styles.selectedGender]}
            onPress={() => handleInputChange('gender', 'female')}
          >
            <Text style={[styles.genderText, profile.gender === 'female' && styles.selectedGenderText]}>Female</Text>
          </TouchableOpacity>
        </ThemedView>

        <Text style={styles.label}>City</Text>
        <TextInput onBlur={handleBlur} onFocus={() => handleFocus('city')} style={[styles.input, focusedField === 'city' && styles.inputFocused]} value={profile.city} onChangeText={(text) => handleInputChange('city', text)} />

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={showDatepicker}
        >
          <Text style={styles.dateText}>
           {profile.dob}
          </Text>
        </TouchableOpacity>
        {/* <Modal visible={isDatePickerVisible} transparent={false} >
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.pickerContainer}>
              <DateTimePicker
                mode="single"
                date={selected}
                maxDate={new Date()}
                onChange={onDateChange}
                styles={{
                  ...defaultStyles,
                  selected: { backgroundColor: '#463458' }, // Highlight the selected day
                }}
              />
              <TouchableOpacity style={styles.doneButton} onPress={() => setDatePickerVisible(false)}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </Modal> */}

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={profile.email} editable={false} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput keyboardType="phone-pad" onBlur={handleBlur} onFocus={() => handleFocus('phone')} style={[styles.input, focusedField === 'phone' && styles.inputFocused]} value={profile.phone} onChangeText={(text) => handleInputChange('phone', text)} />

        <Divider style={styles.divider} />

        {/* Delete Profile Button */}
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 25 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 10,borderBottomWidth:0.5,borderBottomColor: 'grey',justifyContent: 'center',position: 'relative'},
  headerTitle: { fontSize: 20,flex: 1, textAlign:'center',marginRight: 50 },
  headerSave: { fontSize: 18,color:'#463458',position: 'absolute',right: 18, top:25 },
  picture: { width: 130, height: 130, borderRadius: 25, backgroundColor: '#EAEAEA' },
  imageContainer: {
  },
  deleteIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  dateInput: {
    width: '92%',
    alignSelf: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dateText: {
    fontSize: 16,
    color: 'black',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 25, // Ensures space at the bottom for scrolling
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 15,
  },
  uploadButton: {
    marginTop: 10,
    borderColor: '#463458',
  },
  inputFocused: {
    borderBottomColor: '#463458', // Change to purple when focused
  },
  avatar: { backgroundColor: '#EAEAEA' },

  label: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
  },
  input: {
    width: '100%',  // Adjust width as needed (80%-90% works well)
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 5,
    color: 'black',
  },
  genderContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    borderColor: '#ddd',
    alignItems: 'center',
    borderWidth:0.6,
  },
  selectedGender: {
    backgroundColor: '#463458',
    borderColor: 'grey',
  },
  genderText: {
    fontSize: 16,
    color: '#666',
  },
  selectedGenderText: {
    fontSize: 16,
    color: 'white',
  },
  divider: {
    height: 15, // Adjust thickness
    backgroundColor: '#fff', // Light Purple (Lavender)
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  deleteText: {
    color: '#463458',
    fontSize: 14,
  },
});

export default EditProfileScreen;
