import classNames from "classnames"
import { useParams } from "react-router-dom"
import { calculateGuessScore, GuessScore } from "../../common/calculateGuessScore"
import { GAMES } from "../../common/games"
import { Guess } from "../../data/types/guess.type"
import { Profile } from "../../data/types/profile.type"
import { useAllGuesses } from "../../hooks/useAllGuesses"
import { GuessLetter } from "../modals/guess-letter/guess-letter.component"
import "./dashboard.component.scss"

type GuessWithUserAndScore = Guess & GuessScore & {
	user: Profile
}

export function Dashboard() {
	const { gameId } = useParams()
	const allGuesses = useAllGuesses(gameId!)
	const game = GAMES[gameId!]

	const allGuessesWithScores: Array<GuessWithUserAndScore> = allGuesses.map(g => ({
		...g,
		...calculateGuessScore(g, gameId!),
	}))

	const guessRowClassName = (guessIdx: number): string => {
		const guess = allGuessesWithScores[guessIdx]

		return classNames(
			"guess-row",
			{
				"correct": guess.name === game.name,
			},
		)
	}

	const guessRowNumber = (guessIdx: number): number => {
		return allGuessesWithScores.length - guessIdx
	}

	const guessStatsRowClassName = (guessIdx: number): string => {
		const guess = allGuessesWithScores[guessIdx]
		return classNames(
			"guess-stats",
			{
				"correct": guess.name === game.name,
			},
		)
	}

	return <>
		<div className="dashboard">
			<h1>Dashboard</h1>
			<h3 className="game-title">{game.title}</h3>

			{allGuessesWithScores.map((guess, guessIdx) => (
				<div key={`guess-row-${guessRowNumber(guessIdx)}`}>
					<div className={guessRowClassName(guessIdx)}>
						{guess.name.split("").map((letter, letterIdx) => (
							<GuessLetter key={`guess-row-${guessRowNumber(guessIdx)}-guess-letter-${letterIdx}`} letter={letter} letterIndex={letterIdx} />
						))}
					</div>
					<div
						className={guessStatsRowClassName(guessIdx)}
						style={{
							animationDelay: `${guess.name.length * 100 + 200}ms`,
						}}
					>
						{Array.from({ length: guess.lettersCorrect}, (_, index) => index).map(index => (
							<div
								className="stat correct"
								key={`correct-stat-${index}`}
							>
								🟢
							</div>
						))}
						{Array.from({ length: guess.lettersCorrectButInWrongSpace}, (_, index) => index).map(index => (
							<div
								className="stat correct-but-in-wrong-space"
								key={`correct-in-wrong-space-stat-${index}`}
							>
								🟡
							</div>
						))}
						{guess.lettersCorrect === 0 && guess.lettersCorrectButInWrongSpace === 0 && (
							<div
								className="stat completely-wrong"
							>
								❌
							</div>
						)}
						<div className="user-name">
							{guess.user.name}
						</div>
						<div className="guess-date">
							{guess.date.toLocaleString()}
						</div>
					</div>
				</div>
			))}
		</div>
	</>
}
