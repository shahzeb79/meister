import React, {useLayoutEffect, useState} from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Avatar, Button, IconButton, Divider } from 'react-native-paper';
import { useNavigation, useRouter } from 'expo-router';
import database from '../db';
import User from '../model/userprofile';
import { ThemedView } from '@/components/ThemedView';

const ProfilePage = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const initialProfile = {
    firstName: '',
    lastName: '',
    aboutme: '',
    gender: '',
    city: '',
    dob: '',
    email: '',
    phone: '',
    profilePicture:''
  };
  const [profile, setProfile] = useState(initialProfile);
  const postsCollection = database.get<User>('userprofile');
  const fetchProfile = async () => {
    try {
      const users = await postsCollection.query().fetch(); // Use the correct email or ID to query the profile
      if (users.length > 0) {
        const user = users[0];
        setProfile(user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  useLayoutEffect(() => {    
    fetchProfile();
  }, []);


  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <ThemedView style={styles.container}>
      {/* Profile Picture */}
      <ThemedView style={styles.header}>
        <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Profile</Text>
        <IconButton iconColor='#463458' icon="pencil" size={22} onPress={() => router.push('./editprofile')} />
      </ThemedView>
      <ThemedView style={styles.profileSection}>
        {profile.profilePicture ? (
          <Image source={{ uri: profile.profilePicture }} style={styles.picture} />
        ) : (
          <Avatar.Icon size={120} icon="account" color="#A9A9A9" style={styles.avatar} />
        )}
        <Text style={styles.taskCount}>1</Text>
        <Text style={styles.taskText}>{profile.firstName}</Text>
      </ThemedView>

      <Button mode="outlined" icon="shield-check" contentStyle={{ flexDirection: 'row-reverse', paddingHorizontal: 15 }} style={styles.insuranceButton}>
        Verified
      </Button>
      
      <Divider style={styles.divider} />

      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About me</Text>
        </ThemedView>
        <Text style={styles.memberSince}>{profile.aboutme}</Text>
      </ThemedView>

      <Divider style={styles.divider} />

      <ThemedView style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.verifiedRow}>
          <IconButton icon="cellphone" size={19} style={{ position: 'relative', left:-15}} />
          <Text style={{position: 'absolute',left:20, color: 'grey'}}>{profile.phone}</Text>
        </View>
        <Text style={styles.userId}>Member since: 12542664</Text>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 10,borderBottomWidth:0.5,borderBottomColor: 'grey',justifyContent: 'space-between' },
  headerTitle: { fontSize: 20},
  container: { flex: 1, paddingTop: 25 },
  userName: { fontSize: 18, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  profileSection: { alignItems: 'center', marginVertical: 15,paddingHorizontal: 15, },
  avatar: { backgroundColor: '#EAEAEA' },
  picture: { width: 150, height: 150, borderRadius: 25, backgroundColor: '#EAEAEA' },
  taskCount: { fontSize: 20, fontWeight: 'bold', color: '#311D45', marginTop: 8 },
  taskText: { fontSize: 14, color: '#311D45' },
  insuranceButton: { borderColor: '#311D45', marginVertical: 10, width: "70%", alignSelf: 'center' },
  divider: { marginVertical: 10 },
  section: { marginBottom: 5,paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  memberSince: { fontSize: 16, color: 'gray' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  userId: { fontSize: 14, color: 'gray' },
});

export default ProfilePage;
