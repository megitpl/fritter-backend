/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { HydratedDocument, Types } from 'mongoose';
import type { User } from './model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string, password: string): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();

    const user = new UserModel({ username, password, dateJoined });
    await user.save(); // Saves user to MongoDB
    return user;
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({ _id: userId });
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({ username: new RegExp(`^${username.trim()}$`, 'i') });
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: any): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({ _id: userId });
    if (userDetails.password) {
      user.password = userDetails.password as string;
    }

    if (userDetails.username) {
      user.username = userDetails.username as string;
    }

    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({ _id: userId });
    return user !== null;
  }

  /**
   * Follow a user by username. (case insensitive)
   *
   * @param {string} userId - The username of the user to be followed
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async followUser(userId: Types.ObjectId | string, username: string): Promise<HydratedDocument<User, User>> {
    const user = await UserCollection.findOneByUserId(userId);
    const toBeFollowed = await UserCollection.findOneByUsername(username);
    toBeFollowed.followers.push(user.username);
    user.followed.push(username);
    await user.save();
    await toBeFollowed.save();
    return user;
  }

  /**
 * Unfollow a user by userId. (case insensitive)
 *
 * @param {string} userId - The username of the user to be followed
 * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
 */
  static async unfollowUser(userId: Types.ObjectId | string, username: string): Promise<HydratedDocument<User>> {
    const user = await UserCollection.findOneByUserId(userId);
    const toBeUnfollowed = await UserCollection.findOneByUsername(username);
    user.followed.forEach((item, index) => {
      if (item === username) {
        user.followed.splice(index, 1);
      }
    });
    toBeUnfollowed.followers.forEach((item, index) => {
      if (item === user.username) {
        toBeUnfollowed.followers.splice(index, 1);
      }
    });
    await user.save();
    await toBeUnfollowed.save();
    return user;
  }
}

export default UserCollection;
