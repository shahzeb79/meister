import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions , Dimensions } from "react-native";
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useRouter, useGlobalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { Divider, IconButton, Text } from "react-native-paper";
const { width, height } = Dimensions.get("window"); // Get screen width and height
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import { FlashList } from "@shopify/flash-list";

;
  const routes = [
    { key: 'first', title: 'Details' },
    { key: 'second', title: 'Notifications' },
  ];

  const SecondRoute = () => (
    <View style={styles.tabDetails } />
  );

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'green' }}
      activeColor="black"
      inactiveColor="grey"
      pressColor="white"
      style={{
        backgroundColor: 'white',
        elevation: 0, // Removes Android shadow
        shadowOpacity: 0, // Removes iOS shadow
      }}
      
    />
  );
const AdDetailsScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const router = useRouter();
  const { answers, user } = useGlobalSearchParams();
  let ad = JSON.parse(answers);
  ad = JSON.parse(ad);
  const addressInitials = ad.address.split(",")[0]
  const [locationString, setLocationString] = useState(addressInitials);
  const [locationCoordinates, setLocationCoordinates] = useState(ad.coordinates);
  const [title, setTitle] = useState(ad.title);
  const [budget, setBudget] = useState(ad.budget);
  const [paymentMethod, setPaymentMethod] = useState(ad.payment_method);
  delete ad.budget
  delete ad.coordinates
  delete ad.coordinates
  delete ad.address
 console.log(ad)
  useEffect(() => {
    

   
  }, []);
  
  const FirstRoute = () => (
    <ScrollView
    keyboardShouldPersistTaps="handled" // Ensures smooth scrolling when tapping
    showsVerticalScrollIndicator={false} 
    removeClippedSubviews={true}
    bounces={true}
    >
        <GoogleMaps.View 
            cameraPosition={{
                coordinates:locationCoordinates,
                zoom: 11
            }}
            properties={{
                mapType:GoogleMaps.MapType.NORMAL
            }}
            markers={[
                {
                  coordinates:locationCoordinates
                }
              ]}
            uiSettings={{
            zoomControlsEnabled:false,
            zoomGesturesEnabled: false,
            scrollGesturesEnabled: false
            }}
            style={{  height: height*0.18,borderRadius: 25 , marginTop:10, marginHorizontal:10,borderRadius: 28, // Optional, smooth edges
        
              // Shadow for iOS
              shadowColor: '#000',
              shadowOffset: { width: 3, height: 2 }, // Moves shadow to the bottom
              shadowOpacity: 0.55, // Adjust transparency
              shadowRadius: 1, // Blurriness of the shadow
          
              // Shadow for Android
              elevation: 8}} 
                />
                <ThemedView style={{flexDirection: 'column', marginHorizontal:13, marginTop: 15}}>
                <Text style={{color: 'grey', fontSize: 14,paddingHorizontal: 5}}>Address</Text>
                <Text style={{marginTop: 5,paddingBottom: 5,paddingHorizontal: 5, borderBottomWidth:0.2, borderBottomColor: 'grey'}}>{locationString}</Text>
               </ThemedView>
               <View style={{ width: Dimensions.get("window").width, alignSelf: "stretch" }}>
                <Divider style={{ backgroundColor: 'rgba(212, 207, 207, 0.54)', height: 30 }} />
              </View>
               {Object.entries(ad).map(([key, value], index) => (
                <ThemedView style={{flexDirection: 'column', marginHorizontal:0}}>
                  <Text 
                    key={index} 
                    style={{paddingBottom:3, paddingTop: 10,color: 'grey', fontSize: 14,marginHorizontal:13}}
                  >
                    {key}
                  </Text>
                  <Text style={{paddingBottom:10, paddingTop: 0,marginHorizontal:13, borderBottomWidth:0.2, borderBottomColor: 'grey'}}>{value}</Text>
                     <Divider style={{ backgroundColor: 'rgba(212, 207, 207, 0.54)', height: 8 }} />
                  </ThemedView>
                ))}

                
              
     </ScrollView>
  );
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  })
  return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => {
                  router.push('/pages')
                  }} />
                <Text style={styles.headerTitle}>Ad No 13557</Text>
            </ThemedView>
            <ThemedView style={styles.paymentcontainer}>
                <Text style={{ color:'rgb(28, 152, 82)',fontSize: 14,flex: 1, paddingTop: 15   }}>my add</Text>
                <IconButton iconColor='grey' icon="eye-outline"  size={16} style={{ margin: 0, padding: 0 }}/>
            </ThemedView>
            <ThemedView style={styles.paymentcontainer}>
                <Text style={{ fontSize: 18,flex: 1, fontWeight:'bold'   }}>{title}</Text>
                <IconButton iconColor='grey' icon="pencil-outline" size={18} style={{ margin: 0, padding: 0 }}/>
            </ThemedView>
            <ThemedView style={styles.paymentcontainer}>
                <Text style={styles.adTitle}>ca {budget}€ </Text>
                <IconButton iconColor='rgb(28, 152, 82)'  size={20} icon="credit-card" style={{ margin: 0, padding: 0 }} />
                <Text style={{ fontSize: 16 }}>{paymentMethod}</Text>
            </ThemedView>
            <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={renderScene}
                onIndexChange={setIndex}
                swipeEnabled={false}
                animationEnabled={false}
                />
                
        </ThemedView>
  );
};

const styles = StyleSheet.create({
    header: { flexDirection: 'row', paddingTop: 10,borderBottomWidth:0.5,borderBottomColor: 'grey',backgroundColor: 'white' },
    headerTitle: { fontSize: 20, alignSelf: 'center',flex: 1, textAlign:'center', marginRight: 55  },
    container: { flex: 1, paddingTop: 25 },
    tabDetails: { flex: 1, paddingTop: 15 },
    paymentcontainer: {flexDirection: 'row',
      paddingHorizontal: 13,
      backgroundColor: 'white',
      justifyContent: 'flex-start',
      alignItems: 'center',  // Changed from flex-start to center
      paddingVertical: 0,    // Reduce vertical padding
      marginVertical: 0},
    adTitle: { fontSize: 16, fontWeight: 'bold'  }
});

export default AdDetailsScreen;
