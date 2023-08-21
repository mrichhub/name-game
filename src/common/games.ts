export type Game = {
	dailyGuesses?: number
	demo?: boolean
	id: string
	name: string
	title: string
}

export const GAME_DEMO: Game = {
	dailyGuesses: 8,
	demo: true,
	id: "demo",
	name: "caleb",
	title: "Demo",
}

export const GAMES: Record<string, Game> = {}

GAMES[GAME_DEMO.id] = GAME_DEMO
