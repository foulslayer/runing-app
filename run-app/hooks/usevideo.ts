import AsyncStorage from "@react-native-async-storage/async-storage";
import malerunner from "../assets/8380510-uhd_1440_2560_25fps.mp4";
import femalerunner from "../assets/27756690_MotionElements_runner-enjoy-run-sunny-day_preview.mp4";
import { useEffect, useState } from "react";
import { Image } from "react-native";

export const useVideo = () => {
  const [videoSource, setVideoSource] = useState<any>(null);

  const getAssetUri = (asset: any): string => {
    const resolved = Image.resolveAssetSource(asset);
    return resolved?.uri || "";
  };

  // Function to set and save video source
  const setRunner = async (runnerType: string) => {
    try {
      let selectedVideo: string;

      if (runnerType === "malerunner") {
        selectedVideo = getAssetUri(malerunner); // Resolve to actual URI
      } else if (runnerType === "femalerunner") {
        selectedVideo = getAssetUri(femalerunner); // Resolve to actual URI
      } else {
        throw new Error("Invalid runner type");
      }

      setVideoSource(JSON.stringify(selectedVideo)); // Update state with resolved URI
      await AsyncStorage.setItem("videoSource", JSON.stringify(selectedVideo)); // Save to AsyncStorage
      console.log("Saved video source:", selectedVideo);
      console.log("Saved video source JSON:", JSON.stringify(selectedVideo));
    } catch (error) {
      console.error("Error saving video source:", error);
    }
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const storedVideo = await AsyncStorage.getItem("videoSource");
        if (storedVideo) {
          setVideoSource(JSON.parse(storedVideo)); // Parse the string back to URI
        }
      } catch (error) {
        console.error("Error loading video source:", error);
      }
    };

    loadVideo();
  }, []);

  // create function above but where malerunner and femalerunner is the real video source so we can save it in async storage
  // and then use that video source in the video component

  /* useEffect(() => {
    const loadVideo = async () => {
      try {
        const storedVideo = await AsyncStorage.getItem("videoSource");
        if (storedVideo) {
          setVideo(storedVideo);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      }
    };
    loadVideo();
  }, []) */

  return { videoSource, setVideoSource, setRunner };
};
