import { Rows } from '@/components/rows';
import axios from 'axios';

interface CronResponse {
  answer: string
}

export default async function Home() {
  const { data } = await axios.get<CronResponse>('http://localhost:3000/api/cron')

  // const answerString = 'PEDRO'
  // const answerArray = 'PEDRO'.split('')
  const answerString = data?.answer
  const answerArray = data?.answer.split('')
  
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex justify-center items-center flex-col gap-3'>
        <Rows answerArray={answerArray} answerString={answerString} />
      </div>
    </div>
  )
}
