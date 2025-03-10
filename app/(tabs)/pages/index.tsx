import React, {useEffect} from 'react';
import { TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import database from '../db';
// import Categories from '../model/Category';
import seedData from '../db/seedData';
// import SubCategory from '../model/Subcategory';


export default function HomeScreen() {
  const router = useRouter();
  
  useEffect(() => {
    const fetchCategories = async () => {
      // await database.write(async () => {
      //   await database.unsafeResetDatabase();
      // });
      
      //seedData();
      // console.log("calling Seeddata")
      // const data = await categoriesCollection.query().fetch();
      // data.map(async (category) => {
      //   const subcategories = await category.subcategory.fetch(); // Fetch related subcategories
      //   console.log({
      //     id: category.id,
      //     name: category.name,
      //     subcategories: subcategories.map((sub: any) => sub.name),
      //   })
      // })
    };
    fetchCategories();
  }, []);
  return (
    <ThemedView style={styles.container} >
      
      <ThemedView style={styles.topBar}>
        <IconButton iconColor='#463458' icon="account-circle" size={30} onPress={() => router.push('/(tabs)/pages/profilepage')} />
        <IconButton iconColor='#463458' icon="cog" size={28} onPress={() => router.push('/(tabs)/pages/settings')} />
      </ThemedView>
      <ScrollView
      bounces={true}
      overScrollMode='always'
      scrollEventThrottle={50}
      showsVerticalScrollIndicator={false}
>
      <ThemedView style={styles.title}>
        <ThemedText style={{fontSize: 20}}> What do you need done?</ThemedText>
        <TextInput style={styles.searchBar} placeholder="Specialist or service" />
        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/pages/categories')}>
        <ThemedText style={styles.categoryTitle}>View Categories  </ThemedText>
        <IconButton iconColor='#238ce6' icon="arrow-right" size={17} style={{bottom: 9, right: 20}}/>
        </TouchableOpacity>
        
      </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
 
  container: {
    flex:1,
    backgroundColor: 'white'
  },
  topBar: {
    flexDirection: 'row',
    paddingTop: 35,
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
  },

  title: {
    paddingHorizontal: 20,
    paddingTop: 18,
    backgroundColor: 'transparent'
  },
  searchBar: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
  },
  category: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    color: '#238ce6'
  },
  card: {
    flexDirection: 'row',
    width: 160,
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
