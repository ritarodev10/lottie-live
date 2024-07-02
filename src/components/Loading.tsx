import Lottie from "react-lottie-player";
import LoadingLottie from "../assets/loading-lottie.json";

const Loading = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Lottie
        loop
        play
        animationData={LoadingLottie}
        style={{ width: "100px", height: "auto" }}
        className="mb-4 rounded-md"
      />
      <div className="text-gray-700">Loading...</div>
    </div>
  );
};

export default Loading;
