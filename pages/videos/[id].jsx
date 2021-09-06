import { useRouter } from "next/router";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  SyntheticEvent,
} from "react";
import Layout from "../../components/Layout";

export default function Video() {
  // Get the router
  const router = useRouter();

  // Get the video id from the url
  const { id } = router.query;

  // State to store our video
  const [video, setVideo] = useState(null);

  /**
   * Stores a reference to our video element
   * @type {MutableRefObject<HTMLVideoElement>}
   */
  const videoRef = useRef(null);

  /**
   * Stores a reference to our ad video element
   * @type {MutableRefObject<HTMLVideoElement>}
   */
  const adVideoRef = useRef(null);

  /**
   * Stores a reference to our skip button
   * @type {MutableRefObject<HTMLButtonElement>}
   */
  const skipButtonRef = useRef(null);

  const getVideo = useCallback(async () => {
    try {
      // Post the form data to the /api/videos/:id endpoint
      const response = await fetch(`/api/videos/${id}`, {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      setVideo(data.result);
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    }
  }, [id]);

  // Get videos on component mount
  useEffect(() => {
    getVideo();
  }, [getVideo]);

  /**
   * This function throttles our event listener to prevent it from firing too often
   * @param {Function} func Callback function to execute
   * @param {number} delay Delay in milliseconds
   * @returns {Function}
   */
  const throttle = (func, delay = 800) => {
    // Previously called time of the function
    let prev = 0;
    return (...args) => {
      // Current called time of the function
      let now = new Date().getTime();

      // If difference is greater than delay call
      // the function again.
      if (now - prev > delay) {
        prev = now;

        // "..." is the spread operator here
        // returning the function with the
        // array of arguments
        return func(...args);
      }
    };
  };

  /**
   * This function is called when the main video playback progress changes
   * @param {SyntheticEvent<HTMLVideoElement, Event>} ev
   */
  const onVideoTimeUpdate = (ev) => {
    const { currentTime } = ev.target;

    // Check if the video's current time matches the ad's begin time
    if (
      Math.round(currentTime).toFixed(2) ===
      Math.round(video.adPlacement).toFixed(2)
    ) {
      console.log("Play ad");
      // Pause the main video
      videoRef.current.pause();

      // Show the ad video element on top of the main video
      adVideoRef.current.style.display = "block";

      // Show the skip ad button
      skipButtonRef.current.style.display = "block";

      // Play the ad video
      adVideoRef.current.play();
    }
  };

  /**
   * This function is called when the skip ad button is clicked
   */
  const skipAd = () => {
    // Make sure the ad video is paused
    adVideoRef.current.pause();

    // Hide the ad video element
    adVideoRef.current.style.display = "none";

    // Hide the skip ad button
    skipButtonRef.current.style.display = "none";

    // Increse the main video's current time by one second to prevent the ad from playing twice
    videoRef.current.currentTime += 1;

    // Play the main video
    videoRef.current.play();
  };

  return (
    <Layout>
      <div className="wrapper">
        {video ? (
          <div className="video-wrapper">
            <video
              ref={videoRef}
              id="video"
              src={video.video.secure_url}
              preload="auto"
              controls
              onTimeUpdate={throttle(onVideoTimeUpdate)}
            ></video>
            <video
              ref={adVideoRef}
              id="adVideo"
              src={video.adVideo.secure_url}
              preload="auto"
              controls
              onEnded={() => {
                console.log("Ad ended");
                skipAd();
              }}
            ></video>
            <button className="skip" ref={skipButtonRef} onClick={skipAd}>
              SKIP AD
            </button>
          </div>
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>
      <style jsx>{`
        .wrapper {
          background-color: #ffffff;
          height: 100%;
          width: 100%;
        }

        .video-wrapper {
          position: relative;
          width: 80%;
          margin: 20px auto;
          background-color: #ffffff;
        }

        .video-wrapper video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-wrapper video#adVideo {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: none;
        }

        .video-wrapper button.skip {
          position: absolute;
          bottom: 100px;
          right: 20px;
          padding: 15px;
          min-width: 100px;
          font-weight: bold;
          border: none;
          background-color: #ffffff7c;
          display: none;
        }

        .video-wrapper button.skip:hover {
          background-color: #ffffff;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80%;
          height: 80%;
          margin: 20px auto;
          background-color: #f3f3f3;
        }
      `}</style>
    </Layout>
  );
}
