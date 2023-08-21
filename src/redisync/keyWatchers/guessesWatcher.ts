import { Guesses } from "../../data/types/guess.type"
import { rediSync } from "../redisync.client"
import { RediSyncKeyWatcher } from "./redisyncKeyWatcher"

export class GuessesWatcher extends RediSyncKeyWatcher<Guesses>
{
	constructor(
		private readonly userId: string,
		private readonly gameId: string,
	) {
		super(rediSync.userGuessesKey(userId, gameId))
	}

	protected async retrieveKeyValue(): Promise<Guesses> {
		return await rediSync.guesses(this.userId, this.gameId)
	}
}
