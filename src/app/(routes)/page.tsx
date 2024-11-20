"use client";

import { Header } from "@/components/header";
import { Rows } from "@/components/rows";
import { generateAnswer } from "@/utils/generateAnswer";

export default function Home() {
	const answer = generateAnswer();

	const answerString = answer;
	const answerArray = answer?.split("");

	return (
		<div>
			<Header />
			<Rows answerArray={answerArray} answerString={answerString} />
		</div>
	);
}
