import React from 'react';
import { Text, StyleSheet, TouchableOpacity} from 'react-native';
import { ThemedView } from '@/components/ThemedView';

import { List, IconButton } from 'react-native-paper';
import { useRouter, useNavigation } from 'expo-router';
import { getAuth  } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const SettingsPage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const auth = getAuth();
  const handleSignOut = async() => {
      console.log("User signed out");
      await auth.signOut();
      GoogleSignin.signOut();
      router.dismissAll();
      router.push('/auth/login');
    };
  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <ThemedView style={styles.header}>
      <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => navigation.goBack()} />
      <Text style={styles.headerTitle}>Settings</Text>
      </ThemedView>
      {/* Title */}
      {/* List of Settings */}
      <List.Section style={{paddingHorizontal: 20}}>
        <List.Item
          title="Смена пароля"
          left={() => <List.Icon icon="key" />}
          style={{borderBottomColor: 'lightgrey', borderBottomWidth: 0.5, paddingVertical: 20}}
          onPress={() => {}}
        />
        <List.Item
          title="Команды Siri"
          left={() => <List.Icon icon="bullhorn" />}
          style={{borderBottomColor: 'lightgrey', borderBottomWidth: 0.5,paddingVertical: 20}}
          onPress={() => {}}
        />
      </List.Section>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Выйти из профиля</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.versionText}>Версия приложения — 4.194.0 (2252903)</Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', paddingTop: 10,marginLeft: 0,borderBottomWidth:0.5,borderBottomColor: 'grey' },
  headerTitle: { fontSize: 20, alignSelf: 'center',flex: 1, textAlign:'center', marginRight: 55  },
  container: { flex: 1, paddingTop: 25 },
  logoutButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  logoutText: {
    color: 'purple',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 12,
    marginTop: 30,
  },
});

export default SettingsPage;
