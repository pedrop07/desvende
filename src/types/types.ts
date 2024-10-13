interface Letter {
	id: number;
	value: string;
	active: boolean;
}

export interface Row {
	id: number;
	hasSubmitted: boolean;
	attempt: string;
	letters: Letter[];
}
