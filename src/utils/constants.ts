import { generateCharacterArray } from "@utils/generateCharacterArray";

export const MAXIMUM_IMAGE_FILE_SIZE = 1024 * 1024 * 5; // ~ 5 MB
export const MAXIMUM_EXTERNAL_IMAGE_FILE_SIZE = 1024 * 1024 * 2.5; // ~ 2.5 MB

export const MINIMUM_URL_DIGITS = 5;
export const URL_AVAILABLE_CHARACTERS = [
    ...generateCharacterArray("A", "Z"), // A~Z
    ...generateCharacterArray("a", "z"), // a~z,
    ...generateCharacterArray("0", "9"), // 0~9
].join("");
