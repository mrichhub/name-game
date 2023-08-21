import RediSync, { KeyWatcher, KeyWatcherOnChanged } from "@redsync/client-js"
import { EventEmitter } from "events"
import { v4 as uuidv4 } from "uuid"
import { GAME_RICHARDS_BABY_2 } from "../common/games"
import { Guess, Guesses } from "../data/types/guess.type"
import { GuessMeta } from "../data/types/guessMeta.type"
import { Leaderboard, Winner } from "../data/types/leaderboard.type"
import { Profile } from "../data/types/profile.type"
import { GuessesWatcher } from "./keyWatchers/guessesWatcher"
import { ProfileWatcher } from "./keyWatchers/profileWatcher"

export class RediSyncClient extends EventEmitter
{
	private readonly rediSync = new RediSync("A8oDQMq1Bqv0/+hZW9LwmFWZOnJtEn+an3a+OqIZ")
	// private readonly rediSync = new RediSync("seed-data-key1")

	constructor() {
		super()

		this.rediSync.on("connect", () => this.emit("connect"))
		this.rediSync.on("disconnected", () => this.emit("disconnected"))
	}

	async addGuess(userId: string, gameId: string, guess: Guess) {
		const guessId = uuidv4()
		await this.rediSync.hset(`${this.userGuessesKey(userId, gameId)}/${guessId}`, "date", guess.date.getTime(), "name", guess.name)
		await this.rediSync.lpush(this.userGuessesKey(userId, gameId), guessId)
		await this.rediSync.lpush(`game/${gameId}/guesses`, `${guessId}:::${userId}`)
	}

	async addWinnerToLeaderboard(gameId: string, winner: Winner): Promise<void> {
		const leaderboardWinnerId = uuidv4()
		await this.rediSync.hset(`game/${gameId}/leaderboard/${leaderboardWinnerId}`, "guesses", winner.guesses, "name", winner.name, "successDate", winner.successDate.getTime())
		await this.rediSync.rpush(`game/${gameId}/leaderboard`, leaderboardWinnerId)
	}

	async allGuesses(gameId: string): Promise<Array<GuessMeta>> {
		const allGuesses: Array<GuessMeta> = []
		
		const guesses = await this.rediSync.lrange(`game/${gameId}/guesses`, 0, -1)
		for (const guessMeta of guesses) {
			const guessParts = guessMeta.split(":::")
			const guessId = guessParts[0]
			const userId = guessParts[1]

			allGuesses.push({
				guessId,
				userId,
			})
		}

		return allGuesses
	}

	async connect(): Promise<boolean> {
		return await this.rediSync.connect()
	}

	async delAllKeys(): Promise<number> {
		const keys = await this.rediSync.keys("*")

		if (keys.length) {
			return await this.rediSync.del(...keys)
		}

		return 0
	}

	async delGuesses(userId: string, gameId: string): Promise<void> {
		const userGuessesKey = this.userGuessesKey(userId, gameId)

		const guessIds = await this.rediSync.lrange(userGuessesKey, 0, -1)

		await this.rediSync.del(userGuessesKey)
		
		await Promise.all(guessIds.map(id => this.rediSync.del(`${userGuessesKey}/${id}`)))
	}

	async delLeaderboard(gameId: string): Promise<void> {
		const leaderboardWinnerIds = await this.rediSync.lrange(`game/${gameId}/leaderboard`, 0, -1)

		await this.rediSync.del(`game/${gameId}/leaderboard`)

		await Promise.all(leaderboardWinnerIds.map(id => this.rediSync.del(`game/${gameId}/leaderboard/${id}`)))
	}

	async delUserProfile(userId: string): Promise<void> {
		await this.rediSync.del(this.userProfileKey(userId))
	}

	async guess(userId: string, gameId: string, guessId: string): Promise<Guess> {
		const guess = await this.rediSync.hgetall(`${this.userGuessesKey(userId, gameId)}/${guessId}`)

		return {
			date: new Date(parseInt(guess["date"])),
			name: guess["name"],
		}
	}

