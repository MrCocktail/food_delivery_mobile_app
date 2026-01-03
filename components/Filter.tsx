import { Category } from '@/type'
import cn from 'clsx'
import { router, useLocalSearchParams } from 'expo-router'
import { routingQueue } from 'expo-router/build/global-state/routing'
import React from 'react'
import { FlatList, Platform, Text, TouchableOpacity } from 'react-native'

const Filter = ({ categories }: {categories: Category[]}) => {
    const searchParams = useLocalSearchParams()
    const [isActive, setIsActive] = React.useState(searchParams.category as string || 'all')

    const handlePress = (id: string) => {
        setIsActive(id)
        if (id === 'all') { router.setParams({ category: undefined })
    } else router.setParams({ category: id })
    }

    const filterData: (Category | { $id: string; name: string })[] = categories 
    ? [{ $id: 'all', name: 'All' }, ...categories]
    : [{ $id: 'all', name: 'All' }]

  return (
    <FlatList
        data={filterData}
        keyExtractor={(item) => item.$id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName='gap-x-2 pb-3'
        renderItem={({ item }) => (
            <TouchableOpacity
                key={item.$id}
                className={cn('filter', isActive === item.$id ? 'bg-amber-500' : 'bg-white')}
                style={Platform.OS === 'android' ? { elevation: 5, shadowColor: "#878787"} : {}}
                onPress={() => handlePress(item.$id)}
            >
                <Text className={cn('body-medium', isActive === item.$id ? 'text-white' : 'text-gray-200')}>{item.name}</Text>
            </TouchableOpacity>
        )}
    >

    </FlatList>
  )
}

export default Filter