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

export const GAME_RICHARDS_BABY_2: Game = {
	id: "richards-baby-2",
	name: "milo",
	title: "First Name",
}

export const GAME_RICHARDS_BABY_2_MIDDLENAME: Game = {
	id: "richards-baby-2-middlename",
	name: "charles",
	title: "Middle Name",
}

export const GAMES: Record<string, Game> = {}

GAMES[GAME_DEMO.id] = GAME_DEMO
GAMES[GAME_RICHARDS_BABY_2.id] = GAME_RICHARDS_BABY_2
GAMES[GAME_RICHARDS_BABY_2_MIDDLENAME.id] = GAME_RICHARDS_BABY_2_MIDDLENAME
