import { ILetter } from "@/types/letter"
import { IRow } from "@/types/row"

const LETTERS: ILetter[] = [
  {
    id: 0,
    value: '',
    active: true,
  },
  {
    id: 1,
    value: '',
    active: false,
  },
  {
    id: 2,
    value: '',
    active: false,
  },
  {
    id: 3,
    value: '',
    active: false,
  },
  {
    id: 4,
    value: '',
    active: false,
  },
]

export const ROWS: IRow[] = [
  {
    id: 0,
    hasSubmitted: false,
    attempt: '',
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
  {
    id: 1,
    hasSubmitted: false,
    attempt: '',
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
  {
    id: 2,
    hasSubmitted: false,
    attempt: '',
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
  {
    id: 3,
    hasSubmitted: false,
    attempt: '',
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
  {
    id: 4,
    hasSubmitted: false,
    attempt: '',
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
  {
    id: 5,
    hasSubmitted: false,
    attempt: '',
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
]