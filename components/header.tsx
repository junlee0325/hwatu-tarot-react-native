import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Header = () => {
    const date = new Date().toLocaleDateString()
    const dayNum = new Date().getDay()
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <View style={styles.header}>
      <View style={styles.titleView}>
        <Text style={{fontSize: 22}}>화투점</Text>
        <Text style={{fontSize: 18}}>Hwatu Tarot</Text>
      </View>
      <View style={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'flex-end'}}>
        <Text style={{fontSize: 20}}>
            {days[dayNum]}
        </Text>
        <Text style={{fontSize: 20}}>
            {date}
        </Text>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    header: {
        width:'100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 5
    },
    titleView: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap'
    },
    buttons: {
        aspectRatio: '1/1',
        borderRadius: '50%', 
        borderWidth: 2, 
        padding: 1, 
        width: 40, 
        display:'flex',
        flexDirection:'row',
        justifyContent:'center', 
        alignItems: 'center'
    }
})