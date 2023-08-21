import { Guess } from "../data/types/guess.type"
import { GAMES } from "./games"

export type GuessScore = {
	lettersCorrect: number
	lettersCorrectButInWrongSpace: number
}

export function calculateGuessScore(guess: Guess, gameId: string): GuessScore {
	const game = GAMES[gameId]
	const guessScore: GuessScore = {
		lettersCorrect: 0,
		lettersCorrectButInWrongSpace: 0,
	}

	const nameTracker: Record<number, boolean> = {}

	for (let i = 0; i < guess.name.length && i < game.name.length; i++) {
		if (guess.name[i] === game.name[i]) {
			guessScore.lettersCorrect++
			nameTracker[i] = true
		}
	}

	for (let i = 0; i < guess.name.length; i++) {
		for (let j = 0; j < game.name.length; j++) {
			if (nameTracker[j] || j === i) {
				continue
			}

			if (guess.name[i] === game.name[j]) {
				guessScore.lettersCorrectButInWrongSpace++
				nameTracker[j] = true
				break
			}
		}
	}

	return guessScore
}
