import React from 'react';
import { Tabs, useLocalSearchParams } from 'expo-router'



export default function _Layout() {
  const { userId } = useLocalSearchParams();


  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}>
      <Tabs.Screen
        name="[userId]"
        options={{
          title: 'Home',
          headerShown: false
        }}
      />
            <Tabs.Screen
        name="products"
        options={{
          title: 'products',
          headerShown: false
        }}
        initialParams={{ userId }}
      />  
    </Tabs>
  );
}
