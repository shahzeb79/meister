import React from 'react';
import { Text, StyleSheet, TouchableOpacity} from 'react-native';
import { ThemedView } from '@/components/ThemedView';

import { List, IconButton } from 'react-native-paper';
import { useRouter, useNavigation } from 'expo-router';
import { getAuth  } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GlobalBackground  from '@/components/GlobalBackground';


const SettingsPage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const auth = getAuth();
  const handleSignOut = async() => {
      console.log("User signed out");
      await auth.signOut();
      GoogleSignin.signOut();
      router.push('/auth/login');
    };
  return (
    <GlobalBackground>
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <ThemedView style={styles.header}>
      <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => navigation.goBack()} />
      <Text style={styles.headerTitle}>Settings</Text>
      </ThemedView>
      {/* Title */}
      {/* List of Settings */}
      <List.Section style={{paddingHorizontal: 15}}>
        <List.Item
          title="Security"
          left={() => <List.Icon icon="key" />}
          style={{ borderBottomWidth: 0.5,
            borderBottomColor: "grey", paddingVertical: 12}}
          onPress={() => {}}
        />
        <List.Item
          title="Notifications"
          left={() => <List.Icon icon="bullhorn" />}
          style={{ borderBottomWidth: 0.5,
            borderBottomColor: "grey",paddingVertical: 12}}
          onPress={() => {}}
        />
      </List.Section>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.versionText}>Версия приложения — 4.194.0 (2252903)</Text>
    </ThemedView>
    </GlobalBackground>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', paddingTop: 10,borderBottomWidth:0.5,borderBottomColor: 'grey',backgroundColor: 'transparent' },
  headerTitle: { fontSize: 20, alignSelf: 'center',flex: 1, textAlign:'center', marginRight: 55  },
  container: { flex: 1, paddingTop: 25,backgroundColor: 'transparent' },
  logoutButton: {
    marginTop: 15,
    alignSelf: 'center',
  },
  logoutText: {
    color: '#463458',
    fontSize: 17,
  },
  versionText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 12,
    marginTop: 30,
  },
});

export default SettingsPage;
