import Container from '@/components/container';
import Controls from '@/components/controls';
import FourStack from '@/components/fourStack';
import Header from '@/components/header';
import InfoPop from '@/components/infoPop';
import PlayArea from '@/components/playArea';
import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
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
  const [shuffled, setShuffled] = useState<Card[]>([])
  const [mixed, setMixed] = useState(false)
  const [placed, setPlaced] = useState(false)

  const [visible, setVisible] = useState(false);

  const [imageSet, setImageSet] = useState(cardImgs)

  const [first, setFirst] = useState<Card | null>(null)
  const [second, setSecond] = useState<Card | null>(null)

  const [firstFour, setFirstFour] = useState<Card[]>([])
  const [secondFour, setSecondFour] = useState<Card[]>([])
  const [thirdFour, setThirdFour] = useState<Card[]>([])
  const [fourthFour, setFourthFour] = useState<Card[]>([])

  const [remaining, setRemaining] = useState<Card[]>([])



  useEffect(() => {
    // Fisher-Yates shuffle
    const shuffle = (array: Card[]) => {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    setShuffled(shuffle(deck))
    setMixed(true)
  }, [])

  useEffect(() => {
    if (!placed) {
      if (mixed) {
        setFirstFour(shuffled.slice(0, 4))
        setSecondFour(shuffled.slice(4, 8))
        setThirdFour(shuffled.slice(8, 12))
        setFourthFour(shuffled.slice(12, 16))
        setRemaining(shuffled.slice(16))

        setPlaced(true)
      }
    }
  }, [mixed])

  const [faceUps, setFaceUps] = useState<Card[]>([])

  const handleDraw = () => {
    if (remaining.length === 0) {
      setRemaining(faceUps)
      setFaceUps([])
    } else {
      const copyRemaining = [...remaining]
      const drawn = copyRemaining.shift()

      if (drawn) {
        setFaceUps([...faceUps, drawn])
        setRemaining(copyRemaining)
      }
    }
  }


  const [boxOne, setBoxOne] = useState<Card[]>([])
  const [boxTwo, setBoxTwo] = useState<Card[]>([])
  const [boxThree, setBoxThree] = useState<Card[]>([])
  const [boxFour, setBoxFour] = useState<Card[]>([])
  const [boxTarget, setBoxTarget] = useState<number>(0)

  useEffect(() => {
    const newMatched: Card[] = [];

    const arrays = [
      { arr: firstFour, setArr: setFirstFour },
      { arr: secondFour, setArr: setSecondFour },
      { arr: thirdFour, setArr: setThirdFour },
      { arr: fourthFour, setArr: setFourthFour },
      { arr: faceUps, setArr: setFaceUps }
    ];

    if (first && second) {
      if (first !== second && first.month === second.month) {

        arrays.forEach(x => {
          const kept: Card[] = [];
          x.arr.forEach(card => {
            if (card === first || card === second) {
              newMatched.push(card);
            } else {
              kept.push(card);
            }
          });
          x.setArr(kept);
        });

        setFirst(null)
        setSecond(null)

        if (boxTarget === 0) { setBoxOne(prev => [...prev, ...newMatched]) }
        if (boxTarget === 1) { setBoxTwo(prev => [...prev, ...newMatched]) }
        if (boxTarget === 2) { setBoxThree(prev => [...prev, ...newMatched]) }
        if (boxTarget === 3) { setBoxFour(prev => [...prev, ...newMatched]) }

        setBoxTarget(prev => (prev + 1) % 4)

        console.log('matched:', newMatched);
      }
      else {
        setFirst(null)
        setSecond(null)
        console.log("reset")
      }
    }
  }, [second])

  return (
    <ImageBackground source={require('../assets/background/fabric2.webp')} style={styles.whole} resizeMode='repeat'>
      <Header />
      <View style={styles.fourContainer}>
        <Container pairs={boxOne} imageSet={imageSet} boxTarget={boxTarget} index={0} />
        <Container pairs={boxTwo} imageSet={imageSet} boxTarget={boxTarget} index={1} />
        <Container pairs={boxThree} imageSet={imageSet} boxTarget={boxTarget} index={2} />
        <Container pairs={boxFour} imageSet={imageSet} boxTarget={boxTarget} index={3} />
      </View>
      <View style={styles.fourStack}>
        <FourStack
          fourCards={firstFour}
          updateFourCards={setFirstFour}
          imageSet={imageSet}
          first={first}
          setFirst={setFirst}
          second={second}
          setSecond={setSecond} />
        <FourStack
          fourCards={secondFour}
          updateFourCards={setSecondFour}
          imageSet={imageSet}
          first={first}
          setFirst={setFirst}
          second={second}
          setSecond={setSecond} />
        <FourStack
          fourCards={thirdFour}
          updateFourCards={setThirdFour}
          imageSet={imageSet}
          first={first}
          setFirst={setFirst}
          second={second}
          setSecond={setSecond} />
        <FourStack
          fourCards={fourthFour}
          updateFourCards={setFourthFour}
          imageSet={imageSet}
          first={first}
          setFirst={setFirst}
          second={second}
          setSecond={setSecond} />
      </View>
      <PlayArea
        remaining={remaining}
        setRemaining={setRemaining}
        setVisible={setVisible}
        imageSet={imageSet}
        first={first}
        setFirst={setFirst}
        second={second}
        setSecond={setSecond}
        faceUps={faceUps}
        setFaceUps={setFaceUps} />
      <Controls handleDraw={handleDraw} setVisible={setVisible} remaining={remaining}/>
      <InfoPop visible={visible} setVisible={setVisible} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  whole: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'green',
    overflow: 'hidden',
  },
  fourContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around'
  },
  fourStack: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    height: 120,
    marginBottom: 5,
  },

});
