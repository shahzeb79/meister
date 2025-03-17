import React, { useCallback, useMemo, useRef } from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { View,Text } from 'react-native';

const Stack = createStackNavigator();
const HandleComponent = () => (
    <View style={{ padding: 15, flexDirection: 'row', alignItems: 'center',borderBottomWidth:0.5,borderBottomColor: 'grey'}}>
     <Text style={{ fontSize: 20, alignSelf: 'center',flex: 1, textAlign:'center', marginRight: 45  }}>Filters</Text>
  </View>
  );



const Navigator = () => {
  const screenOptions = useMemo<StackNavigationOptions>(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,
      headerMode: 'screen',
      headerShown: true,
      safeAreaInsets: { top: 0 },
      cardStyle: {
        backgroundColor: 'white',
        overflow: 'visible',
      },
    }),
    []
  );

  const screenAOptions = useMemo(() => ({ headerLeft: () => null }), []);
  return (
    <NavigationIndependentTree>
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="FlatList Screen"
          options={screenAOptions}
          component={HandleComponent}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </NavigationIndependentTree>
  );
};
export default Navigator;