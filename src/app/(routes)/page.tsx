import { getAnswer } from '@/actions/get-answer';
import { Header } from '@/components/header';
import { Rows } from '@/components/rows';

export default async function Home() {
  const { answer } = await getAnswer();

  const answerString = answer;
  const answerArray = answer?.split('');

  return (
    <div>
      <Header />

      <Rows
        answerArray={answerArray}
        answerString={answerString}
      />
    </div>
  )
}
