import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import Layout from "../components/Layout";

export default function Home() {
  // Get the router from Next.js
  const router = useRouter();

  // State for the main video input
  const [videoFile, setVideoFile] = useState(null);

  // State for the ad video input
  const [adFile, setAdFile] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Get the form data
      const formData = new FormData(e.target);

      // Post the form data to the /api/videos endpoint
      const response = await fetch("/api/videos", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      // Navigate to the videos page
      router.push("/videos");
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="wrapper">
        <h1>Upload a video + Ad</h1>
        <hr />
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="video">
            <b>Select a video for upload</b>
          </label>
          <input
            type="file"
            name="video"
            id="video"
            multiple={false}
            accept=".mp4"
            required
            disabled={loading}
            onChange={(e) => {
              setVideoFile(e.target.files[0]);
            }}
          />
          <hr />
          <label htmlFor="video">
            <b>
              Select a short video ad that will be placed in the middle of your
              video
            </b>
          </label>
          <input
            type="file"
            name="adVideo"
            id="adVideo"
            multiple={false}
            accept=".mp4"
            required
            disabled={loading}
            onChange={(e) => {
              setAdFile(e.target.files[0]);
            }}
          />
          <button type="submit" disabled={loading || !videoFile || !adFile}>
            Upload
          </button>
        </form>
        <hr />
        <Link href="/videos" passHref>
          <button>View Uploaded Videos</button>
        </Link>
      </div>
      <style jsx>{`
        div.wrapper {
          background-color: #ffffff;
          height: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
        }

        div.wrapper > hr {
          min-width: 600px;
        }

        div.wrapper form {
          min-width: 600px;
          min-height: 300px;
          padding: 20px;
          background-color: #f5f5f5;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: flex-start;
          border-radius: 5px;
        }

        div.wrapper form hr {
          width: 100%;
        }

        div.wrapper form button {
          padding: 20px;
          min-width: 200px;
          border: none;
          background-color: #7700ff;
          color: white;
          font-weight: bold;
          margin-top: 20px;
          border-radius: 5px;
        }

        div.wrapper form button:disabled {
          background-color: #cccccc;
        }

        div.wrapper form button:hover:not([disabled]) {
          background-color: #ff0095;
        }

        div.wrapper > button {
          padding: 20px;
          min-width: 200px;
          border: none;
          background-color: #7700ff;
          color: white;
          font-weight: bold;
          margin-top: 20px;
          border-radius: 5px;
        }

        div.wrapper > button:hover {
          background-color: #ff0095;
        }
      `}</style>
    </Layout>
  );
}
