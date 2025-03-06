import React from 'react';
import { Tabs ,Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';


export default function _Layout() {
  const { categoryId } = useLocalSearchParams();


  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}>
      <Tabs.Screen
        name="[index]"
        options={{
          title: 'Home',
          headerShown: false
        }}
      />
            <Tabs.Screen
        name="corbeille"
        options={{
          title: 'Corbeille',
          headerShown: false
        }}
      />  
    </Tabs>
  );
}
