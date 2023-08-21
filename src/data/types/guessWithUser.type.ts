import { Guess } from "./guess.type"
import { Profile } from "./profile.type"

export type GuessWithUser = Guess & {
	user: Profile & {
		userId: string
	}
}
