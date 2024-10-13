import { acceptedAnswers } from "../../constants/accepted-answers";
import { removeAccents } from "./removeAccents";

export function isNotAcceptedWord(value: string) {
	return !acceptedAnswers.some((word) => removeAccents(word) === value.toLowerCase());
}
