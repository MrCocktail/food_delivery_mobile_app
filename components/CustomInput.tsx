import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { CustomInputProps } from '@/type'
import cn from 'clsx'

const CustomInput = (
    {
        placeholder = 'Enter text',
        label,
        value,
        onChangeText,
        secureTextEntry = false,
        keyboardType = 'default',
    } : CustomInputProps
) => {
    const [isFocused, setIsFocused] = useState(false); 
  return (
    <View className='w-full'>
      <Text className='label'>{label}</Text>

      <TextInput 
        autoCapitalize='none' 
        autoCorrect={false}
        className={cn('input', isFocused ? 'border-primary' : 'border-gray-300')}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}

        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={'#888'}
        
      />
    </View>
  )
}

export default CustomInput