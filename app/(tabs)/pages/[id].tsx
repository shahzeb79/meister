import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from '@/components/ThemedView';
import { IconButton } from 'react-native-paper';
import Icon from "react-native-vector-icons/FontAwesome5";
import Categories from '../model/Category';
import Questions from '../model/Questions';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolateColor } from "react-native-reanimated";
import database from '../db';
import GlobalBackground  from '@/components/GlobalBackground';

import { useRouter, useLocalSearchParams  } from 'expo-router';

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

const SubCategory = () => {
  const categoriesCollection = database.get<Categories>('category');
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const [subCategories, setSubcategories] = useState(itemsx);  // Holds real data
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
      const fetchSubcategories = async () => {
        const category = await categoriesCollection.find(id.toString()); // Find category by id
        const subcategories = await category.subcategory.fetch();
        const categoriesWithSubcategories = await Promise.all(
          subcategories.map(async (subcategory: any) => {
            const questions = await subcategory.questions.fetch(); // Fetch related subcategories
            return{
              id: subcategory.id,
              name: subcategory.name,
              questions: questions.map((que: any) => ({
                id: que.id,
                question: que.question,
                controltype: que.controltype,
                key: que.key
              })),
            }
          })
        );
        setSubcategories(categoriesWithSubcategories)
        setLoading(false);

      };
      if (id) fetchSubcategories();
      colorAnimation.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
    }, [id]);

  return (
    <GlobalBackground>
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>{name}</Text>
      </ThemedView>
      <FlashList
        data={subCategories}
        estimatedItemSize={12}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => loading ? (
          <AnimatedTouchableOpacity style={[styles.touchable]}>

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
            onPress={() => {
              router.push({
                pathname: "/(tabs)/pages/post",
                params: { subcategory: item.name, id: item.id },
              });
            }}
          >
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
    borderBottomColor: "#ddd",
  },
});


export default SubCategory;
