import { create } from "zustand";
import { Layer, LottieAnimationData, Shape } from "../types/lottie.type";

interface AnimationStore {
  selectedAnimationData: LottieAnimationData | null;
  isPlaying: boolean;
  isLooping: boolean;
  playbackRate: number;
  currentFrame: number;
  totalFrames: number;
  frameRate: number;
  selectedLayer: Layer | null;
  selectedShape: { shape: Shape; parentLayer: Layer } | null;
  setSelectedAnimationData: (data: LottieAnimationData) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLooping: (isLooping: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setCurrentFrame: (frame: number) => void;
  setFrameRate: (rate: number) => void;
  setTotalFrames: (frames: number) => void;
  setSelectedLayer: (layer: Layer | null) => void;
  setSelectedShape: (shape: Shape, parentLayer: Layer) => void;
}

export const useAnimationStore = create<AnimationStore>((set) => ({
  selectedAnimationData: null,
  isPlaying: true,
  isLooping: true,
  playbackRate: 1,
  currentFrame: 0,
  totalFrames: 0,
  frameRate: 0,
  selectedLayer: null,
  selectedShape: null,
  setSelectedAnimationData: (data) => set({ selectedAnimationData: data }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsLooping: (isLooping) => set({ isLooping }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setCurrentFrame: (frame) => set({ currentFrame: frame }),
  setFrameRate: (rate) => set({ frameRate: rate }),
  setTotalFrames: (frames) => set({ totalFrames: frames }),
  setSelectedLayer: (layer) =>
    set({ selectedLayer: layer, selectedShape: null }),
  setSelectedShape: (shape, parentLayer) =>
    set({ selectedShape: { shape, parentLayer }, selectedLayer: null }),
}));
