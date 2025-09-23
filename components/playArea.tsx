import { Link } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Card {
    month: string;
    rank: string;
    id: string;
    img: string
}

interface Prop {
    remaining: Card[];
    setRemaining: (value: Card[]) => void;
    setVisible: (value: boolean) => void;
    imageSet: Record<string, any>;
    first: Card | null;
    setFirst: (value: Card | null) => void;
    second: Card | null;
    setSecond: (value: Card | null) => void;
    faceUps: Card[];
    setFaceUps: (value: Card[]) => void;
}

const PlayArea = ({ remaining, setRemaining, setVisible, imageSet, first, setFirst, second, setSecond, faceUps,  setFaceUps }: Prop) => {

    const handlePress = (card: Card) => {
        if (first === null) {
            setFirst(card)
            console.log('heh')
        }

        if (first !== null && card !== first && second === null) {
            setSecond(card)
            console.log('hi')
        }

        if (first !== null && card === first) {
            setFirst(null)
            setSecond(null)
            console.log('no')
        }
    }

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

    const disableCheck = (card: Card) => {
        const firstCard = faceUps[0];
        const lastCard = faceUps[faceUps.length - 1];
        const secondLastCard = faceUps.length >= 2 ? faceUps[faceUps.length - 2] : null;

        if (card === firstCard) {
            return false
        }

        if (card === lastCard) {
            return false
        }

        if (first !== null && first.month === card.month && card === secondLastCard && card.month === lastCard.month && first !== firstCard) {
            return false
        }

        return true
    }

    return (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <View style={{ width: '20%', display: 'flex', alignItems: 'center', flexDirection: 'column-reverse', justifyContent: 'space-between' }}>
                <View style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center' }}>
                    <Text>{remaining.length}</Text>
                    <TouchableOpacity
                        style={styles.imageBox}
                        onPress={() => handleDraw()}>
                        <Image source={remaining.length > 0 ? require('../assets/cardImgs/back.webp') : require('../assets/cardImgs/circle.webp')} style={styles.image} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', gap: 10 }}>
                    <Link
                        style={styles.buttons}
                        href="/modal"
                    >
                        <Link.Trigger>
                            <Text style={{ textAlign: 'center' }}>Info</Text>
                        </Link.Trigger>
                    </Link>
                    <TouchableOpacity
                        style={styles.buttons}
                        onPress={() => { setVisible(true) }}
                    >
                        <Text style={{ textAlign: 'center' }}>Reset</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={{ height: 220 }} contentContainerStyle={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 1 }}>
                {faceUps.map((x, i) => (
                    <Pressable
                        key={i}
                        style={{ ...styles.imageBox, opacity: disableCheck(x) ? 0.5 : 1, borderColor: first === x ? "green" : "black" }}
                        onPress={() => handlePress(x)}
                        disabled={disableCheck(x)}
                    >
                        <Image source={imageSet[x.img]} style={styles.image} resizeMode='contain' />
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    )
}

export default PlayArea

const styles = StyleSheet.create({
    imageBox: {
        width: 48,
        aspectRatio: '230/360',
        borderWidth: 2,
        borderRadius: 2
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 2
    },
    buttons: {
        aspectRatio: '1/1',
        borderRadius: '50%',
        borderWidth: 2,
        padding: 1,
        width: 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})