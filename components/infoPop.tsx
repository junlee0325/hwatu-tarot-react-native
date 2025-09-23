import React from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import InfoBlock from './infoBlock';

interface Prop {
  visible: boolean;
  setVisible: (value: boolean) => void
}

const InfoPop = ({ visible, setVisible }: Prop) => {


  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text>Hwatu Tarot Guide</Text>
          <View>
            <Text>Hwatu card deck has 48 cards. There are 12 kinds with 4 cards each. Simply put, pair similar cards until the spread is empty. The 12 kinds and their meanings are shown below. If all 4 cards of a kind are in a pile, that kind is part of your fortune for the day.</Text>
          </View>
          <View>
            <Text>Select 2 cards of the same kind to move them to the piles.</Text>
            <Text>Unusable cards will be half visible.</Text>
            <Text>Press the glowing face-down card to pull out a card.</Text>
            <Text>Deck will be cycled until empty.</Text>
            <Text>When all 48 cards are in the piles, you can check your result.</Text>
            <Text>If the spread is impossible to empty, simply try again.</Text>
          </View>
          <View style={{width: '100%', display:'flex', flexDirection:'row'}}>
          <InfoBlock/>
          <InfoBlock/>
          </View>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </View>
    </Modal>
  )
}

export default InfoPop

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
  },
})