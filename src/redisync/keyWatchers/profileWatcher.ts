import { Profile } from "../../data/types/profile.type"
import { rediSync } from "../redisync.client"
import { RediSyncKeyWatcher } from "./redisyncKeyWatcher"

export class ProfileWatcher extends RediSyncKeyWatcher<Profile>
{
	constructor(
		private readonly userId: string,
	) {
		super(rediSync.userProfileKey(userId))
	}

	protected async retrieveKeyValue(): Promise<Profile> {
		return await rediSync.userProfile(this.userId)
	}
}
