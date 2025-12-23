import BoxCheckOverlay from "@/components/boxCheckOverlay";
import Container from "@/components/container";
import Controls from "@/components/controls";
import FourStack from "@/components/fourStack";
import Header from "@/components/header";
import InfoPop from "@/components/infoPop";
import OptionsOverlay from "@/components/optionsOverlay";
import PlayArea from "@/components/playArea";
import ResultsOverlay from "@/components/resultsOverlay";
import { Asset } from "expo-asset";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Alert, ImageBackground, StyleSheet, View } from "react-native";
import { cardImgs } from "../assets/images";

interface Card {
  month: string; // e.g., "Jan", "Feb", etc.
  rank: string;
  id: string; // optional, unique identifier
  img: string;
  rotation: number;
  title1: string;
  title2: string;
  meaning: string;
}

const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const ranks = ["A", "B", "C", "D"];

const titles1: Record<string, string> = {
  jan: "Pine",
  feb: "Plum",
  mar: "Cherry Blossom",
  apr: "Wisteria",
  may: "Water Iris",
  jun: "Peony",
  jul: "Bush Clover",
  aug: "Hill",
  sep: "Mums",
  oct: "Maple Leaves",
  nov: "Empress Tree",
  dec: "Rain",
};

const titles2: Record<string, string> = {
  jan: "솔",
  feb: "매조",
  mar: "벚꽃",
  apr: "흑싸리",
  may: "난초",
  jun: "모란",
  jul: "홍싸리",
  aug: "공산",
  sep: "국화",
  oct: "단풍",
  nov: "오동",
  dec: "비",
};

const meanings: Record<string, string> = {
  jan: "Receive news or tidings",
  feb: "Meet your beloved",
  mar: "Set out on a brief journey",
  apr: "Experience a minor conflict",
  may: "Dine out or meet with someone",
  jun: "Welcome a happy occasion",
  jul: "Stumble upon an unexpected windfall",
  aug: "Acquire money",
  sep: "Encounter an occasion for a drink",
  oct: "Face worries or concerns",
  nov: "Spend money or come across an expense",
  dec: "Have a visitor",
};

const getRandomInt = () => {
  const randomNumber = Math.random() * 3;
  const sign = Math.random() < 0.5 ? -1 : 1; // Randomly choose -1 or 1
  return randomNumber * sign;
};

const deck: Card[] = months.flatMap((month) =>
  ranks.map((rank) => ({
    month,
    rank,
    id: `${month}${rank}`, // unique id
    img: `${month}${rank}`,
    rotation: getRandomInt(),
    title1: titles1[month],
    title2: titles2[month],
    meaning: meanings[month],
  }))
);

