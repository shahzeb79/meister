import React, { useState, useRef, useEffect, useCallback } from "react";
import { TouchableOpacity, TextInput , StyleSheet, Dimensions } from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { IconButton,Text,RadioButton  } from 'react-native-paper';
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from '@/components/ThemedView';
import database from '../db';
import SubCategory from '../model/Subcategory';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import EmojiPicker from './locationsearch';
import GlobalBackground  from '@/components/GlobalBackground';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { range } from "rxjs";
const { width, height } = Dimensions.get("window"); // Get screen width and height



const PostCreation = () => {
  const router = useRouter();
  const { id, subcategory, category } = useGlobalSearchParams();
  const [questions, setQuestions] = useState([]);
  const [formatedAddress, setFormatedAddress] = useState('');
  const [answers, setAnswers] = useState({});
  const [date, setDate] = useState('');
  const flashListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [locationX, setLocationX] = useState({});
  const [zoom, setZoom] = useState(15);
  const [selectedPayment, setSelectedPayment] = useState("secure_deal");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [customBudget, setCustomBudget] = useState("");

  const [marker, setmarker] = useState([{
    coordinates: locationX
  }]);
  const subCategoriesCollection = database.get<SubCategory>('subcategory');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const mapView = useRef(null);
  const onAddSticker = () => {
    setIsModalVisible(true);
  };
  const onChange = useCallback((event: any, selectedDate: any) => {
    const formattedDate = dayjs(selectedDate).format('DD.MM.YYYY');
    setAnswers((prev) => ({ ...prev, ['date']: formattedDate }));
    setDate(formattedDate);
  }, []);

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange,
      mode: range,
      minimumDate: new Date()
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };
  const onModalClose = async (data: object) => {
    setLocationX({
      latitude: data.lat,
      longitude: data.lng,
    })
    mapView.current.setCameraPosition({
      coordinates:{
        latitude: data.lat,
        longitude: data.lng,
      },
      zoom: 15
    })
    setmarker([
      {
        coordinates:{
          latitude: data.lat,
          longitude: data.lng,
        }
      }
    ])
    const geocode = await Location.reverseGeocodeAsync({
      latitude: data.lat,
      longitude: data.lng,
    });
    setFormatedAddress(geocode[0].formattedAddress)
    setIsModalVisible(false);

  };

  const handleInputChange = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };
  const handleCustomBudgetChange = (value: string) => {
    setCustomBudget(value);
    setAnswers((prev) => ({ ...prev, ['budget']: value }));
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
        router.push({
          pathname: "/(tabs)/pages/confirmation",
          params: { answers: JSON.stringify(answers) },
        })
   
    }
  };
  const loadData = async () => {
    let location = await Location.getLastKnownPositionAsync();
    let currentLocation ={
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
    setLocationX(currentLocation);
    setmarker([
      {
        coordinates:currentLocation
      }
    ])
      const geocode = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
      });
      setFormatedAddress(geocode[0].formattedAddress)
      setAnswers((prev) => ({ ...prev, ['address']: geocode[0].formattedAddress }));
      setAnswers((prev) => ({ ...prev, ['coordinates']: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      } }));
     
  }
  useEffect(() => {
    const fetchQuestions = async () => {
      
      const subCategory = await subCategoriesCollection.find(id.toString()); // Find category by id
      const que = await subCategory.questions.fetch();
      setAnswers((prev) => ({ ...prev, ['subcategory']: subcategory }));
      setAnswers((prev) => ({ ...prev, ['category']: category }));
      setQuestions(que);
    };
    if (id){
        fetchQuestions();
        loadData();
    }
  }, [id]);

 
  const renderItem = ({ item }: any) => (
    <ThemedView style={styles.card}>
      <Text style={styles.label}>{item.question}</Text>
      {item.key == "title" &&
      <TextInput
        style={styles.input}
        value={item.value}
        onChangeText={(text) => handleInputChange("title", text )}
        placeholder="Enter Title"
      />
      }
      {item.key == "description" &&
      <TextInput
        style={styles.input}
        value={item.value}
        onChangeText={(text) => handleInputChange("description", text )}
        placeholder="Enter Description"
      />
      }
      {item.key == "location" && 
      <ThemedView style={{ backgroundColor: 'transparent',height: height*0.9}}>
        <ThemedView style={{flexDirection: 'row',  alignSelf: 'flex-start', width: width, backgroundColor: 'transparent' }}>
          <IconButton iconColor='rgb(28, 152, 82)' icon="map-marker" size={34} style={{ top: -9, left: -6 }}></IconButton>
          <ThemedText style={styles.locationbox} onPress={onAddSticker}> {formatedAddress}</ThemedText>
        </ThemedView>
      
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
      </EmojiPicker>
    
        <GoogleMaps.View 
          ref={mapView}
          cameraPosition={{
            coordinates:locationX,
            zoom: zoom
          }}
          markers={marker}
          uiSettings={{
            zoomControlsEnabled:true,
            mapToolbarEnabled:true,
            scaleBarEnabled:true,
            compassEnabled:true,
          }}
          style={{ marginTop: 10, width: width, height: height*0.5,shadowOffset: {
            width: 10,
            height: 10,
          },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 7,
          borderRadius: 1 }} 
        />

      </ThemedView>
      }
      {item.key == "date" &&
      <TouchableOpacity
        style={styles.dateinput}
        onPress={showDatepicker}
      > 
      <IconButton iconColor='rgb(28, 152, 82)' icon="calendar-range" size={28} style={{ top: -2, left: -10 }}></IconButton>
        <Text style={styles.dateText}>
          {date}
        </Text>
      </TouchableOpacity>
      }
      {item.key == "complex" &&
        <>
        <TextInput
        style={styles.input}
        value={item.value}
        onChangeText={(text) => {handleInputChange("additional", text )}}
        placeholder="Enter Addition Request"
        />
        <TextInput
          style={styles.input}
          value={item.value}
          onChangeText={(text) => handleInputChange("security", text )}
          placeholder="Enter Security Request"
        />
        </>
      }
      {item.key == "price" &&
        <>
        <Text style={styles.subtitle}>
          Indicate an approximate budget. The final cost can be discussed with the contractor.
        </Text>
        <TextInput
        style={styles.budgetInput}
        keyboardType="numeric"
        placeholder="Enter your budget (€)"
        value={customBudget}
        onChangeText={handleCustomBudgetChange}
      />
        <ThemedView style={styles.budgetOptions}>
        {["50", "100", "200", "500"].map((budget) => (
          <TouchableOpacity
            key={budget}
            style={[styles.budgetButton, selectedBudget === budget && styles.selectedBudgetButton]}
            onPress={() => {
              setSelectedBudget(budget)
              setCustomBudget(budget)
              setAnswers((prev) => ({ ...prev, ['budget']: budget }))}
            }
          >
            <Text style={[styles.budgetText]}>
              ca {budget} €
            </Text>
          </TouchableOpacity>
        ))}
        </ThemedView>
        <RadioButton.Group onValueChange={(value)=>{
          setAnswers((prev) => ({ ...prev, ['payment_method']: value }))
          setSelectedPayment(value)
        }} value={selectedPayment}>
        <ThemedView style={styles.option}>
        <RadioButton value="secure_deal" color="#463458"/>
          <ThemedView style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Pay through our App</Text>
            <Text style={styles.optionText}>
              Full guarantees on Payments. You negotiate directly with the contractor on payment terms.
            </Text>
          </ThemedView>
          
        </ThemedView>

        <ThemedView style={styles.option}>
        <RadioButton value="direct_payment" color="#463458"/>
          <ThemedView style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Direct Payment to Contractor</Text>
            <Text style={styles.optionText}>
              No guarantees or Platform compensations. You negotiate directly with the contractor on payment terms.
            </Text>
          </ThemedView>
          
        </ThemedView>

        <ThemedView style={styles.option}>
        <RadioButton value="bank_payment" color="#463458"/>
          <ThemedView style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Payment through Bank</Text>
            <Text style={styles.optionText}>
              No guarantees or YouDo compensations. You pay directly to the contractor's bank as agreed by both parties.
            </Text>
          </ThemedView>
          
        </ThemedView>
      </RadioButton.Group>
        </>
      }
      
    </ThemedView>
    );
  return (
    <GlobalBackground>
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
            extraData={[isModalVisible, locationX]}
            estimatedItemSize={3}
            estimatedListSize={{ height: height/1.19, width: width }}
            data={questions}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
          />
          <TouchableOpacity style={styles.button} onPress={nextQuestion}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
      </ThemedView>
     </GlobalBackground>
  );
};

