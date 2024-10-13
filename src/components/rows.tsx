"use client";

import { useCallback, useEffect, useState } from "react";
import { removeAccents } from "@/utils/removeAccents";
import { tv } from "tailwind-variants";
import toast from "react-hot-toast";
import { ROWS } from "@/constants/rows";
import type { Row } from "@/types/types";
import { acceptedAnswers } from "../../constants/accepted-answers";
import { isNotAcceptedWord } from "@/utils/isNotAcceptedWord";
import { Result } from "./result";

function containsNonStringValue(array: string[]) {
	for (let i = 0; i < array.length; i++) {
		if (typeof array[i] !== "string") {
			return true;
		}
	}
	return false;
}

function containsEmptyValues(array: string[]) {
	let hasEmptyValue = false;

	array.forEach((value, index) => {
		if (value === "" && array[index + 1] && index !== array.length) hasEmptyValue = true;
	});

	return hasEmptyValue;
}

interface LocalStorageData {
	attempts: string[];
	expires: number;
}

interface RowProps {
	answerArray: string[];
	answerString: string;
}

const letterStyle = tv({
	base: "w-[77px] h-[77px] text-4xl p-3 font-bold text-white flex justify-center items-center rounded-md",
	variants: {
		active: {
			true: "cursor-pointer data-[active=true]:border-violet-400 data-[active=true]:border-b-8 border-2 border-violet-600",
			false: "bg-indigo-900",
		},
		color: {
			correct: "bg-emerald-500",
			wrong: "bg-rose-500",
			near: "bg-yellow-400",
		},
	},
});

