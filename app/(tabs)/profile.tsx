import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import seed from '@/lib/seed'

const profile = () => {
  return (
    <SafeAreaView className='justify-center items-center h-full'>
      <Text>Support the project for more features. </Text>
      <Text>Mr. Cocktail</Text>
      {/* <Button title="Click Me" onPress={() => { seed() .catch(console.error)}} /> */}
    </SafeAreaView>
  )
}

export default profile