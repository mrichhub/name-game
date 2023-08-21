import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { rediSync } from "../../redisync/redisync.client"

export function ResetLeaderboard() {
	const navigate = useNavigate()
	const gameId = ""

	useEffect(() => {
		(async() => {
			await rediSync.delLeaderboard(gameId)
			navigate("/")
		})()
	}, [])

	return <></>
}
