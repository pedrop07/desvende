import { possibleAnswers } from "../../constants/possible-answers";

export function generateAnswer() {
	const currentDate = new Date();

	const day = currentDate.getDate();
	const month = currentDate.getMonth() + 1;
	const year = currentDate.getFullYear();

	const dateSum = day + month + year;

	const index = dateSum % possibleAnswers.length;
	const answers = possibleAnswers[index];
	return answers.toUpperCase();
}