export default function HomeScreen() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Sounds
  //////////////////////
  // Create a pool of 3 smack players
  const smackPlayers = [
    useAudioPlayer(require("../assets/smack.mp3")),
    useAudioPlayer(require("../assets/smack.mp3")),
    useAudioPlayer(require("../assets/smack.mp3")),
    useAudioPlayer(require("../assets/smack.mp3")),
    useAudioPlayer(require("../assets/smack.mp3")),
  ];

  let smackIndex = 0;

  // Set volume once after creation
  useEffect(() => {
    const volume = 0.6; // desired volume
    smackPlayers.forEach((player) => {
      player.volume = volume;
    });
  }, []);

  // Function to play smack sound (spam-safe)
  const playSmack = () => {
    const player = smackPlayers[smackIndex];
    player.seekTo(0);
    player.play();

    smackIndex = (smackIndex + 1) % smackPlayers.length;
  };
  
  //////////////////////////

  // Preload all card images
  useEffect(() => {
    const preloadImages = async () => {
      const images = Object.values(cardImgs);
      const cacheImages = images.map((img) =>
        Asset.fromModule(img).downloadAsync()
      );
      await Promise.all(cacheImages);
      setImagesLoaded(true);
    };
    preloadImages();
  }, []);

  const [shuffled, setShuffled] = useState<Card[]>([]);

  const [placed, setPlaced] = useState(false);

  const [visible, setVisible] = useState(true);

  const [showLabels, setShowLabels] = useState(false);
  const [mute, setMute] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const [first, setFirst] = useState<Card | null>(null);
  const [second, setSecond] = useState<Card | null>(null);

  const [firstFour, setFirstFour] = useState<Card[]>([]);
  const [secondFour, setSecondFour] = useState<Card[]>([]);
  const [thirdFour, setThirdFour] = useState<Card[]>([]);
  const [fourthFour, setFourthFour] = useState<Card[]>([]);

  const [remaining, setRemaining] = useState<Card[]>([]);
  const [faceUps, setFaceUps] = useState<Card[]>([]);

  // Fisher-Yates shuffle
  const shuffle = (array: Card[]) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    setShuffled(shuffle(deck));
  }, []);

  useEffect(() => {
    if (!placed && shuffled.length > 0) {
      setFirstFour(shuffled.slice(0, 4));
      setSecondFour(shuffled.slice(4, 8));
      setThirdFour(shuffled.slice(8, 12));
      setFourthFour(shuffled.slice(12, 16));
      setRemaining(shuffled.slice(16));

      setPlaced(true);
    }
  }, [shuffled, placed]);

  // Draw
  const handleDraw = () => {
    if (remaining.length === 0) {
      checkImpossible();
      setRemaining([...faceUps].reverse());
      setFaceUps([]);
    } else {
      const copyRemaining = [...remaining];
      const drawn = copyRemaining.pop();

      if (drawn) {
        setFaceUps([...faceUps, drawn]);
        setRemaining(copyRemaining);
      }
    }
  };

  // Target Box and Match
  const [boxOne, setBoxOne] = useState<Card[]>([]);
  const [boxTwo, setBoxTwo] = useState<Card[]>([]);
  const [boxThree, setBoxThree] = useState<Card[]>([]);
  const [boxFour, setBoxFour] = useState<Card[]>([]);
  const [boxTarget, setBoxTarget] = useState<number>(0);

  const boxSetters = [setBoxOne, setBoxTwo, setBoxThree, setBoxFour];

  useEffect(() => {
    const newMatched: Card[] = [];

    const arrays = [
      { arr: firstFour, setArr: setFirstFour },
      { arr: secondFour, setArr: setSecondFour },
      { arr: thirdFour, setArr: setThirdFour },
      { arr: fourthFour, setArr: setFourthFour },
      { arr: faceUps, setArr: setFaceUps },
    ];

    if (first && second) {
      if (first !== second && first.month === second.month) {
        arrays.forEach((x) => {
          const kept: Card[] = [];
          x.arr.forEach((x) => {
            if (x === first || x === second) {
              newMatched.push(x);
            } else {
              kept.push(x);
            }
          });
          x.setArr(kept);
        });

        setFirst(null);
        setSecond(null);

        boxSetters[boxTarget]((prev) => [...prev, ...newMatched]);

        setBoxTarget((prev) => (prev + 1) % 4);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        if (!mute) {
          playSmack();
        }

        console.log("matched:", newMatched);
      } else {
        setFirst(null);
        setSecond(null);
        console.log("no match");
      }
    }
  }, [second]);

  // Reset
  const handleReset = () => {
    setPlaced(false);
    setFirstFour([]);
    setSecondFour([]);
    setThirdFour([]);
    setFourthFour([]);
    setRemaining([]);
    setFaceUps([]);
    setBoxOne([]);
    setBoxTwo([]);
    setBoxThree([]);
    setBoxFour([]);
    setBoxTarget(0);
    setFirst(null);
    setSecond(null);

    setShuffled(shuffle(deck));
  };

  // Box check
  const [openCheckBox, setOpenCheckBox] = useState(false);
  const [selectedBox, setSelectedBox] = useState<Card[]>([]);

  // Results
  const [openResults, setOpenResults] = useState(false);

  useEffect(() => {
    if (boxFour.length === 12) {
      setOpenResults(true);
    }
  }, [boxFour]);

  // Impossible Deck
  // 3 Steps:
  // Check match
  const checkImpossible = () => {
    const lastFourCombined: (Card | undefined)[] = [
      firstFour.at(-1),
      secondFour.at(-1),
      thirdFour.at(-1),
      fourthFour.at(-1),
    ];

    const validFourCards: Card[] = lastFourCombined.filter(
      (x): x is Card => x !== undefined
    );

    const validFourMonths = validFourCards.map((x) => x.month);

    const validFourMonthsUnique =
      new Set(validFourMonths).size === validFourMonths.length;

    const faceUpsMonths = faceUps.map((x) => x.month);

    if (validFourMonths.length !== 0 && validFourMonthsUnique) {
      const hasMatch = validFourMonths.some((x) =>
        faceUpsMonths.some((y) => x === y)
      );

      if (hasMatch) {
        return;
      } else {
        Alert.alert("Impossible Deck. Try Again", "", [
          {
            text: "Ok",
          },
        ]);
      }
    }
  };
  return (
    <ImageBackground
      source={require("../assets/background/fabric2.webp")}
      style={styles.whole}
      resizeMode="cover"
    >
      <Header />
      <View style={styles.fourContainer}>
        <Container
          pairs={boxOne}
          imageSet={cardImgs}
          boxTarget={boxTarget}
          index={0}
          setOpenCheckBox={setOpenCheckBox}
          setSelectedBox={setSelectedBox}
        />
        <Container
          pairs={boxTwo}
          imageSet={cardImgs}
          boxTarget={boxTarget}
          index={1}
          setOpenCheckBox={setOpenCheckBox}
          setSelectedBox={setSelectedBox}
        />
        <Container
          pairs={boxThree}
          imageSet={cardImgs}
          boxTarget={boxTarget}
          index={2}
          setOpenCheckBox={setOpenCheckBox}
          setSelectedBox={setSelectedBox}
        />
        <Container
          pairs={boxFour}
          imageSet={cardImgs}
          boxTarget={boxTarget}
          index={3}
          setOpenCheckBox={setOpenCheckBox}
          setSelectedBox={setSelectedBox}
        />
      </View>
      <View style={styles.fourStack}>
        <FourStack
          fourCards={firstFour}
          updateFourCards={setFirstFour}
          imageSet={cardImgs}
          first={first}
          setFirst={setFirst}
          second={second}
          setSecond={setSecond}
          showLabels={showLabels}
          mute={mute}
        />
        <FourStack
          fourCards={secondFour}
          updateFourCards={setSecondFour}
          imageSet={cardImgs}
          first={first}
          setFirst={setFirst}
          second={second}
          setSecond={setSecond}
          showLabels={showLabels}
          mute={mute}
        />
        <FourStack
          fourCards={thirdFour}
          updateFourCards={setThirdFour}
          imageSet={cardImgs}
          first={first}
          setFirst={setFirst}
          second={second}
          setSecond={setSecond}
          showLabels={showLabels}
          mute={mute}
        />
        <FourStack
          fourCards={fourthFour}
          updateFourCards={setFourthFour}
          imageSet={cardImgs}
          first={first}
          setFirst={setFirst}
          second={second}
          setSecond={setSecond}
          showLabels={showLabels}
          mute={mute}
        />
      </View>
      <PlayArea
        remaining={remaining}
        setRemaining={setRemaining}
        setVisible={setVisible}
        imageSet={cardImgs}
        first={first}
        setFirst={setFirst}
        second={second}
        setSecond={setSecond}
        faceUps={faceUps}
        setFaceUps={setFaceUps}
        showLabels={showLabels}
        mute={mute}
      />
      <Controls
        handleDraw={handleDraw}
        setVisible={setVisible}
        remaining={remaining}
        handleReset={handleReset}
        first={first}
        mute={mute}
        setOpenOptions={setOpenOptions}
        boxFour={boxFour}
        setOpenResults={setOpenResults}
        setFirst={setFirst}
      />
      <InfoPop visible={visible} setVisible={setVisible} />
      {openCheckBox && (
        <BoxCheckOverlay
          setOpenCheckBox={setOpenCheckBox}
          selectedBox={selectedBox}
          imageSet={cardImgs}
        />
      )}
      {openResults && (
        <ResultsOverlay
          setOpenResults={setOpenResults}
          boxOne={boxOne}
          boxTwo={boxTwo}
          boxThree={boxThree}
          boxFour={boxFour}
          imageSet={cardImgs}
        />
      )}
      {openOptions && (
        <OptionsOverlay
          setOpenOptions={setOpenOptions}
          mute={mute}
          setMute={setMute}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  whole: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    overflow: "hidden",
  },
  fourContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-evenly",
  },
  fourStack: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-evenly",
    height: 150,
    marginVertical: 2,
  },
});
