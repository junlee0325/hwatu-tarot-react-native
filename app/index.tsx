import Container from '@/components/container';
import FourStack from '@/components/fourStack';
import Header from '@/components/header';
import InfoPop from '@/components/infoPop';
import PlayArea from '@/components/playArea';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cardImgs } from '../assets/images';

interface Card {
  month: string;  // e.g., "Jan", "Feb", etc.
  rank: string;
  id: string;     // optional, unique identifier
  img: string
}

const months = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
];

const ranks = ['A', 'B', 'C', 'D'];

const deck: Card[] = months.flatMap(month =>
  ranks.map(rank => ({
    month,
    rank,
    id: `${month}${rank}`, // unique id
    img: `${month}${rank}`
  }))
);

export default function HomeScreen() {

  const [visible, setVisible] = useState(false);

  const [imageSet, setImageSet] = useState(cardImgs)

  const [first, setFirst] = useState<Card | null>(null)
  const [second, setSecond] = useState<Card | null>(null)
  
  const [remaining, setRemaining] = useState<Card[]>([])

  useEffect(() => {
    if(deck.length === 32) {
      
      setRemaining(deck)
    }
  }, [deck])

  return (
    <SafeAreaView style={styles.whole}>
      <Header />
      <View style={styles.fourContainer}>
        <Container />
        <Container />
        <Container />
        <Container />
      </View>
      <View style={styles.fourStack}>
        <FourStack fourCards={deck.splice(0, 4)} imageSet={imageSet} first={first} setFirst={setFirst} second={second} setSecond={setSecond}/>
        <FourStack fourCards={deck.splice(0, 4)} imageSet={imageSet} first={first} setFirst={setFirst} second={second} setSecond={setSecond}/>
        <FourStack fourCards={deck.splice(0, 4)} imageSet={imageSet} first={first} setFirst={setFirst} second={second} setSecond={setSecond}/>
        <FourStack fourCards={deck.splice(0, 4)} imageSet={imageSet} first={first} setFirst={setFirst} second={second} setSecond={setSecond}/>
      </View>
      <PlayArea remaining={remaining} setRemaining={setRemaining} setVisible={setVisible} imageSet={imageSet} first={first} setFirst={setFirst} second={second} setSecond={setSecond}/>
      <View>
        <InfoPop visible={visible} setVisible={setVisible} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  whole: {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'center',
    gap: 5
  },
  fourContainer: {
    width: '100%', 
    display: 'flex', 
    flexDirection: 'row', 
    flexWrap: 'nowrap', 
    justifyContent: 'space-evenly'
  },
  fourStack: {
    width: '100%', 
    display: 'flex', 
    flexDirection: 'row', 
    flexWrap: 'nowrap', 
    justifyContent: 'space-evenly',
    height: 120
  },
  
});
