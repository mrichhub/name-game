export type Winner = {
	guesses: number
	name: string
	successDate: Date
}

export type Leaderboard = {
	winners: Array<Winner>
}
