import { Leaderboard } from "../../data/types/leaderboard.type"
import { rediSync } from "../redisync.client"
import { RediSyncKeyWatcher } from "./redisyncKeyWatcher"

export class LeaderboardWatcher extends RediSyncKeyWatcher<Leaderboard>
{
	constructor(
		private readonly gameId: string,
	) {
		super(`game/${gameId}/leaderboard`)
	}

	protected async retrieveKeyValue(): Promise<Leaderboard> {
		return await rediSync.leaderboard(this.gameId)
	}
}
