import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { localData } from "../data/localData"
import { Profile } from "../data/types/profile.type"
import { ProfileWatcher } from "../redisync/keyWatchers/profileWatcher"

type ProfileWithMeta = Profile & {
	loaded: boolean
	userId: string
}

let profileWatcher: ProfileWatcher

export function useProfile() {
	const userId = localData.userId ??= uuidv4()
	profileWatcher ??= new ProfileWatcher(userId)

	const [profile, setProfile] = useState<ProfileWithMeta>({
		...profileWatcher.lastValue,
		loaded: profileWatcher.lastValue !== undefined,
		userId,
	})

	useEffect(() => {
		const profileChanged = (profile: Profile) => {
			const profileWithMeta: ProfileWithMeta = {
				...profile,
				loaded: true,
				userId,
			}

			setProfile(profileWithMeta)
		}

		profileWatcher.watch(profileChanged)

		return () => {
			profileWatcher.stopWatching(profileChanged)
		}
	}, [])

	return profile
}
