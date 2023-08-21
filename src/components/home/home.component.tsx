import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { GAME_DEMO } from "../../common/games"

export function Home() {
	const navigate = useNavigate()

	useEffect(() => {
		navigate(`/game/${GAME_DEMO.id}`)
	}, [])

	return <></>
}
