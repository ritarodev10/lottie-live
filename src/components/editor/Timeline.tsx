import { useAnimationStore } from "../../stores/lottie.store";
import { LoopIcon, PauseIcon, PlayIcon } from "../Icons";
import { Slider } from "../ui/slider";

const Timeline = () => {
  const {
    isPlaying,
    isLooping,
    playbackRate,
    currentFrame,
    totalFrames,
    frameRate,
    setIsPlaying,
    setIsLooping,
    setPlaybackRate,
    setCurrentFrame,
  } = useAnimationStore();

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const handleTogglePlaybackRate = () => {
    const newRate = playbackRate === 3 ? 1 : playbackRate + 1;
    setPlaybackRate(newRate);
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentFrame(value[0]);
  };

  const currentTime = currentFrame / frameRate;
  const duration = totalFrames / frameRate;

  return (
    <div className="flex flex-col relative z-20 select-none rounded-t-lg h-24">
      <div className="px-10 flex flex-row bg-white border-b shadow-sm border-gray-100 box-border absolute w-full left-0 top-0 rounded-lg h-14">
        <div className="flex justify-between items-center w-72 gap-2">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={handleTogglePlay}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </div>
            <div onClick={handleToggleLoop}>
              <LoopIcon fill={isLooping ? "#63727e" : "#b4babf"} />
            </div>
            <div className="flex items-center justify-center w-8 h-8">
              <div
                className="cursor-pointer flex justify-center items-center w-[27px] h-[27px] rounded-full font-semibold bg-[#63727e] text-white"
                onClick={handleTogglePlaybackRate}
              >
                {playbackRate}x
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center text-gray-700">
            <span className="w-10">{currentTime.toFixed(2)}</span>
            <span className="w-2">/</span>
            <span className="w-20"> {duration.toFixed(2)} s</span>
          </div>
        </div>
        <div className="flex flex-1">
          <Slider
            defaultValue={[0]}
            value={[currentFrame]}
            onValueChange={handleSliderChange}
            max={totalFrames}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
