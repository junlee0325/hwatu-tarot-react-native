import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Card {
  month: string;  // e.g., "Jan", "Feb", etc.
  rank: string;
  id: string;     // optional, unique identifier
  img: string
}

interface Prop {
    handleDraw: () => void;
    setVisible: (value: boolean) => void;
    remaining: Card[];
}

const Controls = ({ handleDraw, setVisible, remaining }: Prop) => {
    return (
        <View style={styles.bottomBar}>
            <Link
                href="/modal"
            >
                <Link.Trigger>
                    <Text style={{color: 'rgba(255, 255, 255, 0.75)', fontWeight: '600' }}>Info</Text>
                </Link.Trigger>
            </Link>
            <TouchableOpacity
                style={styles.drawButton}
                onPress={() => handleDraw()}>
                <Text style={{ textAlign: 'center', color: 'black', fontWeight: 'bold' }}>{remaining.length === 0 ? "CYCLE" : "DRAW"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { setVisible(true) }}
            >
                <Text style={{color: 'rgba(255, 255, 255, 0.75)', fontWeight: '600' }}>Reset</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Controls

const styles = StyleSheet.create({
    bottomBar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    drawButton: {
        height: 40,
        aspectRatio: 2/1,
        borderWidth: 2,
        borderColor: 'rgba(214, 2, 2, 1)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 5,
        backgroundColor: 'rgba(255, 234, 2, 1)',
    }
})