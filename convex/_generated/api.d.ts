/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as catchphraseData from "../catchphraseData.js";
import type * as chat from "../chat.js";
import type * as files from "../files.js";
import type * as game from "../game.js";
import type * as gameData from "../gameData.js";
import type * as knowledgeBase from "../knowledgeBase.js";
import type * as listModels from "../listModels.js";
import type * as questions from "../questions.js";
import type * as questionsData from "../questionsData.js";
import type * as quizAi from "../quizAi.js";
import type * as rooms from "../rooms.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  catchphraseData: typeof catchphraseData;
  chat: typeof chat;
  files: typeof files;
  game: typeof game;
  gameData: typeof gameData;
  knowledgeBase: typeof knowledgeBase;
  listModels: typeof listModels;
  questions: typeof questions;
  questionsData: typeof questionsData;
  quizAi: typeof quizAi;
  rooms: typeof rooms;
  seed: typeof seed;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
