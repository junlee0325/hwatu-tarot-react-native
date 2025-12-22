import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const InfoBlock = () => {
  return (
    <View style={{width: '50%', display:'flex', flexDirection:'column'}}>
      <Image source={require('../assets/images/apr.webp')} style={{width:'100%', resizeMode:'cover'}}/>
      <View style={{display:'flex', flexDirection:'row', alignItems: 'center'}}>
        <View>
            <Text>Jan | 1월</Text>
            <Text>Pine | 솔</Text>
        </View>
        <View></View>
      </View>
    </View>
  )
}

export default InfoBlock

const styles = StyleSheet.create({})