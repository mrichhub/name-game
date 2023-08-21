import { useEffect, useState } from "react"
import { GuessWithUser } from "../data/types/guessWithUser.type"
import { AllGuessesWatcher } from "../redisync/keyWatchers/allGuessesWatcher"

const allGuessesWatcher: Record<string, AllGuessesWatcher> = {}

export function useAllGuesses(gameId: string) {
	allGuessesWatcher[gameId] ??= new AllGuessesWatcher(gameId)

	const [allGuesses, setAllGuesses] = useState<Array<GuessWithUser>>(allGuessesWatcher[gameId].lastValue ?? [])

	useEffect(() => {
		const allGuessesChanged = (allGuesses: Array<GuessWithUser>) => {
			setAllGuesses(allGuesses)
		}

		allGuessesWatcher[gameId].watch(allGuessesChanged)

		return () => {
			allGuessesWatcher[gameId].stopWatching(allGuessesChanged)
		}
	}, [])

	return allGuesses
}