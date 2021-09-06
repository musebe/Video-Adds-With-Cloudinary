import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "../../components/Layout";

export default function Videos() {
  // State for the videos
  const [videos, setVideos] = useState([]);

  // Loadin state
  const [loading, setLoading] = useState(false);

  // Memoized function to Fetch the videos
  const getVideos = useCallback(async () => {
    try {
      // Make a GET request to the /api/videos endpoint
      const response = await fetch("/api/videos", {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      setVideos(data.result);
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    }
  }, []);

  // Fetch the videos on component mount
  useEffect(() => {
    getVideos();
  }, [getVideos]);

  const handleDeleteVideo = async (id) => {
    try {
      setLoading(true);

      // Make a DELETE request to the /api/videos/:id endpoint
      const response = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      // Refresh the videos
      getVideos();
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {videos.length ? (
        <div className="wrapper">
          {videos.map((video, index) => (
            <div className="video" key={`video-${index}`}>
              <Link href={`/videos/${video._id}`} passHref>
                <div className="thumbnail">
                  <Image
                    className="thumbnail-image"
                    layout="fill"
                    src={video.video.secure_url.replace(".mp4", ".gif")}
                    alt={video.video.secure_url}
                  ></Image>
                  <div className="controls">Click to play</div>
                </div>
              </Link>
              <div className="video-info">
                <p>{video.video.original_filename}</p>
                <a>
                  <Link href={video.video.secure_url}>
                    {video.video.secure_url}
                  </Link>
                </a>
                <button
                  disabled={loading}
                  onClick={() => {
                    handleDeleteVideo(video._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-videos">
          <p>No videos yet</p>
          <Link href="/" passHref>
            <button>Upload videos</button>
          </Link>
        </div>
      )}
      <style jsx>{`
        div.wrapper {
          padding: 10px;
          background-color: #ffffff;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          display: flex;
          flex-flow: row wrap;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 10px;
        }

        div.wrapper div.video {
          background-color: #ffffff;
          flex: 0 0 400px;
          height: 320px;
          box-shadow: 0 0 1px rgba(34, 25, 25, 0.4);
          overflow: hidden;
        }

        div.wrapper div.video:hover {
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
        }

        @media only screen and (max-width: 600px) {
          div.wrapper div.video {
            flex: 1 0 500px;
            height: 400px;
          }
        }

        div.wrapper div.video div.thumbnail {
          position: relative;
          width: 100%;
          height: 70%;
          cursor: pointer;
        }

        div.wrapper div.video div.thumbnail .thumbnail-image {
          width: 100%;
          display: none;
        }

        div.wrapper div.video div.controls {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          font-weight: bold;
          font-size: 1em;
        }

        div.wrapper div.video div.video-info {
          width: 100%;
          height: 30%;
          padding: 10px;
          overflow: hidden;
        }

        div.wrapper div.video div.video-info p {
          margin: 5px 0;
        }

        div.wrapper div.video div.video-info a {
          white-space: nowrap;
          overflow-y: auto;
          text-overflow: ellipsis;
        }

        div.no-videos {
          background-color: #ffffff;
          width: 100%;
          height: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Layout>
  );
}
