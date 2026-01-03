import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import { MenuItem } from '@/type'
import { appwriteConfig } from '@/lib/appwrite'
import { useCartStore } from '@/store/cart.store'

const MenuCard = ({ item: { name, price, image_url, $id }} : { item: MenuItem }) => {
    console.log(image_url);
    
    const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`
    const { addItem } = useCartStore()
    
  return (
    <TouchableOpacity className='menu-card' style={Platform.OS === 'android' ? {elevation: 10, shadowColor: '#878787'} : {}}>
        <Image source={{uri: image_url}} className='size-32 absolute -top-10' resizeMode='contain' />
        <Text className='text-center base-bold text-dark-100 mb-2' numberOfLines={1}>{name}</Text>
        <Text className='body-regular text-gray-200 mb-4'>À partir de {price} G</Text>
        <TouchableOpacity onPress={() => addItem({ id: $id, name, price, image_url, customizations: [] })} className='bg-amber- 500 rounded-full px-4 py-2 self-center'> 
            <Text className='paragraph-bold text-primary text-center'>Panier +</Text>
        </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default MenuCard