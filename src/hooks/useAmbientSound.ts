import { useEffect, useRef, useState } from 'react';

type MoodType = 'calming' | 'focus' | 'uplifting' | null;

interface AudioNodes {
  context: AudioContext | null;
  oscillators: OscillatorNode[];
  gainNodes: GainNode[];
  filters: BiquadFilterNode[];
  masterGain: GainNode | null;
}

export function useAmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodType>(null);
  const [volume, setVolume] = useState(0.3);
  const audioNodesRef = useRef<AudioNodes>({
    context: null,
    oscillators: [],
    gainNodes: [],
    filters: [],
    masterGain: null,
  });

  const stopSound = () => {
    const nodes = audioNodesRef.current;
    
    if (nodes.oscillators.length > 0) {
      nodes.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {
          // Oscillator may already be stopped
        }
      });
      nodes.oscillators = [];
    }

    nodes.gainNodes.forEach(gain => gain.disconnect());
    nodes.filters.forEach(filter => filter.disconnect());
    nodes.gainNodes = [];
    nodes.filters = [];
  };

  const createCalmingSound = (context: AudioContext, masterGain: GainNode) => {
    // Warm pad with gentle waves
    const frequencies = [220, 277, 330, 440]; // A3, C#4, E4, A4 - peaceful harmony
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];
    const filters: BiquadFilterNode[] = [];

    frequencies.forEach((freq, index) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, context.currentTime);
      
      // Add subtle vibrato
      const lfo = context.createOscillator();
      const lfoGain = context.createGain();
      lfo.frequency.setValueAtTime(0.1 + (index * 0.05), context.currentTime);
      lfoGain.gain.setValueAtTime(1, context.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, context.currentTime);
      filter.Q.setValueAtTime(1, context.currentTime);

      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.15 / frequencies.length, context.currentTime + 3 + (index * 0.5));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();

      oscillators.push(osc);
      gainNodes.push(gain);
      filters.push(filter);
    });

    return { oscillators, gainNodes, filters };
  };

  const createFocusSound = (context: AudioContext, masterGain: GainNode) => {
    // Clean, minimal tones with subtle rhythm
    const frequencies = [261.63, 329.63, 392]; // C4, E4, G4 - major triad for clarity
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];
    const filters: BiquadFilterNode[] = [];

    frequencies.forEach((freq, index) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, context.currentTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, context.currentTime);
      filter.Q.setValueAtTime(0.5, context.currentTime);

      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.12 / frequencies.length, context.currentTime + 2 + (index * 0.3));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();

      oscillators.push(osc);
      gainNodes.push(gain);
      filters.push(filter);
    });

    // Add white noise for texture
    const bufferSize = 2 * context.sampleRate;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = context.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = context.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(2000, context.currentTime);

    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0.02, context.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    whiteNoise.start();

    oscillators.push(whiteNoise as any);
    gainNodes.push(noiseGain);
    filters.push(noiseFilter);

    return { oscillators, gainNodes, filters };
  };

  const createUpliftingSound = (context: AudioContext, masterGain: GainNode) => {
    // Bright, energetic tones
    const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 - bright major
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];
    const filters: BiquadFilterNode[] = [];

    frequencies.forEach((freq, index) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, context.currentTime);

      // Add shimmer with LFO
      const lfo = context.createOscillator();
      const lfoGain = context.createGain();
      lfo.frequency.setValueAtTime(0.3 + (index * 0.1), context.currentTime);
      lfoGain.gain.setValueAtTime(3, context.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, context.currentTime);
      filter.Q.setValueAtTime(2, context.currentTime);

      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.08 / frequencies.length, context.currentTime + 2.5 + (index * 0.4));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();

      oscillators.push(osc);
      gainNodes.push(gain);
      filters.push(filter);
    });

    return { oscillators, gainNodes, filters };
  };

  const playMood = (mood: MoodType) => {
    if (!mood) return;

    stopSound();

    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(volume, context.currentTime);
    masterGain.connect(context.destination);

    audioNodesRef.current.context = context;
    audioNodesRef.current.masterGain = masterGain;

    let nodes;
    switch (mood) {
      case 'calming':
        nodes = createCalmingSound(context, masterGain);
        break;
      case 'focus':
        nodes = createFocusSound(context, masterGain);
        break;
      case 'uplifting':
        nodes = createUpliftingSound(context, masterGain);
        break;
    }

    if (nodes) {
      audioNodesRef.current.oscillators = nodes.oscillators;
      audioNodesRef.current.gainNodes = nodes.gainNodes;
      audioNodesRef.current.filters = nodes.filters;
    }

    setIsPlaying(true);
    setCurrentMood(mood);
  };

  const pause = () => {
    if (audioNodesRef.current.context) {
      audioNodesRef.current.context.suspend();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioNodesRef.current.context) {
      audioNodesRef.current.context.resume();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentMood) {
      resume();
    }
  };

  const changeMood = (mood: MoodType) => {
    if (mood === currentMood && isPlaying) {
      pause();
      return;
    }
    playMood(mood);
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioNodesRef.current.masterGain) {
      audioNodesRef.current.masterGain.gain.setValueAtTime(
        newVolume,
        audioNodesRef.current.context!.currentTime
      );
    }
  };

  useEffect(() => {
    return () => {
      stopSound();
      if (audioNodesRef.current.context) {
        audioNodesRef.current.context.close();
      }
    };
  }, []);

  return {
    isPlaying,
    currentMood,
    volume,
    playMood: changeMood,
    togglePlayPause,
    changeVolume,
  };
}
