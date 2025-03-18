import React, { memo, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, TextInput, StyleSheet, Text, ActivityIndicator, View, Dimensions, ScrollView, Image, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import { FlashList } from "@shopify/flash-list";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import GlobalBackground from '@/components/GlobalBackground';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { storage } from '../auth/login'
import database from '../db';
import Posting from '../model/Posting';
import { Q } from '@nozbe/watermelondb';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { ReduceMotion, useSharedValue } from 'react-native-reanimated';
import { createRandomPosts } from './randompost'
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { createStackNavigator, StackNavigationOptions, TransitionPresets } from "@react-navigation/stack";

const Stack = createStackNavigator();

const { width, height } = Dimensions.get("window"); // Get screen width and height
const categories = [
  "Renovation & Construction",
  "Computer & Electronics",
  "Cleaning & House Keeping",
  "Electrical",
  "Design"
];
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};
export default function OffersScreen() {
  const router = useRouter();
  const [postings, setPostings] = useState<Array<Posting>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPostings, setFilteredPostings] = useState<Array<Posting>>([]);
  const [isMapView, setIsMapView] = useState(false);
  const [locationX, setLocationX] = useState({});
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([{
  }]);
  const postingCollection = database.get<Posting>('posting');
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['92%'], []);
  const Categories = () => {
    const navigation = useNavigation();
    return (
      <View style={{ flex: 1 }}>
        <ThemedView style={styles.header}>
          <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => navigation.goBack()} />
          <Text style={{ fontSize: 20, alignSelf: 'center', flex: 1, textAlign: 'center', marginRight: 55 }}>Categories</Text>
        </ThemedView>
        <FlashList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.sheetCards}>
            <Text style={{ fontSize:16, marginVertical: 10 }}>{item}</Text>
          </TouchableOpacity>
        )}
        estimatedItemSize={50} // Improve performance by providing an estimated item height
      />
      </View>);

  };
  const Filters = () => {
    const { navigate } = useNavigation();
    return (
      <>
        <ThemedView style={styles.header}>
          <IconButton iconColor='#463458' icon="close" size={26} onPress={() => {
            bottomSheetRef.current?.close()
          }} />
          <Text style={{ fontSize: 20, alignSelf: 'center', flex: 1, textAlign: 'center', marginRight: 55 }}>Filters</Text>
        </ThemedView>
        <TouchableOpacity style={styles.sheetCards} onPress={() => navigate("Categories")}>
          <ThemedText style={{ fontSize:16, marginVertical: 10 }}>
            Categories Select
          </ThemedText>

        </TouchableOpacity>
        <View style={styles.sheetCards}>
          <TextInput style={{ marginVertical: 10, alignSelf: 'center' }} placeholder="Minimum Budget" />
        </View>

        <View style={styles.sheetCards}>
          <ThemedText style={{ fontSize:16, marginVertical: 10 }}>
            Payment By Card Only
          </ThemedText>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <View style={styles.sheetCards}>
          <ThemedText style={{ fontSize:16, marginVertical: 10 }}>
            Verified Users Only
          </ThemedText>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </>
    );
  };
  const Navigator = () => {
    const screenOptions = useMemo<StackNavigationOptions>(
      () => ({
        ...TransitionPresets.SlideFromRightIOS,
        headerMode: 'screen',
        headerShown: false,
        animation: "none",
        safeAreaInsets: { top: 0 },
        cardStyle: {
          borderRadius: 15,
          overflow: 'visible',
        },
      }),
      []
    );
    const screenAOptions = useMemo(() => ({ headerLeft: () => null }), []);
    const screenBOptions = useMemo(() => ({ headerLeft: () => null }), []);
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Filters"
          options={screenAOptions}
          component={Filters}
        />
        <Stack.Screen name="Categories" options={screenBOptions} component={Categories} />
      </Stack.Navigator>
    );
  };
  const loadMapData = async (data: Posting[]) => {
    const latitude = Number(storage.getNumber('user.latitude'))
    const longitude = storage.getNumber('user.longitude')
    let currentLocation = {
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
          coordinates: {
            latitude: posting.questions.coordinates.latitude,
            longitude: posting.questions.coordinates.longitude,
          }
        }));
      setMarkers(markerArray);

      setLoading(false);

    } else {
      setMarkers([{
        coordinates: {
          latitude: latitude,
          longitude: latitude,
        }
      }])
    }

  };
  const fetchPostings = async () => {
    try {
      // Query the database for all postings
      const postingsData = await postingCollection.query(Q.sortBy('created_at', Q.desc), Q.take(50)).fetch();
      setPostings(postingsData);
      setFilteredPostings(postingsData);
      await loadMapData(postingsData);
      const locations = postingsData.map(item => item.questions.coordinates);
      const nearby = locations
        .filter((loc) => {
          const distance = getDistance(
            locationX.latitude,
            locationX.longitude,
            loc.latitude,
            loc.longitude
          );
          return distance <= 100;
        })
        .map((loc) => ({
          coordinates: {
            latitude: loc.latitude,
            longitude: loc.longitude,
          },
        }));
      setMarkers(nearby)

    } catch (error) {
      console.error("Error fetching postings:", error);
    }
  };
  useEffect(() => {
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

  const ItemComponent = ({ item }: { item: Posting }) => {
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
    // scaleX.value = withTiming(0.9, { duration: 300 });
    // scaleY.value = withTiming(0.95, { duration: 300 });

    bottomSheetRef.current?.expand();
  }, []);
  // const handleClosePress = () => {
  //   // scaleX.value = withTiming(1,{ duration: 300 });
  //   // scaleY.value = withTiming(1,{ duration: 300 });
  //   bottomSheetRef.current?.close()
  // }
  // const HandleComponent = () => (
  //   <View style={{ padding: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'grey' }}>
  //     <IconButton iconColor='#000' icon="close" size={24} style={{ margin: -5, padding: 0 }} onPress={handleClosePress} />
  //     <Text style={{ fontSize: 20, alignSelf: 'center', flex: 1, textAlign: 'center', marginRight: 45 }}>Filters</Text>
  //   </View>
  // );
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  )
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!isMapView) {
    return (
      <GestureHandlerRootView style={{ height: height + 25 }}>
        <Animated.View style={[styles.container]}>
          <ThemedView style={styles.header}>
            <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => router.back()} />
            <TextInput style={styles.searchBar} placeholder="Specialist or service" onChangeText={handleSearch} value={searchQuery} />
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
            <IconButton iconColor='#fff' icon="map-outline" size={22} style={{ margin: -5, padding: 0 }} />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </Animated.View>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          handleComponent={null}
          backdropComponent={renderBackdrop}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={false}
          index={-1}
          enableDynamicSizing={false}
          animationConfigs={{
            reduceMotion: ReduceMotion.Always
          }}
        >
          <Navigator />
        </BottomSheet>
      </GestureHandlerRootView>
    );
  }
  return (
    <GlobalBackground>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => router.back()} />
          <TextInput style={styles.searchBar} placeholder="Specialist or service" onChangeText={handleSearch} value={searchQuery} />
          <IconButton iconColor='#463458' icon="format-list-bulleted" size={22} onPress={() => setIsMapView(false)} />
        </ThemedView>
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={locationX}
          style={{ width: "100%", height: "92%" }}
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

  container: { flex: 1, paddingTop: 25, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center', paddingTop: 10, borderBottomWidth: 0.5, borderBottomColor: 'grey', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, color: '#311D45' },
  flashListBehind: {
    zIndex: 0, // Send FlashList behind the BottomSheet
  },
  sheetContent: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
  },
  filterButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 20, // Adjust based on your UI
    left: '50%',
    transform: [{ translateX: -58 }], // Center horizontally
    backgroundColor: 'rgba(70, 52, 95, 1)',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 35,

  },
  filterText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 2
  },
  cardFooter: {
    width: "100%",
    backgroundColor: 'transparent',
    padding: 15,
    justifyContent: 'center',
    borderBottomWidth: 0.5,

  },
  sheetCards: {
    width: "100%",
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey'
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
    marginVertical: 10
  },
  searchBar: {
    backgroundColor: 'rgba(220, 212, 212, 0.57)',
    height: 38,
    width: 280,
    borderRadius: 40,
    paddingHorizontal: 15,
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
