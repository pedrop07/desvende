interface LettersData {
  id: number;
  value: string;
  active: boolean;
}

export interface RowsData {
  id: number;
  hasSubmitted: boolean;
  attempt: string;
  letters: LettersData[];
}