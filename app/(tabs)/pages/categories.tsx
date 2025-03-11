import React, { useEffect, useState,useCallback, useMemo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from '@/components/ThemedView';
import { IconButton } from 'react-native-paper';
import Icon from "react-native-vector-icons/FontAwesome5";
import Categories from '../model/Category';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolateColor } from "react-native-reanimated";
import database from '../db';
import GlobalBackground  from '@/components/GlobalBackground';


import { useNavigation, useRouter } from 'expo-router';
const itemsx = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
  { id: "4" },
  { id: "5" },
  { id: "6" },
  { id: "7" },
  { id: "8" },
  { id: "9" },
  { id: "10" },
  { id: "11" },

];
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ItemList = () => {
  const categoriesCollection = database.get<Categories>('category');
  const router = useRouter();

  const [items, setItems] = useState(itemsx);  // Holds real data
  const [loading, setLoading] = useState(true);
  const colorAnimation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      colorAnimation.value,
      [0, 1], // Interpolating between these values
      ["#f2eef2", "#e0dde7"] // White → Light Grey
    ),
  }));
  useEffect(() => {
      const fetchCategories = async () => {
        const data = await categoriesCollection.query().fetch();
        const categoriesWithSubcategories = await Promise.all(
          data.map(async (category) => {
            const subcategories = await category.subcategory.fetch(); // Fetch related subcategories
            return{
              id: category.id,
              name: category.name,
              icon: "tools", 
              color: "rgb(141, 102, 117)",
              subcategories: subcategories.map((sub: any) => ({
                id: sub.id,
                name: sub.name,
              })),
            }
          })
        );
        setItems(categoriesWithSubcategories);
        setLoading(false);

      };
      fetchCategories();
      colorAnimation.value = withRepeat(withTiming(1, { duration: 100 }), -1, true);
    }, []);
    const handleNavigation = useCallback(
      (id: string, name: string) => {
        router.push(`/(tabs)/pages/${id}?name=${name}`);
      },
      [router]
    );
  return (
   <GlobalBackground>
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Category</Text>
      </ThemedView>
      <FlashList
        data={items}
        estimatedItemSize={12}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => loading ? (
          <AnimatedTouchableOpacity style={[styles.touchable]}>
            <Animated.View
              style={[{
                width: 30,
                height: 30,
                borderRadius: 9, // Makes it circular
                alignItems: "center",
                marginRight: 13,
                justifyContent: "center",
              }, animatedStyle]}
            >
            </Animated.View>
            <Animated.View
              style={[{
                width: 300,
                height: 30,
                borderRadius: 7, // Makes it circular
                backgroundColor: "lightgrey", // Dynamic background color
                alignItems: "center",
                marginRight: 13,
                justifyContent: "center",
              }, animatedStyle]}
            >
            </Animated.View>

          </AnimatedTouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              marginLeft: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "grey",
            }}
            onPress={() =>router.push(`/(tabs)/pages/${item.id}?name=${item.name}`)}
          >
            <ThemedView
              style={{
                width: 30,
                height: 30,
                borderRadius: 7, // Makes it circular
                backgroundColor: item.color, // Dynamic background color
                alignItems: "center",
                marginRight: 13,
                justifyContent: "center",
              }}
            >
              <Icon name={item.icon} size={16} color="white" />
            </ThemedView>

            <Text style={{ fontSize: 16, flex: 1 }}>{item.name}</Text>
            <IconButton icon="chevron-right" size={20} iconColor="grey" />
          </TouchableOpacity>
        )}
      />
    </ThemedView>
    </GlobalBackground>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', paddingTop: 10, marginLeft: 0, borderBottomWidth: 0.5, borderBottomColor: 'grey',backgroundColor: 'transparent' },
  headerTitle: { fontSize: 20, alignSelf: 'center', flex: 1, textAlign: 'center', marginRight: 55 },
  container: { flex: 1, paddingTop: 25,backgroundColor: 'transparent' },
  animatedItem: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 5,
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 20,
    marginLeft: 20,
    borderBottomWidth: 1,
  },
});


export default ItemList;
