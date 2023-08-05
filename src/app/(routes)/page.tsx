import { getAnswer } from '@/actions/get-answer';
import { Rows } from '@/components/rows';

export default async function Home() {
  const { answer } = await getAnswer();

  const answerString = answer;
  const answerArray = answer?.split('');

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex justify-center items-center flex-col gap-3'>
        <Rows
          answerArray={answerArray}
          answerString={answerString}
        />
      </div>
    </div>
  )
}
