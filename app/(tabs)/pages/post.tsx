import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Dimensions } from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { IconButton } from 'react-native-paper';
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from '@/components/ThemedView';
import database from '../db';
import SubCategory from '../model/Subcategory';

const { width, height } = Dimensions.get("window"); // Get screen width and height

const PostCreation = () => {
  const router = useRouter();
  const { id, subcategory } = useGlobalSearchParams();
  
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const subCategoriesCollection = database.get<SubCategory>('subcategory');

  const handleInputChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions?.length - 1) {
      flatListRef?.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const subCategory = await subCategoriesCollection.find(id.toString()); // Find category by id
      const que = await subCategory.questions.fetch();
      setQuestions(que);
    };
    if (id) fetchQuestions();
  }, [id]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <IconButton iconColor='#463458' icon="arrow-left" size={26} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>{subcategory}</Text>
      </ThemedView>
      <FlashList
        data={questions}
        horizontal
        estimatedItemSize={5} // Required for FlashList performance optimization
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <Text >asdsafsdfsdgf</Text>

        )}
      />
    </ThemedView>
  );
};

export default PostCreation;

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    paddingTop: 10, 
    marginLeft: 0, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'grey' 
  },
  headerTitle: { 
    fontSize: 20, 
    alignSelf: 'center', 
    flex: 1, 
    textAlign: 'center', 
    marginRight: 55 
  },
  container: { 
    flex: 1, 
    paddingTop: 25 
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
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20
  }
});
