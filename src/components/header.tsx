import clsx from 'clsx'
import { Github } from 'lucide-react'
import { Baloo_2 } from 'next/font/google'
import Link from 'next/link'

const baloo2 = Baloo_2({ subsets: ['latin'] })

export function Header() {
  return (
    <header className={clsx(baloo2.className, 'text-4xl font-semibold flex justify-center mt-16 mb-14')}>
      <div className='flex items-center gap-4'>
        <h1>
          DESVENDE
        </h1>
        <Link
          href={'https://github.com/pedrop07/desvende'}
          target='_blank'
          className='rounded-full p-2 hover:text-violet-600'
        >
          <Github />
        </Link>
      </div>
    </header>
  )
}