import { Link } from 'expo-router';
import React, { useState } from 'react';
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
    setFirst: (value: Card) => void;
    second: Card | null;
    setSecond: (value: Card) => void
}

const PlayArea = ({ remaining, setRemaining, setVisible, imageSet, first, setFirst, second, setSecond }: Prop) => {

    const handlePress = (card: Card) => {
        if (first === null) {
            setFirst(card)
        } else {
            setSecond(card)
        }
    }

    const [faceUps, setFaceUps] = useState<Card[]>([])
    const handleDraw = () => {
        if(remaining.length === 0){
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
    

    return (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <View style={{ width: '20%', display: 'flex', alignItems: 'center', flexDirection: 'column-reverse', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    style={styles.imageBox}
                    onPress={() => handleDraw()}>
                    <Image source={remaining.length > 0 ? require('../assets/cardImgs/back.webp') : require('../assets/cardImgs/circle.webp')} style={styles.image} />
                </TouchableOpacity>
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
                        style={styles.imageBox}
                        onPress={() => handlePress(x)}
                    >
                        <Image source={imageSet[x.img]} style={styles.image} />
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
        aspectRatio: '230/360'
    },
    image: {
        width: "100%",
        height: "100%",
        borderWidth: 1
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