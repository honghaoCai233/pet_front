import { View, Image } from '@tarojs/components'
import './index.scss'

interface PetCardProps {
  name: string
  age: number
  breed: string
  image: string
  onClick?: () => void
}

const PetCard: React.FC<PetCardProps> = ({ name, age, breed, image, onClick }) => {
  return (
    <View className='pet-card' onClick={onClick}>
      <Image className='pet-image' src={image} mode='aspectFill' />
      <View className='pet-info'>
        <View className='pet-name'>{name}</View>
        <View className='pet-details'>
          <Text>{breed}</Text>
          <Text>{age}岁</Text>
        </View>
      </View>
    </View>
  )
}

export default PetCard 