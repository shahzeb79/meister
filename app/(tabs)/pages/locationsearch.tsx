import React,{PropsWithChildren } from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet,TextInput,Dimensions } from "react-native";
import { ThemedView } from '@/components/ThemedView';

import {
  useGoogleAutocomplete
} from '@appandflow/react-native-google-autocomplete';
const { width, height } = Dimensions.get("window");

type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: ({}) => void;
  }>;

export default function LocationSearch({ isVisible, children, onClose }: Props){

  const { locationResults, setTerm, clearSearch, searchDetails, term } =
    useGoogleAutocomplete("AIzaSyDdWzs61kn9QdLhVoL1k9X4vJTVb2UVrIE", {
      language: 'en',
      debounce: 300,
    });
 
  return (
   
    <ThemedView >
    <Modal animationType="none" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
      <ThemedView style={styles.modalContent}>
        <TextInput
            style={styles.input}
            value={term}
            onChangeText={setTerm}
            placeholder="Type Location"
        />
        {locationResults.slice(0, 5).map((el, i) => (
            <TouchableOpacity
            style={styles.card}
            key={String(i)}
            onPress={async () => {
                const details = await searchDetails(el.place_id);
                clearSearch();
                onClose(details.geometry.location);
            }}
            >
            <Text style={styles.suggestions}>{el.structured_formatting.main_text}, {el.structured_formatting.secondary_text}</Text>
            </TouchableOpacity>
        ))}
        </ThemedView>
        </View>
        </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',    
    },
    modalContent: {
        margin: 20,
        borderRadius: 20,
        height: 300,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        shadowOffset: {
          width: 1,
          height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 1,
      },
  card: {
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
  },

  input: {
    height: 50,
    alignItems: 'flex-start',
    width: width-50,
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  suggestions: {
    width: width-50,
    paddingHorizontal: 8,
  },
});



