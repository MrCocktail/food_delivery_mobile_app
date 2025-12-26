import { View, Text, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import CustomInput from '@/components/CustomInput'
import CustomButton from '@/components/CustomButton'
import { signIn } from '@/lib/appwrite'
import * as Sentry from "@sentry/react-native";

const SignIn = () => { 
  const [isSubmitting, setIsSubmitting] = useState(false) 
  const [form, setForm] = useState({email: '', password: ''})

  const submit = async () => {
    const { email, password } = form
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    setIsSubmitting(true);

    try {
      // Call Appwrite sign-in method here
      await signIn({ email, password })

      // Alert.alert('Success', 'You have signed in successfully!');
      router.replace('/'); // Navigate to home on success
    } catch (error: any) {
      Alert.alert('Error', error.message);
      Sentry.captureEvent(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
      {/* <Text>SignIn</Text>
      <Button title="Sign In" onPress={() => router.push('/sign-up')} />  */}

        <CustomInput 
                placeholder='Enter your email'
                keyboardType='email-address'
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({...prev, email: text}))}
                label='Email'
            />
        <CustomInput 
                placeholder='Enter your password'
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({...prev, password: text}))}
                label='Password'
                secureTextEntry={true}
            />
            <CustomButton
              title='Sign In'
              onPress={submit}
              isLoading={isSubmitting}
            />

            <View className='flex justify-center gap-2 mt-5 flex-row'>
              <Text className='base-regular text-gray-100'>
                Don't have an account?{' '}
                <Link href={'/sign-up'} className='text-primary base-bold'>
                  Sign Up
                </Link> 
              </Text>
            </View>
            <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/>
    </View>
  )
}

export default SignIn