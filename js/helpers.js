/*
 * This file is for helper functions
 *         These functions will be widely used in our application
 *
 */

// Generate Random ID

export const GENERATE_RANDOM_ID = () => {
  const ID_LENGTH = 36;
  const allLetters = "abcdefghijklmnopqrstuvwxyz1234567890!@#$~=+_-";

  let generatedId = "";

  for (let i = 0; i < ID_LENGTH; i++) {
    generatedId += allLetters.charAt(Math.floor(Math.random() * ID_LENGTH));
  }

  return generatedId;
};
