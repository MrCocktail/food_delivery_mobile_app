import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import { MenuItem } from '@/type'
import { appwriteConfig } from '@/lib/appwrite'

const MenuCard = ({ item: { name, price, image_url }} : { item: MenuItem }) => {
    const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`
    console.log('url: ', image_url);
    // console.log('Url: ', imageUrl);
    
  return (
    <TouchableOpacity className='menu-card' style={Platform.OS === 'android' ? {elevation: 10, shadowColor: '#878787'} : {}}>
        <Image source={{uri: image_url}} className='size-32 absolute -top-10' resizeMode='contain' />
        <Text className='text-center base-bold text-dark-100 mb-2' numberOfLines={1}>{name}</Text>
        <Text className='body-regular text-gray-200 mb-4'>From ${price}</Text>
        <TouchableOpacity onPress={() => {}}> 
            <Text className='paragraph-bold text-primary'>Add to cart +</Text>
        </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default MenuCard