export default PostCreation;

const styles = StyleSheet.create({
  optionTextContainer: {
    flex: 1, // Allows text to take full width
    marginLeft: 10, // Adds spacing between text and radio button
    backgroundColor: 'transparent',
  },
  option: {
    flexDirection: "row", // Moves radio button to the right
    alignItems: "center",
    width: width,
    paddingLeft: 5,
    paddingVertical: 10,
    backgroundColor: 'transparent'
  },
  optionTitle: {
    fontSize: 16,
    backgroundColor: "transparent",
    fontWeight: "bold",
  },
  optionText: {
    fontSize: 14,
    backgroundColor: "transparent",
    marginRight: 10,
  },
  selectedBudgetButton: {
    backgroundColor: "rgba(203, 63, 152, 0.6)",
  },
  budgetText: {
    fontSize: 14,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
  budgetOptions: {
    flexDirection: "row",
    width: width-20,
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: 'transparent'
  },
  budgetInput: {
    width: width-20,
    height: 70,
    fontSize: 30,
    marginBottom: 8,
    borderBottomColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(220, 212, 212, 0.57)',
  },
  budgetButton: {
    flex: 1,
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 15,
    borderWidth: 0.5,
    alignItems: "center",
  },
  dateinput: {
    width: width-20,
    flexDirection: 'row',
    height: 50,
    borderBottomColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(220, 212, 212, 0.57)',
  },
  dateText: {
    fontSize: 16,
    color: 'rgb(63, 58, 58)',
    paddingTop: 15,
    left: -15
  },
  button: {
    position:'absolute',
    top: height*0.94,
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
    height: height*0.9,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationbox: {
    fontSize: 16,
    color: 'rgb(63, 58, 58)',
    width: width-40,
    marginLeft: -15
  },
  input: {
    width: width-20,
    height: 50,
    marginBottom: 8,
    borderBottomColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(220, 212, 212, 0.57)',
  },
  header: { 
    flexDirection: 'row', 
    paddingTop: 10, 
    marginLeft: 0, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'grey',
    backgroundColor: 'transparent'
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
    backgroundColor: 'transparent',
  },

  questionText: { 
    fontSize: 18, 
    height: 40,
    marginBottom: 10 
  }

});
