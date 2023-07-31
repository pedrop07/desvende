'use client'
import { Modal } from '@/components/modal';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react'
import { tv } from 'tailwind-variants';

interface Letters {
  id: number;
  value: string;
  active: boolean;
}

interface Rows {
  id: number
  letters: Letters[]
}

const LETTERS: Letters[] = [
  {
    id: 0,
    value: '',
    active: true
  },
  {
    id: 1,
    value: '',
    active: false
  },
  {
    id: 2,
    value: '',
    active: false
  },
  {
    id: 3,
    value: '',
    active: false
  },
  {
    id: 4,
    value: '',
    active: false
  },
]

const ROWS: Rows[] = [
  {
    id: 0,
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
  {
    id: 1,
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
  {
    id: 2,
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
  {
    id: 3,
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
  {
    id: 4,
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
  {
    id: 5,
    letters: JSON.parse(JSON.stringify(LETTERS))
  },
]

const letterStyle = tv({
  base: 'w-[77px] h-[77px] text-4xl p-3 font-bold text-white flex justify-center items-center rounded-md',
  variants: {
    active: {
      true: 'cursor-pointer data-[active=true]:border-violet-400 data-[active=true]:border-b-8 border-2 border-violet-600',
      false: 'bg-indigo-900'
    },
    color: {
      success: 'bg-emerald-500',
      wrong: 'bg-rose-500',
      near: 'bg-yellow-400'
    }
  }
})

const modalTitleStyle = tv({
  base: ''
})

const awnser = ['V', 'A', 'S', 'C', 'O']

export default function Home() {
  const [rows, setRows] = useState(ROWS)
  const [activeRowId, setActiveRowId] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleActiveLetter = (letterId: number) => {
    if (letterId < 0 || letterId === rows[activeRowId].letters.length) return

    const newState = [...rows]
    newState[activeRowId].letters.forEach((letter) => {
      letter.active = false
      if (letter.id === letterId) letter.active = true
    })

    setRows(newState)
  }

  const handleChangeLetterValue = (letterId: number, value: string) => {
    const newState = [...rows]

    if (value === '' && newState[activeRowId].letters[letterId].value === '' && letterId !== 0) {
      newState[activeRowId].letters[letterId - 1].value = value
      handleActiveLetter(letterId - 1)
    } else {
      newState[activeRowId].letters[letterId].value = value
    }

    setRows(newState)
  }

  const handleClickLetter = (letterId: number, rowId: number) => {
    if (rowId !== activeRowId) return

    handleActiveLetter(letterId)
  }

  const handleSubmit = () => {
    let attempt = rows[activeRowId].letters.map(({ value }) => value).join('')

    if (attempt.length < 5) {
      console.log('Deve ter 5 LETRAS')
      return
    }

    if (attempt === awnser.join('')) {
      setIsFinished(true)
      setIsCorrect(true)
      setIsModalOpen(true)
    }

    const attempts = rows.map((row) => {
      return row.letters.map(({ value }) => value).join('')
    })
    localStorage.setItem('@desvende:attempts', JSON.stringify(attempts))

    const hasFinished = attempts.every(attempt => attempt.length >= 5)
    if (attempts.length === 6 && hasFinished) {
      setIsFinished(true)
      setIsModalOpen(true)
    }

    setActiveRowId((prevState) => prevState + 1)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleKeyDownEvent = useCallback((event: KeyboardEvent) => {
    if (activeRowId === rows.length) return

    const activeLetterIndex = rows[activeRowId].letters.findIndex(({ active }) => active === true)
    if (event.code === 'ArrowRight') handleActiveLetter(activeLetterIndex + 1)

    if (event.code === 'ArrowLeft') handleActiveLetter(activeLetterIndex - 1)

    if (event.code.includes('Key')) {
      handleChangeLetterValue(activeLetterIndex, event.key.toUpperCase())
      handleActiveLetter(activeLetterIndex + 1)
    }

    if (event.code === 'Backspace') handleChangeLetterValue(activeLetterIndex, '')

    if (event.code === 'Enter') handleSubmit()
  }, [activeRowId])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDownEvent)

    if (isFinished) document.removeEventListener('keydown', handleKeyDownEvent)
    return () => document.removeEventListener('keydown', handleKeyDownEvent)
  }, [handleKeyDownEvent, isFinished])

  useEffect(() => {
    const attempts: string[] = JSON.parse(localStorage.getItem('@desvende:attempts') as string)

    if (attempts) {
      const updatedRows = ROWS.map((row) => {
        row.letters.forEach((letter, index) => {
          const newValue = attempts[row.id].split('')[index] ?? ''
          letter.value = newValue
        })

        return row
      })
      setRows(updatedRows)

      const activeRowId = attempts.findIndex(attempt => attempt === '')
      setActiveRowId(activeRowId)

      const isCorrect = attempts.includes(awnser.join(''))
      if (isCorrect) {
        setIsFinished(true)
        setIsCorrect(true)
        setIsModalOpen(true)
      }

      const hasFinished = attempts.every(attempt => attempt.length >= 5)
      if (attempts.length === 6 && hasFinished) {
        setIsFinished(true)
        setIsModalOpen(true)
      }
    }

    axios.get('/api').then(res => console.log(res))
  }, [])

  return (
    <div className='flex justify-center items-center h-screen'>
      {false && (
        <Modal open onClose={handleCloseModal}>
          <div className='text-black flex justify-center w-full'>
              {isCorrect ? <h2>Voce acertou</h2> : <h2 className='bg-indigo-500 text-white text-2xl rounded-md px-4 py-2'>palavra certa: {awnser}</h2>}
          </div>
        </Modal>
      )}
      <div className='flex justify-center items-center flex-col gap-3'>
        {rows.map((row) => {
          return (
            <div
              key={row.id}
              className='flex justify-center items-center gap-3'
              data-active={row.id === activeRowId}
            >
              {row.letters.map((letter, index) => {
                const attempt = row.letters.map(({ value }) => value).join('')
                const hasSubmitted = attempt.length === 5 && row.id !== activeRowId || isFinished

                let positionStyle: "success" | "wrong" | "near" | undefined

                if (hasSubmitted && letter.value !== '') {
                  positionStyle = 'wrong'
                  if (awnser.join('').includes(letter.value)) positionStyle = 'near'
                  if (letter.value === awnser[index]) positionStyle = 'success'
                }

                const isActive = row.id === activeRowId && !isFinished

                return (
                  <div
                    key={letter.id}
                    className={letterStyle({ active: isActive, color: positionStyle })}
                    data-active={letter.active}
                    onClick={() => handleClickLetter(letter.id, row.id)}
                  >
                    {letter.value}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div >
  )
}