export function Rows({ answerArray, answerString }: RowProps) {
	const [rows, setRows] = useState(ROWS);
	const [activeRowId, setActiveRowId] = useState(0);
	const [isFinished, setIsFinished] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);

	const getActiveLetterIndex = () => {
		const letters = rows[activeRowId].letters;
		const activeLetterIndex = letters.findIndex(({ active }) => active === true);
		return activeLetterIndex;
	};

	const isInvalidLetterId = (letterId: number) => !(letterId >= 0 && letterId < rows[activeRowId].letters.length);

	const handleActiveLetter = (letterId: number) => {
		if (isInvalidLetterId(letterId)) return;

		const newRows = [...rows];
		const activeRow = newRows[activeRowId];
		const activeLetterId = getActiveLetterIndex();

		activeRow.letters[activeLetterId].active = false;
		activeRow.letters[letterId].active = true;

		setRows(newRows);
	};

	const handleChangeLetterValue = (letterId: number, newValue: string) => {
		const newRows = [...rows];
		const activeRow = newRows[activeRowId];

		const isCurrentLetterEmpty = newRows[activeRowId].letters[letterId].value === "";
		const isNewValueEmpty = newValue === "";
		const isNotFirstLetter = letterId !== 0;

		const removePreviousLetterValue = () => {
			activeRow.letters[letterId - 1].value = "";
			handleActiveLetter(letterId - 1);
		};

		const updateCurrentLetterValue = () => {
			activeRow.letters[letterId].value = newValue;
		};

		if (isNewValueEmpty && isCurrentLetterEmpty && isNotFirstLetter) {
			removePreviousLetterValue();
			return;
		}

		updateCurrentLetterValue();

		setRows(newRows);
	};

	const handleClickLetter = (letterId: number, rowId: number) => {
		if (rowId !== activeRowId) return;
		if (isFinished) return;
		handleActiveLetter(letterId);
	};

	const handleSubmit = () => {
		const attempt = rows[activeRowId].letters.map(({ value }) => value).join("");

		if (attempt.length < 5) {
			toast("a palavra deve ter 5 letras", {
				style: {
					padding: "8px 12px",
					color: "#fff",
					fontWeight: "600",
					fontSize: "18px",
					backgroundColor: "#7C3AED",
				},
			});
			return;
		}

		if (isNotAcceptedWord(attempt)) {
			toast("essa palavra não é aceita", {
				style: {
					padding: "8px 12px",
					color: "#fff",
					fontWeight: "600",
					fontSize: "18px",
					backgroundColor: "#7C3AED",
				},
			});
			return;
		}

		const newState = [...rows];
		newState[activeRowId].attempt = attempt;
		newState[activeRowId].hasSubmitted = true;
		setRows(newState);

		const attempts = rows.map((row) => {
			return row.letters.map(({ value }) => value).join("");
		});

		const localStorageData = {
			attempts: attempts,
			expires: new Date().setHours(24, 0, 0, 0),
		};

		localStorage.setItem("@desvende:attempts", JSON.stringify(localStorageData));

		if (attempt === removeAccents(answerString)) {
			setIsFinished(true);
			setIsCorrect(true);
			setActiveRowId(7);
			return;
		}

		const hasFinished = attempts.every((attempt) => attempt.length >= 5);
		if (hasFinished) setIsFinished(true);

		setActiveRowId((prevState) => prevState + 1);
	};

	const handleKeyDownEvent = useCallback(
		(event: KeyboardEvent) => {
			if (activeRowId === rows.length) return;

			const letters = rows[activeRowId].letters;
			const activeLetterIndex = getActiveLetterIndex();

			if (event.code === "ArrowRight") handleActiveLetter(activeLetterIndex + 1);

			if (event.code === "ArrowLeft") handleActiveLetter(activeLetterIndex - 1);

			if (event.code.includes("Key")) {
				handleChangeLetterValue(activeLetterIndex, event.key.toUpperCase());

				const nextEmptyLetterIndex = letters.findIndex(({ value }) => !value);
				if (nextEmptyLetterIndex !== -1) handleActiveLetter(nextEmptyLetterIndex);
			}

			if (event.code === "Backspace") handleChangeLetterValue(activeLetterIndex, "");

			if (event.code === "Enter") handleSubmit();
		},
		[activeRowId],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDownEvent);

		if (isFinished) document.removeEventListener("keydown", handleKeyDownEvent);
		return () => document.removeEventListener("keydown", handleKeyDownEvent);
	}, [handleKeyDownEvent, isFinished]);

	useEffect(() => {
		const localStorageAttempts = localStorage.getItem("@desvende:attempts");

		if (localStorageAttempts) {
			const { attempts, expires } = JSON.parse(localStorageAttempts) as LocalStorageData;

			if (!Array.isArray(attempts) || containsNonStringValue(attempts) || containsEmptyValues(attempts)) {
				localStorage.removeItem("@desvende:attempts");
				return;
			}

			let wordDoesNotExist = false;

			for (const attempt of attempts) {
				if (isNotAcceptedWord(attempt) && attempt !== "") wordDoesNotExist = true;
			}

			if (Date.now() >= expires || attempts.length !== 6 || wordDoesNotExist) {
				localStorage.removeItem("@desvende:attempts");
				return;
			}
			const newState: Row[] = JSON.parse(JSON.stringify(ROWS));

			const updatedRows = newState.map((row) => {
				const hasSubmitted = attempts[row.id].length === 5;
				const finalAttempt = attempts[row.id];

				row.letters.forEach((letter, index) => {
					const newValue = attempts[row.id].split("")[index];
					letter.value = newValue;
				});

				return {
					...row,
					hasSubmitted,
					attempt: finalAttempt,
				};
			});
			setRows(updatedRows);

			const activeRowId = attempts.findIndex((attempt) => attempt === "");
			setActiveRowId(activeRowId);

			const isCorrect = attempts.includes(removeAccents(answerString));
			if (isCorrect) {
				setIsFinished(true);
				setIsCorrect(true);
				setActiveRowId(7);
			}

			const hasFinished = attempts.every((attempt) => attempt.length >= 5);
			if (attempts.length === 6 && hasFinished) {
				setIsFinished(true);
			}
		}
	}, []);

	return (
		<>
			{isFinished && <Result answer={answerString} isCorrect={isCorrect} />}
			<div className="flex justify-center items-center flex-col gap-3 mt-4">
				{rows.map((row) => {
					return (
						<div key={row.id} className="flex justify-center items-center gap-3" data-active={row.id === activeRowId}>
							{row.letters.map((letter, index) => {
								let position: "correct" | "wrong" | "near" | undefined;

								let value = letter.value;

								if (row.hasSubmitted && letter.value !== "") {
									position = "wrong";
									const attempt = acceptedAnswers.find(
										(word) => removeAccents(word) === row.attempt.toLowerCase(),
									) as string;

									const attemptArray = attempt.toUpperCase().split("");
									value = attemptArray[index];

									if (removeAccents(answerString).includes(letter.value)) {
										position = "near";
									}

									if (letter.value === removeAccents(answerArray[index])) {
										position = "correct";
									}
								}

								const isActive = row.id === activeRowId;

								return (
									<div
										key={letter.id}
										className={letterStyle({ active: isActive, color: position })}
										data-active={letter.active}
										onClick={() => handleClickLetter(letter.id, row.id)}
									>
										{value}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</>
	);
}
