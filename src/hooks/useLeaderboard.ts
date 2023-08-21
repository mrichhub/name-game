import { useEffect, useState } from "react"
import { Leaderboard } from "../data/types/leaderboard.type"
import { LeaderboardWatcher } from "../redisync/keyWatchers/leaderboardWatcher"

const leaderboardWatcher: Record<string, LeaderboardWatcher> = {}

export function useLeaderboard(gameId: string) {
	leaderboardWatcher[gameId] ??= new LeaderboardWatcher(gameId)

	const [leaderboard, setLeaderboard] = useState<Leaderboard>(leaderboardWatcher[gameId].lastValue ?? {
		winners: [],
	})

	useEffect(() => {
		const leaderboardChanged = (leaderboard: Leaderboard) => {
			setLeaderboard(leaderboard)
		}

		leaderboardWatcher[gameId].watch(leaderboardChanged)

		return () => {
			leaderboardWatcher[gameId].stopWatching(leaderboardChanged)
		}
	}, [])

	return leaderboard
}
