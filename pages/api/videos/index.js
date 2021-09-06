// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IncomingForm, Fields, Files } from "formidable";
import { handleCloudinaryUpload } from "../../../lib/cloudinary";
import { database } from "../../../lib/database";

// Custom config for our API route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET": {
      try {
        const result = await handleGetRequest();

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }

    case "POST": {
      try {
        const result = await handlePostRequest(req);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }

    default: {
      return res.status(405).json({ message: "Method not allowed" });
    }
  }
}

const handleGetRequest = () => database.getVideos();

const handlePostRequest = async (req) => {
  // Get the form data using the parseForm function
  const data = await parseForm(req);

  // Get the main video file
  const video = data.files.video;

  // Get the ad video file
  const adVideo = data.files.adVideo;

  // Upload the main video file to Cloudinary
  const videoUploadResult = await handleCloudinaryUpload(video.path);

  // Get the main video's midpoint
  const videoMidPoint = Math.round(videoUploadResult.duration / 2);

  // Upload the ad video file to Cloudinary
  const adVideoUploadResult = await handleCloudinaryUpload(adVideo.path, [
    {
      background: "black",
      aspect_ratio: `${videoUploadResult.width / videoUploadResult.height}`,
      crop: "lpad",
    },
    { effect: "progressbar:frame:FF0000:12" },
  ]);

  // Add the main video and ad video to the database
  const result = await database.addNewVideo({
    video: videoUploadResult,
    adVideo: adVideoUploadResult,
    adPlacement: videoMidPoint,
  });

  return result;
};

/**
 *
 * @param {*} req
 * @returns {Promise<{ fields:Fields; files:Files; }>}
 */
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: true });

    form.parse(req, (error, fields, files) => {
      if (error) {
        return reject(error);
      }

      return resolve({ fields, files });
    });
  });
};
