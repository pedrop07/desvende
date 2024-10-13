import type { Row } from "@/types/types";

export const ROWS: Row[] = Array.from({ length: 6 }, (_, index) => {
	return {
		id: index,
		hasSubmitted: false,
		attempt: "",
		letters: [
			{
				id: 0,
				value: "",
				active: true,
			},
			{
				id: 1,
				value: "",
				active: false,
			},
			{
				id: 2,
				value: "",
				active: false,
			},
			{
				id: 3,
				value: "",
				active: false,
			},
			{
				id: 4,
				value: "",
				active: false,
			},
		],
	};
});
