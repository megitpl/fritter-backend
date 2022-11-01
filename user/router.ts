/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { Request, Response } from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import { Freet } from 'freet/model';

const router = express.Router();

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  '/session',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isValidPassword,
    userValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsernameAndPassword(
      req.body.username, req.body.password
    );
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: 'You have logged in successfully',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  '/session',
  [
    userValidator.isUserLoggedIn
  ],
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).json({
      message: 'You have been logged out successfully.'
    });
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.username, req.body.password);
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PUT /api/users
 *
 * @param {string} username - The user's new username
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await UserCollection.deleteOne(userId);
    await FreetCollection.deleteMany(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
);

/**
 * Show the logger in user's profile.
 *
 * @name GET /api/users/profile
 * @throws {403} - If user is not logged in
 */
router.get(
  '/profile',
  // [
  //   userValidator.isUserLoggedIn
  // ],

  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    res.status(200).json({
      message: 'This is the user.',
      user
    });
  }
);
/**
 * Show a given user's profile.
 *
 * @name GET /api/users/:username/profile
 * @throws {403} - If user is not logged in
 */
router.get(
  '/:username?/profile',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.username);
    res.status(200).json({
      message: 'This is the user profile.',
      user
    });
  }
);
/**
 * Follow a user.
 *
 * @name PUT /api/users/:username/follow
 *
 */
router.put(
  '/:username?/follow',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    const followUsername = req.params.username;

    if (user.username === followUsername) {
      res.status(403).json({
        error: 'Cannot follow yourself.'
      });
    }

    if (user.followed.includes(followUsername)) {
      res.status(403).json({
        error: 'Already following.'
      });
    }

    await UserCollection.followUser(userId, followUsername);
    res.status(200).json({
      message: 'Successfully followed!'
    });
  }
);

/**
 * Unfollow a user.
 *
 * @name PUT /api/users/:username/follow
 *
 */
router.put(
  '/:username?/unfollow',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    const unfollowUsername = req.params.username;
    if (!user.followed.includes(unfollowUsername)) {
      res.status(403).json({
        message: 'You do not follow this user.'
      });
    }

    await UserCollection.unfollowUser(userId, unfollowUsername);
    res.status(200).json({
      message: 'Successfully unfollowed!'
    });
  }
);
/**
 * Show a user's timeline.
 *
 * @name GET /api/users/timeline
 *
 */
router.get(
  '/timeline',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const user = await UserCollection.findOneByUserId(userId);
    const timeline: Freet[] = [];
    user.postedFreets.map(x => timeline.push(x));
    user.sharedFreets.map(x => timeline.push(x));
    res.status(200).json({
      message: 'This is the users timeline!',
      timeline
    });
  }
);
/**
 * Show a user's feed.
 *
 * @name GET /api/users/feed
 *
 */
router.get(
  '/feed',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    const feed: Freet[] = [];
    for (const item of user.followed) {
      const followedUser = await UserCollection.findOneByUsername(item);
      const posted = followedUser.postedFreets;
      const shared = followedUser.sharedFreets;
      for (const post of posted) {
        feed.push(post);
      }

      for (const share of shared) {
        feed.push(share);
      }

      posted.forEach(x => feed.push(x));
      shared.forEach(x => feed.push(x));
    }

    for (const item of user.postedFreets) {
      feed.push(item);
    }

    res.status(200).json({
      message: 'This is the users feed',
      feed
    });
  }
);

/**
 * View a user's shared Freets.
 *
 * @name GET /api/users/:username/shared
 *
 */
router.get(
  '/:username?/shared',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.username);
    const shared = user.sharedFreets;
    res.status(200).json({
      message: 'Shared freets:',
      shared
    });
  }
);

/**
 * View a user's liked Freets.
 *
 * @name GET /api/users/:username/liked
 *
 */
router.get(
  '/:username?/liked',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.username);
    const liked = user.likedFreets;
    res.status(200).json({
      message: 'Shared freets:',
      liked
    });
  }
);

/**
 * View user's posted Freets.
 *
 * @name GET /api/users/:username/posted
 *
 */
router.get(
  '/:username?/posted',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.username);
    const posted = user.postedFreets;
    res.status(200).json({
      message: 'posted freets:',
      posted
    });
  }
);



export { router as userRouter };
