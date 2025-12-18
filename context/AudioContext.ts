import { createContext, useContext } from 'react';

interface AudioContextType {
  playSound: () => Promise<void>;
}

export const AudioContext = createContext<AudioContextType>({
  playSound: async () => {}, // default no-op
});

export const useAudio = () => useContext(AudioContext);