import React, {useEffect,useState} from 'react';
import { TouchableOpacity, TextInput, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import GlobalBackground  from '@/components/GlobalBackground';

import database from '../db';
import seedData from '../db/seedData';
import Posting from '../model/Posting';
import { Q } from '@nozbe/watermelondb';

const { width, height } = Dimensions.get("window"); // Get screen width and height

export default function HomeScreen() {
  const router = useRouter();
  const [postings, setPostings] = useState<Array<Posting>>([]);  
  const postingCollection = database.get<Posting>('posting');
  useEffect(() => {
    const fetchCategories = async () => {
      await database.write(async () => {
        await database.unsafeResetDatabase();
      });
      
      seedData();
  
    };
    //fetchCategories();
    const fetchPostings = async () => {
      try {
        // Query the database for all postings
        const postingsData = await postingCollection.query( Q.sortBy('created_at', Q.desc), Q.take(3)).fetch();
        setPostings(postingsData);
      } catch (error) {
        console.error("Error fetching postings:", error);
      }
    };
    fetchPostings();

  }, [postings]);
  return (
    <GlobalBackground>
    <ThemedView style={styles.container} >
      
      <ThemedView style={styles.topBar}>
        <IconButton iconColor='#463458' icon="account-circle" size={30} onPress={() => router.push('/(tabs)/pages/profilepage')} />
        <IconButton iconColor='#463458' icon="cog" size={28} onPress={() => router.push('/(tabs)/pages/settings')} />
      </ThemedView>
      <ThemedView style={styles.title}>
        <ThemedText style={{fontSize: 20}}> What needs to be done?</ThemedText>
        <TextInput style={styles.searchBar} placeholder="Specialist or service" />
        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/pages/categories')}>
        <ThemedText style={styles.categoryTitle}>View Categories  </ThemedText>
        <IconButton iconColor='#238ce6' icon="arrow-right" size={19} style={{bottom: 9.2, right: 20}}/>
        </TouchableOpacity>
        
      </ThemedView>
      {postings.map((posting, index) => (

          <ThemedView key={index} style={styles.cardFooter}>
            
            <ThemedText style={{fontWeight: '600', marginBottom: 5}}>{posting.questions.title}</ThemedText>
            <ThemedView style={{flexDirection: 'row',marginBottom: 10}}>
              <ThemedText style={{fontSize: 14, color: 'grey'}}>{posting.questions.budget}€ • </ThemedText>
              <ThemedText style={{fontSize: 14, color: 'grey'}}>Active • </ThemedText>
              <ThemedText style={{fontSize: 14, color: 'grey'}}>{posting.questions.date} • </ThemedText>
              <ThemedText style={{fontSize: 14, color: 'grey'}}>0 Notifications</ThemedText>
            </ThemedView>
            <TouchableOpacity style={styles.button}>
              <ThemedText style={styles.buttonText}>See Offer</ThemedText>
            </TouchableOpacity>
          </ThemedView>
      ))}
       
        <TouchableOpacity style={{ position: 'absolute', bottom: 25, borderTopWidth: 0.3, width: width}} onPress={() => {
          router.push('/(tabs)/pages/offers')
        }}>
        <ThemedText style={{ marginTop: 15, marginLeft: 15, color: 'rgb(28, 152, 82)', fontWeight: '400'}}>View Offers in The Area </ThemedText>
        </TouchableOpacity>
    </ThemedView>
    </GlobalBackground>
  );
}

const styles = StyleSheet.create({
 
  container: {
    flex:1,
    backgroundColor: 'transparent'

  },
  cardFooter: {
    width: "90%",
    marginHorizontal: 13,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#fff',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
  },
  button: {
    borderColor: '#4CAF50',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: 100,
    borderRadius: 30,
    alignItems: 'center'
  },
  buttonText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  topBar: {
    flexDirection: 'row',
    paddingTop: 35,
    justifyContent: 'space-between',
    backgroundColor: 'transparent'

  },

  title: {
    paddingHorizontal: 13,
    paddingTop: 18,
    backgroundColor: 'transparent'

  },
  searchBar: {
    backgroundColor: 'rgba(220, 212, 212, 0.57)',
    height: 50,
    borderRadius: 10,
    marginVertical: 20,
    paddingHorizontal:10,
    
  },
  category: {
    marginBottom: 20,
  },
  categoryTitle: {
    paddingLeft: 2,
    fontSize: 18,
    color: 'rgb(14, 136, 244)'
  },
  card: {
    flexDirection: 'row',
    width: 200,
    height: 40,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  cardText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  count: {
    color: 'white',
    fontSize: 12,
  },
});
