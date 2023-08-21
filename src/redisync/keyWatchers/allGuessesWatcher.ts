import { Guess } from "../../data/types/guess.type"
import { GuessWithUser } from "../../data/types/guessWithUser.type"
import { Profile } from "../../data/types/profile.type"
import { rediSync } from "../redisync.client"
import { RediSyncKeyWatcher } from "./redisyncKeyWatcher"

export class AllGuessesWatcher extends RediSyncKeyWatcher<Array<GuessWithUser>>
{
	constructor(
		private readonly gameId: string,
	) {
		super(`game/${gameId}/guesses`)
	}

	protected async retrieveKeyValue(): Promise<Array<GuessWithUser>> {
		const allGuesses = await rediSync.allGuesses(this.gameId)
		const guesses: Record<string, Guess> = {}
		const users: Record<string, Profile> = {}

		allGuesses.forEach(g => users[g.userId] = {})

		await Promise.all([
			...Object.keys(users).map(userId => (async() => {
				users[userId] = await rediSync.userProfile(userId)
			})()),
			...allGuesses.map(g => (async() => {
				guesses[g.guessId] = await rediSync.guess(g.userId, this.gameId, g.guessId)
			})()),
		])

		return allGuesses.map(g => ({
			...guesses[g.guessId],
			user: {
				...users[g.userId],
				userId: g.userId,
			},
		}))
	}
}
