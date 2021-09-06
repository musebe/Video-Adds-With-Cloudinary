import { handleCloudinaryDelete } from "../../../lib/cloudinary";
import { database } from "../../../lib/database";

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case "GET": {
      try {
        if (!id) {
          throw "id param is required";
        }

        const result = await handleGetRequest(id);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }
    case "DELETE": {
      try {
        if (!id) {
          throw "id param is required";
        }

        await handleDeleteRequest(id);

        return res.status(200).json({ message: "Success" });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }
    default: {
      return res.status(405).json({ message: "Method not allowed" });
    }
  }
}

const handleGetRequest = (id) => database.getVideo(id);

const handleDeleteRequest = async (id) => {
  const video = await database.getVideo(id);

  await handleCloudinaryDelete([
    video.video.public_id,
    video.adVideo.public_id,
  ]);

  await database.deleteVideo(id);
};
