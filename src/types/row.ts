import { ILetter } from "./letter"

export interface IRow {
  id: number
  hasSubmitted: boolean
  attempt: string
  letters: ILetter[]
}