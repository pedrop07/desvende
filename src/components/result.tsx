import Countdown from "react-countdown";

interface ResultProps {
	isCorrect: boolean;
	answer: string;
}

function NextWordCountdown() {
	return (
		<div className="flex flex-col items-center">
			<span className="text-xl text-slate-300">próxima palavra em:</span>
			<Countdown date={new Date().setHours(24, 0, 0, 0)} className="text-3xl font-semibold" />
		</div>
	);
}

export function Result({ isCorrect, answer }: ResultProps) {
	const Answer = () => <span className="text-emerald-500">{`"${answer}"`}</span>;

	if (isCorrect) {
		return (
			<div>
				<p className="text-2xl mb-4 text-center">
					Parabéns, você acertou a palavra do dia! <br />
					Resposta: <Answer />
				</p>
				<NextWordCountdown />
			</div>
		);
	}

	return (
		<div>
			<div className="flex flex-col items-center mb-4">
				<h2 className="text-2xl mb-2">Você errou a palavra do dia :(</h2>
				<h3 className="text-xl">
					Resposta: <Answer />
				</h3>
			</div>
			<NextWordCountdown />
		</div>
	);
}
