/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { HydratedDocument, Types } from 'mongoose';
import type { Freet } from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import UserModel from 'user/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({ _id: freetId }).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({ dateModified: -1 }).populate('authorId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({ authorId: author._id }).populate('authorId');
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({ _id: freetId });
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({ _id: freetId });
    return freet !== null;
  }

  /**
   * Like a freet with given freetId.
   *
   * @param {string} freetId
   * @return {Promise<HydratedDocument<Freet>>}
   */
  static async likeTweet(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetCollection.findOne(freetId);
    const user = await UserCollection.findOneByUserId(userId);
    if (!freet.likedBy.includes(userId)) {
      freet.likedBy.push(userId);
    }

    if (!user.likedFreets.includes(freetId)) {
      user.likedFreets.push(freetId);
    }

    await freet.save();
    await user.save();
    return freet;
  }

  /**
   * Unlike a freet with given freetId.
   *
   * @param {string} freetId
   * @return {Promise<HydratedDocument<Freet>>}
   */
  static async unlikeTweet(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetCollection.findOne(freetId);
    const user = await UserCollection.findOneByUserId(userId);
    if (freet.likedBy.includes(userId)) {
      freet.likedBy.forEach((i, idx) => {
        if (i === userId) {
          freet.likedBy.splice(idx, 1);
        }
      });
    }

    if (user.likedFreets.includes(userId)) {
      user.likedFreets.forEach((i, idx) => {
        if (i === freetId) {
          user.likedFreets.splice(idx, 1);
        }
      });
    }

    await freet.save();
    await user.save();
    return freet;
  }

  /**
   * Share a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<HydratedDocument<Freet>>} - true if the freet has been deleted, false otherwise
   */
  static async shareTweet(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetCollection.findOne(freetId);
    const user = await UserCollection.findOneByUserId(userId);
    if (!freet.sharedBy.includes(userId)) {
      freet.sharedBy.push(userId);
    }

    if (!user.sharedFreets.includes(freetId)) {
      user.sharedFreets.push(freetId);
    }

    await freet.save();
    await user.save();
    return freet;
  }

  /**
     * Unshare a freet with given freetId.
     *
     * @param {string} freetId
     * @return {Promise<HydratedDocument<Freet>>}
     */
  static async unshareTweet(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetCollection.findOne(freetId);
    const user = await UserCollection.findOneByUserId(userId);
    if (freet.sharedBy.includes(userId)) {
      freet.sharedBy.forEach((i, idx) => {
        if (i === userId) {
          freet.sharedBy.splice(idx, 1);
        }
      });
    }

    if (user.sharedFreets.includes(userId)) {
      user.sharedFreets.forEach((i, idx) => {
        if (i === freetId) {
          user.sharedFreets.splice(idx, 1);
        }
      });
    }

    await freet.save();
    await user.save();
    return freet;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({ authorId });
  }
}

export default FreetCollection;
