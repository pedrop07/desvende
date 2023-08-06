'use client'

import { useCallback, useEffect, useState } from 'react'
import { removeAccents } from '@/utils/removeAccents';
import { tv } from "tailwind-variants";
import toast from 'react-hot-toast';
import Countdown from 'react-countdown';
import { ROWS } from '@/constants/rows';
import { RowsData } from '@/types/rows';
import { extensiveDictionary } from '../../extensive-dictionary';

interface LocalStorageData {
  attempts: string[];
  expires: number;
}

interface RowProps {
  answerArray: string[];
  answerString: string;
}

const letterStyle = tv({
  base: 'w-[77px] h-[77px] text-4xl p-3 font-bold text-white flex justify-center items-center rounded-md',
  variants: {
    active: {
      true: 'cursor-pointer data-[active=true]:border-violet-400 data-[active=true]:border-b-8 border-2 border-violet-600',
      false: 'bg-indigo-900'
    },
    color: {
      correct: 'bg-emerald-500',
      wrong: 'bg-rose-500',
      near: 'bg-yellow-400'
    }
  }
})

export function Rows({ answerArray, answerString }: RowProps) {
  const [rows, setRows] = useState(ROWS)
  const [activeRowId, setActiveRowId] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

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
    if (isFinished) return
    handleActiveLetter(letterId)
  }

  const handleSubmit = () => {
    let attempt = rows[activeRowId].letters.map(({ value }) => value).join('')

    if (attempt.length < 5) {
      toast('a palavra deve ter 5 letras', {
        style: {
          padding: '8px 12px',
          color: '#fff',
          fontWeight: '600',
          fontSize: '18px',
          backgroundColor: '#7C3AED'
        }
      });
      return;
    }

    const wordExists = extensiveDictionary.find((word) => removeAccents(word) === attempt.toLowerCase())

    if (!wordExists) {
      toast('essa palavra não é aceita', {
        style: {
          padding: '8px 12px',
          color: '#fff',
          fontWeight: '600',
          fontSize: '18px',
          backgroundColor: '#7C3AED'
        }
      });
      return;
    }

    const newState = [...rows]
    newState[activeRowId].attempt = attempt
    newState[activeRowId].hasSubmitted = true
    setRows(newState)

    const attempts = rows.map((row) => {
      return row.letters.map(({ value }) => value).join('')
    })

    const localStorageData = {
      attempts: attempts,
      expires: new Date().setHours(24, 0, 0, 0)
    }

    localStorage.setItem('@desvende:attempts', JSON.stringify(localStorageData))

    if (attempt === removeAccents(answerString)) {
      setIsFinished(true)
      setIsCorrect(true)
      setActiveRowId(7)
      return
    }

    const hasFinished = attempts.every(attempt => attempt.length >= 5);
    if (hasFinished) setIsFinished(true);

    setActiveRowId((prevState) => prevState + 1)
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
    const localStorageAttempts = localStorage.getItem('@desvende:attempts')

    if (localStorageAttempts) {
      const { attempts, expires } = JSON.parse(localStorageAttempts) as LocalStorageData;

      if (Date.now() >= expires) {
        localStorage.removeItem('@desvende:attempts')
      } else {
        const newState: RowsData[] = JSON.parse(JSON.stringify(ROWS));

        const updatedRows = newState.map((row) => {
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
        setRows(updatedRows)

        const activeRowId = attempts.findIndex(attempt => attempt === '');
        setActiveRowId(activeRowId);

        const isCorrect = attempts.includes(answerString);
        if (isCorrect) {
          setIsFinished(true);
          setIsCorrect(true);
        }

        const hasFinished = attempts.every(attempt => attempt.length >= 5);
        if (attempts.length === 6 && hasFinished) {
          setIsFinished(true);
        }
      }
    }
  }, [])

  return (
    <>
      {isFinished && (
        <div>
          {
            isCorrect ?
              (
                <h2 className='text-2xl mb-4'>
                  Parabéns, você acertou a palavra do dia!
                </h2>
              )
              :
              (
                <div className='flex flex-col items-center mb-4'>
                  <h2 className='text-2xl mb-2'>
                    Você errou a palavra do dia :(
                  </h2>
                  <h3 className='text-xl'>Resposta: {answerString}</h3>
                </div>
              )
          }
          <div className='flex flex-col items-center'>
            <span className='text-xl text-slate-300'>
              próxima palavra em:
            </span>
            <Countdown
              date={new Date().setHours(24, 0, 0, 0)}
              className='text-3xl font-semibold'
            />
          </div>
        </div>
      )}
      {rows.map((row) => {
        return (
          <div
            key={row.id}
            className='flex justify-center items-center gap-3'
            data-active={row.id === activeRowId}
          >
            {row.letters.map((letter, index) => {
              let position: "correct" | "wrong" | "near" | undefined

              let value = letter.value

              if (row.hasSubmitted && letter.value !== '') {
                position = 'wrong'
                const attempt = extensiveDictionary.find((word) =>
                  removeAccents(word) === row.attempt.toLowerCase()
                ) as string

                const attemptArray = attempt.toUpperCase().split('')

                if (removeAccents(answerString).includes(letter.value)) {
                  position = 'near'
                }

                if (letter.value === removeAccents(answerArray[index])) {
                  position = 'correct'
                }

                value = attemptArray[index]
              }

              const isActive = row.id === activeRowId

              return (
                <div
                  key={letter.id}
                  className={letterStyle({ active: isActive, color: position })}
                  data-active={letter.active}
                  onClick={() => handleClickLetter(letter.id, row.id)}
                >
                  {value}
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