	async guesses(userId: string, gameId: string): Promise<Guesses> {
		const guessIds = await this.rediSync.lrange(this.userGuessesKey(userId, gameId), 0, -1)
		const guesses: Guesses = await Promise.all(
			guessIds.map(id => this.guess(userId, gameId, id)),
		)

		return guesses
	}

	guessesWatcher(userId: string, gameId: string): GuessesWatcher {
		return new GuessesWatcher(userId, gameId)
	}

	async keys(): Promise<string[]> {
		return await this.rediSync.keys("*")
	}

	async leaderboard(gameId: string): Promise<Leaderboard> {
		const leaderboardWinnerIds = await this.rediSync.lrange(`game/${gameId}/leaderboard`, 0, -1)
		const winners: Array<Winner> = await Promise.all(
			leaderboardWinnerIds.map(id => (async() => {
				const winner = await this.rediSync.hgetall(`game/${gameId}/leaderboard/${id}`)
				return {
					guesses: parseInt(winner["guesses"]),
					name: winner["name"],
					successDate: new Date(parseInt(winner["successDate"])),
				}
			})())
		)

		return {
			winners,
		}
	}

	async migrate(): Promise<void> {
		const game = GAME_RICHARDS_BABY_2

		const allGuesses: Array<GuessMeta> = []
		const guesses = await this.rediSync.lrange("guesses", 0, -1)
		const leaderboardWinnerIds = await this.rediSync.lrange("leaderboard", 0, -1)
		const users: Record<string, string> = {}
		for (const guessMeta of guesses) {
			const guessParts = guessMeta.split(":::")
			const guessId = guessParts[0]
			const userId = guessParts[1]

			users[userId] = userId

			allGuesses.push({
				guessId,
				userId,
			})
		}
		const userIds = Object.keys(users)

		for (const guess of allGuesses) {
			await this.rediSync.copy(`user/${guess.userId}/guesses/${guess.guessId}`, `user/${guess.userId}/game/${game.id}/guesses/${guess.guessId}`, true)
		}

		for (const userId of userIds) {
			await this.rediSync.copy(`user/${userId}/guesses`, `user/${userId}/game/${game.id}/guesses`, true)
		}

		for (const winnerId of leaderboardWinnerIds) {
			await this.rediSync.copy(`leaderboard/${winnerId}`, `game/${game.id}/leaderboard/${winnerId}`)
		}

		await this.rediSync.copy("leaderboard", `game/${game.id}/leaderboard`, true)
		await this.rediSync.copy("guesses", `game/${game.id}/guesses`, true)
	}

	async setUserProfile(userId: string, profile: Partial<Profile>): Promise<void> {
		const profileParts = profile as Record<string, string|number>
		const profileKeys = Object.keys(profileParts)
		const profileSetKeys = profileKeys.filter(k => profileParts[k] !== undefined && profileParts[k] !== null)
		const profileDelKeys = profileKeys.filter(k => profileParts[k] === undefined || profileParts[k] === null)

		if (profileSetKeys.length) {
			const hsetParts: Array<string|number> = []

			for (const k of profileSetKeys) {
				hsetParts.push(k)
				hsetParts.push(profileParts[k])
			}

			await this.rediSync.hset(this.userProfileKey(userId), ...hsetParts)
		}

		if (profileDelKeys.length) {
			await this.rediSync.hdel(this.userProfileKey(userId), ...profileDelKeys)
		}
	}

	userGuessesKey(userId: string, gameId: string): string {
		return `user/${userId}/game/${gameId}/guesses`
	}

	async userProfile(userId: string): Promise<Profile> {
		return await this.rediSync.hgetall(this.userProfileKey(userId))
	}

	userProfileKey(userId: string): string {
		return `user/${userId}/profile`
	}

	userProfileWatcher(userId: string): ProfileWatcher {
		return new ProfileWatcher(userId)
	}

	async watch(key: string, onChanged: KeyWatcherOnChanged): Promise<KeyWatcher> {
		return await this.rediSync.watch(key, onChanged)
	}
}

export const rediSync = new RediSyncClient()
