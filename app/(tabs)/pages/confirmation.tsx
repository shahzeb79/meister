import React, { useState, useRef, useEffect } from "react";
import { TouchableOpacity , StyleSheet, Dimensions } from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { IconButton,Text,RadioButton  } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import GlobalBackground  from '@/components/GlobalBackground';
import {storage} from '../auth/login'
import database from '../db';
import Posting from '../model/Posting';

const { width, height } = Dimensions.get("window"); // Get screen width and height



const Confirmation = () => {
  const router = useRouter();
  const { answers } = useGlobalSearchParams();
  const postsCollection = database.get<Posting>('posting')
  let posting = JSON.parse(answers);

  // posting = JSON.parse(posting);


  return (
    <GlobalBackground>
        <ThemedView style={styles.container}>
        
          <TouchableOpacity style={styles.button} onPress={async()=> {
           try{
            await database.write(async () => {
              await postsCollection.create(post => {
                post.userid = storage.getString('user.id')
                post.questions = posting
              })
            })
           } catch(e){
            console.log(e)
           }
           router.push({
                pathname: "/(tabs)/pages/ad",
                params: { answers: JSON.stringify(answers), user: storage.getString('user.id') },
              });
          }
          }>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>

      </ThemedView>
     </GlobalBackground>
  );
};

export default Confirmation;

const styles = StyleSheet.create({
  
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
 
  container: { 
    flex: 1, 
    paddingTop: 25,
    backgroundColor: 'transparent',
  }
});
