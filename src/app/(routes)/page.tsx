import { getAnswer } from '@/actions/get-answer';
import { Rows } from '@/components/rows';
import { ROWS } from '@/constants/rows';
import { RowsData } from '@/types/rows';
import { cookies } from 'next/headers';

export interface InitialStateData {
  rows: RowsData[];
  activeRowId: number;
  isFinished: boolean;
  isCorrect: boolean;
}

export default async function Home() {
  const { answer } = await getAnswer();

  const answerString = answer;
  const answerArray = answer?.split('');

  const cookieStore = cookies()
  const cookieAttempts = cookieStore.get('attempts')?.value
  let initialState: InitialStateData = {
    rows: ROWS,
    activeRowId: 0,
    isCorrect: false,
    isFinished: false
  };

  if (cookieAttempts) {
    const newState: RowsData[] = JSON.parse(JSON.stringify(ROWS));
    const attempts: string[] = JSON.parse(cookieAttempts);

    initialState.rows = newState.map((row) => {
      let hasSubmitted = attempts[row.id].length === 5
      let finalAttempt = attempts[row.id]

      row.letters.forEach((letter, index) => {
        const newValue = attempts[row.id].split('')[index] ?? ''
        letter.value = newValue
      })

      return {
        ...row,
        hasSubmitted,
        attempt: finalAttempt
      }
    });

    const activeRowId = attempts.findIndex(attempt => attempt === '');
    initialState.activeRowId = activeRowId;

    const isCorrect = attempts.includes(answerString);
    if (isCorrect) {
      initialState.isFinished = true;
      initialState.isCorrect = true;
    }

    const hasFinished = attempts.every(attempt => attempt.length >= 5);
    if (attempts.length === 6 && hasFinished) {
      initialState.isFinished = true;
    }
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex justify-center items-center flex-col gap-3'>
        <Rows
          answerArray={answerArray}
          answerString={answerString}
          initialState={initialState}
        />
      </div>
    </div>
  )
}
