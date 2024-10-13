import { Header } from '@/components/header';
import { Rows } from '@/components/rows';
import { possibleAnswers } from '../../../constants/possible-answers';

export default async function Home() {
  const answer = possibleAnswers[Math.floor(Math.random() * 914)].toUpperCase()

  const answerString = answer
  const answerArray = answer?.split('');

  return (
    <div>
      <Header />
      <Rows answerArray={answerArray} answerString={answerString} />
    </div>
  )
}
