import { extensiveDictionary } from "../../extensive-dictionary";
import { removeAccents } from "./removeAccents";

export function wordExistsInDictionary(value: string) {
  return extensiveDictionary.some((word) => removeAccents(word) === value.toLowerCase())
}