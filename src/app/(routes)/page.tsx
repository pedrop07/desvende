import { getAnswer } from '@/actions/get-answer';
import { Rows } from '@/components/rows';
import axios from 'axios';
import { cookies } from 'next/headers'

interface CronResponse {
  answer: string
}

export default async function Home() {
  const { data } = await axios.get<CronResponse>('https://desvende.vercel.app/api/cron')


  // const answerString = 'PEDRO'
  // const answerArray = 'PEDRO'.split('')
  const answerString = data?.answer
  const answerArray = data?.answer.split('')

  // const cookieStore = cookies()
  // const theme = cookieStore.get('attempts')
  // console.log(theme)
  
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex justify-center items-center flex-col gap-3'>
        <Rows answerArray={answerArray} answerString={answerString} />
      </div>
    </div>
  )
}
