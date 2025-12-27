import Container from "@/components/container";
import Controls from "@/components/controls";
import FourStack from "@/components/fourStack";
import Header from "@/components/header";
import InfoPop from "@/components/infoOverlay";
import PlayArea from "@/components/playArea";
import ResultsOverlay from "@/components/resultsOverlay";
import { Asset } from "expo-asset";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { cardImgs } from "../assets/images";

const { width: vw } = Dimensions.get("window");

interface Card {
  month: string; // e.g., "Jan", "Feb", etc.
  rank: string;
  id: string; // optional, unique identifier
  img: string;
  rotation: number;
  title: { en: string; ko: string };
  meaning: { en: string; ko: string };
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

const titles: Record<string, { en: string; ko: string }> = {
  jan: { en: "Pine", ko: "솔" },
  feb: { en: "Plum", ko: "매조" },
  mar: { en: "Cherry Blossom", ko: "벚꽃" },
  apr: { en: "Wisteria", ko: "흑싸리" },
  may: { en: "Water Iris", ko: "난초" },
  jun: { en: "Peony", ko: "모란" },
  jul: { en: "Bush Clover", ko: "홍싸리" },
  aug: { en: "Hill", ko: "공산" },
  sep: { en: "Mums", ko: "국화" },
  oct: { en: "Maple Leaves", ko: "단풍" },
  nov: { en: "Empress Tree", ko: "오동" },
  dec: { en: "Rain", ko: "비" },
};

const meanings: Record<string, { en: string; ko: string }> = {
  jan: {
    en: "Longevity, Luck, Success, Good News",
    ko: "장수, 건강, 길한 운, 좋은 소식",
  },
  feb: {
    en: "Hope, Opportunity, Communication, Small Joy",
    ko: "희망, 기회, 소식, 작은 기쁨",
  },
  mar: {
    en: "Happiness, Friendship, Travel, Growth",
    ko: "즐거움, 친구, 여행, 성장",
  },
  apr: {
    en: "Love, Romance, Minor Luck, Happiness",
    ko: "사랑, 연애, 작은 기쁨, 길운",
  },
  may: {
    en: "News, Relationships, Progress, Cautious Optimism",
    ko: "소식, 인연, 발전, 신중 필요",
  },
  jun: {
    en: "Big Joy, Wealth, Important Changes, Happiness",
    ko: "큰 기쁨, 재물, 중요한 변화, 즐거움",
  },
  jul: {
    en: "Purity, Luck, Achievement, New Beginnings",
    ko: "순수함, 행운, 성취, 새로운 시작",
  },
  aug: {
    en: "Peace, Reflection, Stable Fortune, Relationships",
    ko: "평화, 안정된 운, 관계, 성찰",
  },
  sep: {
    en: "Harmony, Clarity, Communication, Joy",
    ko: "조화, 명확함, 소통, 즐거움",
  },
  oct: {
    en: "Change, Caution, Reflection, Opportunities",
    ko: "변화, 신중함, 성찰, 기회",
  },
  nov: {
    en: "Wisdom, Gratitude, Calm, Patience",
    ko: "지혜, 감사, 침착, 인내",
  },
  dec: {
    en: "Endings, Completion, Preparation, Hope",
    ko: "마무리, 완성, 준비, 희망",
  },
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
    title: titles[month],
    meaning: meanings[month],
  }))
);

export default function HomeScreen() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Sounds
  //////////////////////
  // Create pool ONCE (hooks order is stable)
  const players = [
    useAudioPlayer(require("../assets/smack.mp3")),
    useAudioPlayer(require("../assets/smack.mp3")),
    useAudioPlayer(require("../assets/smack.mp3")),
    useAudioPlayer(require("../assets/smack.mp3")),
    useAudioPlayer(require("../assets/smack.mp3")),
  ];

  // Init volume once
  useEffect(() => {
    players.forEach((p) => {
      p.volume = 0.6;
    });
  }, []);

  // Play function (drop-safe)
  const playSmack = () => {
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (!player.playing) {
        player.seekTo(0);
        player.play();
        return;
      }
    }
    // setTimeout(() => {
    //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // }, 2000); // Small delay before playing the sound after haptic
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

  const [openInfo, setOpenInfo] = useState(true);

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
    setFirst(null);

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
    if (!mute && boxOne.length !== 0) {
      playSmack();
    }

    setTimeout(() => {
      if (boxOne.length !== 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    }, 100);
  }, [boxOne, boxTwo, boxThree, boxFour]);

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
      <Header setOpenInfo={setOpenInfo} />
      <View style={styles.fourContainer}>
        <Container
          pairs={boxOne}
          imageSet={cardImgs}
          boxTarget={boxTarget}
          index={0}
          setOpenCheckBox={setOpenCheckBox}
          setSelectedBox={setSelectedBox}
          box={boxOne}
        />
        <Container
          pairs={boxTwo}
          imageSet={cardImgs}
          boxTarget={boxTarget}
          index={1}
          setOpenCheckBox={setOpenCheckBox}
          setSelectedBox={setSelectedBox}
          box={boxTwo}
        />
        <Container
          pairs={boxThree}
          imageSet={cardImgs}
          boxTarget={boxTarget}
          index={2}
          setOpenCheckBox={setOpenCheckBox}
          setSelectedBox={setSelectedBox}
          box={boxThree}
        />
        <Container
          pairs={boxFour}
          imageSet={cardImgs}
          boxTarget={boxTarget}
          index={3}
          setOpenCheckBox={setOpenCheckBox}
          setSelectedBox={setSelectedBox}
          box={boxFour}
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
        setMute={setMute}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        boxFour={boxFour}
        setOpenResults={setOpenResults}
        setOpenInfo={setOpenInfo}
      />
      {openInfo && (
        <InfoPop setOpenInfo={setOpenInfo} deck={deck} imageSet={cardImgs} />
      )}
      {/* {openCheckBox && (
        <BoxCheckOverlay
          setOpenCheckBox={setOpenCheckBox}
          selectedBox={selectedBox}
          imageSet={cardImgs}
        />
      )} */}
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
      {/* {openOptions && (
        <OptionsOverlay
          setOpenOptions={setOpenOptions}
          mute={mute}
          setMute={setMute}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
        />
      )} */}
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
    gap: 12,
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
    height: "20%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-evenly",
    marginVertical: 2,
  },
});
