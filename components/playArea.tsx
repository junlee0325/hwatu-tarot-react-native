import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

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
        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingHorizontal: 5, gap: 5}}>
            <ScrollView 
                style={{height: 200,  borderWidth: 2, borderRadius: 5, padding: 4, borderColor: 'rgba(255, 255, 255, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.05)'}} 
                contentContainerStyle={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}
                showsVerticalScrollIndicator={false}>
                {faceUps.map((x, i) => (
                    <Pressable
                        key={i}
                        style={{ ...styles.imageBox, opacity: disableCheck(x) ? 0.5 : 1, borderColor: first === x ? 'rgba(255, 234, 2, 1)' : 'black' }}
                        onPress={() => handlePress(x)}
                        disabled={disableCheck(x)}
                    >
                        <Image source={imageSet[x.img]} style={styles.image} resizeMode='stretch' />
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
        borderRadius: 3
    },
    image: {
        width: "100%",
        height: "100%",
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