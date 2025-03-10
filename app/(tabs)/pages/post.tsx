import React, { useState, useRef, useEffect } from "react";
import { TouchableOpacity, Text, TextInput, Animated , StyleSheet, Dimensions } from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { IconButton } from 'react-native-paper';
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from '@/components/ThemedView';
import database from '../db';
import SubCategory from '../model/Subcategory';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { MapType } from "expo-maps/build/google/GoogleMaps.types";
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import EmojiPicker from './locationsearch';
const { width, height } = Dimensions.get("window"); // Get screen width and height



const PostCreation = () => {
  const router = useRouter();
  const { id, subcategory } = useGlobalSearchParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const flashListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [locationX, setLocationX] = useState({});
  const [mapType, setMapType] = useState(MapType.NORMAL);
  const subCategoriesCollection = database.get<SubCategory>('subcategory');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = (data: object) => {
    console.log(JSON.stringify(data))
    const geo= JSON.stringify(data)
    setLocationX({
      latitude: 52.0288407,
      longitude: 8.533503999999999,
    });
    setIsModalVisible(false);
  };

  const handleInputChange = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeout(() => {
        try {
          flashListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        } catch (error) {
          console.warn('Scroll failed:', error);
        }
      }, 10);
    }  else {
      console.log(answers)
    }
    
  };
  useEffect(() => {
    setMapType(MapType.HYBRID)
    const fetchQuestions = async () => {
      let location = await Location.getLastKnownPositionAsync();
      let currentLocation ={
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
      setLocationX(currentLocation);
      const subCategory = await subCategoriesCollection.find(id.toString()); // Find category by id
      const que = await subCategory.questions.fetch();
      setQuestions(que);
    };
    if (id) fetchQuestions();
  }, [id,isModalVisible]);

  const renderItem = ({ item }: any) => (
    <ThemedView style={styles.card}>
      <Text style={styles.label}>{item.question}</Text>
      {item.key != "urgency" &&
      <TextInput
        style={styles.input}
        value={item.value}
        onChangeText={(text) => handleInputChange(item.question, text )}
        placeholder="Enter text"
      />
      }
      {item.key == "urgency" && 
      <ThemedView>
      <ThemedText onPress={onAddSticker}>This app includes example code to help you get started.</ThemedText>
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
      </EmojiPicker>
      <GoogleMaps.View 
        cameraPosition={{
          coordinates:locationX,
          zoom: 13
        }}
        properties={{
          mapType:mapType
        }
        }
        uiSettings={{
          zoomControlsEnabled:true,
          mapToolbarEnabled:true,
          scaleBarEnabled:true,
          compassEnabled:true,
        }}
        style={{width: width, height: height*0.5 }} 
        
      />

      </ThemedView>
      }
      
    </ThemedView>
    );
  return (
        <ThemedView style={styles.container}>
          <ThemedView style={styles.header}>
            <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => {
              if (currentIndex > 0) {
                const prevIndex = currentIndex - 1;
                setCurrentIndex(prevIndex);
                setTimeout(() => {
                  try {
                    flashListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
                  } catch (error) {
                    console.warn('Scroll failed:', error);
                  }
                }, 10);
              } else {
                setCurrentIndex(0);
                router.back()
              }
            }} />
            <Text style={styles.headerTitle}>{subcategory}</Text>
          </ThemedView>
          <FlashList
            ref={flashListRef}
            horizontal
            estimatedItemSize={3}
            estimatedListSize={{ height: height/1.19, width: width }}
            data={questions}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={true}
            renderItem={renderItem}
          />
          <TouchableOpacity style={styles.button} onPress={nextQuestion}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
      </ThemedView>
  );
};

export default PostCreation;

const styles = StyleSheet.create({
  scrollBarContainer: {
    width: '90%',
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  scrollBar: {
    height: 4,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  button: {
    position:'absolute',
    top: height*0.95,
    backgroundColor: "#463458",
    height: 50,
    width: '70%',
    borderRadius: 30,
    marginTop:10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 16,
  },
  card: {
    width: width-20,
    height: height*0.5,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: width-20,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  header: { 
    flexDirection: 'row', 
    paddingTop: 10, 
    marginLeft: 0, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'grey' 
  },
  headerTitle: { 
    fontSize: 18, 
    alignSelf: 'center', 
    flex: 1, 
    textAlign: 'center', 
    marginRight: 55 
  },
  container: { 
    flex: 1, 
    paddingTop: 25,
  },
  itemContainer: { 
    justifyContent: "center", 
    width: 100,
    height: 100,
    alignItems: "center", 
    padding: 20 
  },
  questionText: { 
    fontSize: 18, 
    height: 40,
    marginBottom: 10 
  }

});
