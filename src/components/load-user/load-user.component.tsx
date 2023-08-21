import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { GAME_DEMO } from "../../common/games"
import { localData } from "../../data/localData"

export function LoadUser() {
	const navigate = useNavigate()
	const { gameId, userId } = useParams()

	useEffect(() => {
		localData.userId = userId
		localData.userIdLoaded = true
		navigate(`/game/${gameId || GAME_DEMO.id}`)
	}, [])

	return <></>
}
