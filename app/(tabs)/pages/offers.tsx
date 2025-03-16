import React, {memo, useCallback, useEffect,useMemo,useRef,useState} from 'react';
import { TouchableOpacity, TextInput, StyleSheet, Text,ActivityIndicator, View, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from "@shopify/flash-list";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import GlobalBackground  from '@/components/GlobalBackground';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import {storage} from '../auth/login'
import database from '../db';
import Posting from '../model/Posting';
import { Q } from '@nozbe/watermelondb';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';

//import { createRandomPosts } from './randompost'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export default function OffersScreen() {
  const router = useRouter();
  const [renderStartTime, setRenderStartTime] = useState<number | null>(null);
  const [postings, setPostings] = useState<Array<Posting>>([]);  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPostings, setFilteredPostings] = useState<Array<Posting>>([]);
  const [isMapView, setIsMapView] = useState(false);
  const [locationX, setLocationX] = useState({});
  const [zoom, setZoom] = useState(10);
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([{
  }]);
  const [markerX, setmarkerX] = useState({});
  const postingCollection = database.get<Posting>('posting');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['90%'], []);

  // Function to open the bottom sheet


  const loadMapData = async (data: Posting[]) => {
    const latitude = Number(storage.getNumber('user.latitude'))
        const longitude = storage.getNumber('user.longitude')
        let currentLocation ={
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
        //createRandomPosts(30);
        setLocationX(currentLocation)
        if (data.length > 0) {
            const markerArray = data
              .filter(posting => posting.questions?.coordinates)
              .map(posting => ({
                coordinates:{
                    latitude: posting.questions.coordinates.latitude,
                    longitude: posting.questions.coordinates.longitude,
                }
              }));
              setMarkers(markerArray);
              
              setLoading(false);
              
          } else {
            setMarkers([{
              coordinates:{
                latitude: latitude,
                longitude: latitude,
            }
            }])
          }

  };
  const fetchPostings = async () => {
    try {
      // Query the database for all postings
      const postingsData = await postingCollection.query( Q.sortBy('created_at', Q.desc), Q.take(50)).fetch();
      setPostings(postingsData);
      setFilteredPostings(postingsData);
      await loadMapData(postingsData);

      //console.log(postings[0].questions)
    } catch (error) {
      console.error("Error fetching postings:", error);
    }
  };
  useEffect(() => {
    setRenderStartTime(Date.now());
    fetchPostings();
  }, []);
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredPostings(postings); // Show all if search is empty
      return;
    }
    setFilteredPostings(postings.filter(posting =>
      posting.questions.title.toLowerCase().includes(text.toLowerCase())
    ));
    
  };

  const ItemComponent = ({ item }:{ item: Posting }) => {
    return (
    <TouchableOpacity style={styles.cardFooter}>
      <ThemedText style={{ fontWeight: "600", marginBottom: 5 }}>
        {item.questions.title}
      </ThemedText>
      <ThemedText style={{ fontSize: 14, color: "grey" }}>
        {item.questions.date}
      </ThemedText>
      <ThemedText style={{ fontSize: 14, color: "grey" }}>
        {item.questions.address}
      </ThemedText>
      <ThemedText style={{ fontWeight: "600", marginTop: 10 }}>
        Up to {item.questions.budget}€
      </ThemedText>
    </TouchableOpacity>
    );
  };
  const openBottomSheet = useCallback(() => {
    scaleX.value = withTiming(0.9, { duration: 300 });
    scaleY.value = withTiming(0.95, { duration: 300 });
    bottomSheetRef.current?.expand();
  }, []);
  const handleClosePress = () => {
    scaleX.value = withTiming(1);
    scaleY.value = withTiming(1);
    bottomSheetRef.current?.close()
  }
    


  if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        );
      }
  if(!isMapView){
      return (
          <GlobalBackground>
            <GestureHandlerRootView  >
              <Animated.View style={[styles.container,{
                transform: [{scaleX}, {scaleY}]   // added shared values in animated view style
              }]}>
                  <ThemedView style={styles.header}>
                      <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => router.back()} />
                      <TextInput style={styles.searchBar} placeholder="Specialist or service" onChangeText={handleSearch} value={searchQuery}/>
                      <IconButton iconColor='#463458' icon="map-outline" size={22} onPress={() => setIsMapView(true)} />
                  </ThemedView>
                
                  <FlashList
                    data={filteredPostings}
                    keyExtractor={(item, index) => index.toString()}
                    estimatedItemSize={141.45} // Adjust based on your UI
                    renderItem={({ item }) => <ItemComponent item={item} />}
                    showsVerticalScrollIndicator={false}
                  />
                  <TouchableOpacity style={styles.filterButton} onPress={openBottomSheet}>
                    <IconButton iconColor='#fff' icon="map-outline" size={22} style={{ margin: -5, padding:0}}/>
                    <Text style={styles.filterText}>Filter</Text>
                  </TouchableOpacity>
                </Animated.View>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    detached={true}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    handleComponent={null}
                
                    backgroundStyle={{
                      borderRadius: 20,  // Round top-left corner
                    }}

                  >
                  <BottomSheetView style={styles.contentContainer}>
                  <View style={styles.sheetContent}>
                    <Text style={styles.sheetTitle}>Фильтры</Text>
                    <Text>Категории: Все категории</Text>
                    <Text>Местоположение: Москва</Text>
                    <IconButton iconColor='#000' icon="map-outline" size={22} style={{ margin: -5, padding:0}} onPress={handleClosePress}/>
                    {/* Add other filter options here */}
                  </View>
                  </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
          </GlobalBackground>
      );
}
return (
  <GlobalBackground>
  <ThemedView style={styles.container}>
  <ThemedView style={styles.header}>
      <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => router.back()} />
      <TextInput style={styles.searchBar} placeholder="Specialist or service" onChangeText={handleSearch} value={searchQuery}/>
      <IconButton iconColor='#463458' icon="format-list-bulleted" size={22} onPress={() => setIsMapView(false)} />
  </ThemedView>
  <MapView
    provider={PROVIDER_GOOGLE}
    initialRegion={locationX}
    style={{ width: "100%", height: "92%"}}
    >
    {markers.map((marker, index) => (
      <Marker
        key={index}
        coordinate={marker.coordinates}
        pinColor='#311D45'
      />
    ))}
  </MapView>
  {/* <GoogleMaps.View 
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
          style={{ width: "100%", height: "92%"}} 
        /> */}
  </ThemedView>
  </GlobalBackground>
);
}

const styles = StyleSheet.create({
 
  container: { flex: 1, paddingTop: 25,backgroundColor: 'transparent' },
  header: { flexDirection: 'row',backgroundColor: 'transparent', alignItems: 'center', paddingTop: 10,borderBottomWidth:0.5,borderBottomColor: 'grey',justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, color: '#311D45'},
  sheetContent: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 30, // Adjust based on your UI
    left: '50%',
    transform: [{ translateX: -57 }], // Center horizontally
    backgroundColor: 'rgba(70, 52, 95, 1)',
    paddingVertical: 9,
    paddingHorizontal: 28,
    borderRadius: 35,
    
  },
  filterText: {
    color: '#fff',
    fontSize: 16,
  },
  cardFooter: {
    width: "100%",
    padding: 15,
    justifyContent: 'center',
    borderBottomWidth:0.5,
    backgroundColor: 'white',

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


  title: {
    paddingHorizontal: 13,
    backgroundColor: 'transparent',
    marginVertical:10
  },
  searchBar: {
    backgroundColor: 'rgba(220, 212, 212, 0.57)',
    height: 38,
    width: 280,
    borderRadius: 40,
    paddingHorizontal:15,
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
});
