import { join } from "path";
import Datastore from "nedb";

// Custom database class using nedb, a simple flat file database
class Database {
  constructor() {
    this.db = {
      // Create a new datastore for videos
      videos: new Datastore({
        filename: join("data", "videos.db"),
        autoload: true,
      }),
    };
  }

  // This method queries the database for videos
  getVideos() {
    return new Promise((resolve, reject) => {
      this.db.videos.find().exec((err, videos) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(videos);
      });
    });
  }

  // This method adds a new video to the videos datastore
  addNewVideo(video) {
    return new Promise((resolve, reject) => {
      this.db.videos.insert(video, (err, newDoc) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(newDoc);
      });
    });
  }

  // This method gets a video from the database using the video public id
  getVideo(videoId) {
    return new Promise((resolve, reject) => {
      this.db.videos.findOne({ _id: videoId }, (err, video) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(video);
      });
    });
  }

  // This method deletes a video from the database using the video id
  deleteVideo(videoId) {
    return new Promise((resolve, reject) => {
      this.db.videos.remove({ _id: videoId }, {}, (err, numRemoved) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(numRemoved);
      });
    });
  }
}

// Create a new instance of the database class and export it as a singleton
export const database = new Database();
