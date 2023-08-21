import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { localData } from "../../data/localData"
import { useProfile } from "../../hooks/useProfile"
import { rediSync } from "../../redisync/redisync.client"

export function Reset() {
	const navigate = useNavigate()
	const profile = useProfile()

	let isResetting = false

	useEffect(() => {
		if (isResetting) { return }
		
		if (profile.loaded) {
			isResetting = true;

			(async() => {
				// await rediSync.delGuesses(profile.userId)
				await rediSync.delUserProfile(profile.userId)
				localData.reset()

				navigate("/")
			})()
		}
	}, [profile])

	return <></>
}
