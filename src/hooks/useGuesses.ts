import { useEffect, useState } from "react"
import { calculateGuessScore, GuessScore } from "../common/calculateGuessScore"
import { GAMES } from "../common/games"
import { Guess, Guesses } from "../data/types/guess.type"
import { GuessesWatcher } from "../redisync/keyWatchers/guessesWatcher"
import { rediSync } from "../redisync/redisync.client"
import { useProfile } from "./useProfile"

export type GuessResult = Guess & GuessScore

const guessesWatcher: Record<string, GuessesWatcher> = {}

export function useGuesses(gameId: string): [Array<GuessResult>, (name: string) => void, boolean] {
	const game = GAMES[gameId]
	const profile = useProfile()
	const [userId, setUserId] = useState(profile.userId)

	guessesWatcher[gameId] ??= rediSync.guessesWatcher(userId, gameId)

	const compileGuessResult = (guess: Guess): GuessResult => {
		return {
			...guess,
			...calculateGuessScore(guess, gameId),
		}
	}

	const [guesses, setGuesses] = useState<Array<GuessResult>>(guessesWatcher[gameId].lastValue?.map(g => compileGuessResult(g)) ?? [])
	const [guessesLoaded, setGuessesLoaded] = useState(false)

	const addGuess = (name: string): void => {
		const guess: Guess = {
			date: new Date(),
			name,
		}
		const guessResult = compileGuessResult(guess);

		(async() => {
			await rediSync.addGuess(userId, gameId, guess)

			if (guess.name === game.name) {
				await rediSync.addWinnerToLeaderboard(gameId, {
					guesses: guesses.length + 1,
					name: profile.name!,
					successDate: new Date(),
				})
			}
		})()

		setGuesses(prevGuesses => [guessResult, ...prevGuesses])
	}
	
	useEffect(() => {
		const guessesChanged = (guesses: Guesses) => {
			const guessResults = guesses.map(g => compileGuessResult(g))
			setGuesses(guessResults)
			setGuessesLoaded(true)
		}

		guessesWatcher[gameId].watch(guessesChanged)

		return () => {
			guessesWatcher[gameId].stopWatching(guessesChanged)
		}
	}, [])

	useEffect(() => {
		setUserId(prevUserId => {
			if (profile.userId !== prevUserId) {
				guessesWatcher[gameId].stopAll()
				guessesWatcher[gameId] = rediSync.guessesWatcher(profile.userId, gameId)
			}

			return profile.userId
		})
	}, [profile])

	return [guesses, addGuess, guessesLoaded]
}
