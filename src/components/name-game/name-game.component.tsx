import classnames from "classnames"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { DEFAULT_DAILY_GUESSES } from "../../common/constants"
import { GAMES } from "../../common/games"
import { localData } from "../../data/localData"
import { useGuesses } from "../../hooks/useGuesses"
import { useProfile } from "../../hooks/useProfile"
import { LeaderboardButton } from "../buttons/leaderboard-button/leaderboard-button.component"
import { RulesButton } from "../buttons/rules-button/rules-button.component"
import { GuessLetter } from "../modals/guess-letter/guess-letter.component"
import { NameEntryModal } from "../modals/name-entry-modal/name-entry-modal.component"
import { AskForLinkModal } from "./ask-for-link-modal/ask-for-link-modal.component"
import { GotItModal } from "./got-it-modal/got-it-modal.component"
import { LeaderboardModal } from "./leaderboard-modal/leaderboard-modal.component"
import "./name-game.component.scss"
import { RulesModal } from "./rules-modal/rules-modal.component"

export function NameGame() {
	const [askForLinkModalOpen, setAskForLinkModalOpen] = useState(false)
	const [currentGuess, setCurrentGuess] = useState("")
	const { gameId } = useParams()
	const game = GAMES[gameId!]
	const dailyGuesses = game?.dailyGuesses ?? DEFAULT_DAILY_GUESSES
	const [gotItModalOpen, setGotItModalOpen] = useState(false)
	const [guessFocus, setGuessFocus] = useState<number|undefined>(undefined)
	const guessInputRef = useRef<HTMLInputElement>()
	const [guesses, addGuess, guessesLoaded] = useGuesses(gameId!)
	const guessesToday = guesses.filter(g => g.date.toLocaleDateString() === new Date().toLocaleDateString())
	const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false)
	const maxLetters = 8
	const minLetters = 3
	const [nameModalOpen, setNameModalOpen] = useState(false)
	const profile = useProfile()
	const [rulesModalOpen, setRulesModalOpen] = useState(false)

	const currentGuessKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault()

		const acceptableChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

		if (e.key?.length === 1 && acceptableChars.indexOf(e.key) >= 0) {
			setCurrentGuess(prevGuess => prevGuess + e.key.toLowerCase())
		}
		else if (e.key?.toLowerCase() === "backspace") {
			setCurrentGuess(prevGuess => prevGuess.substring(0, prevGuess.length - 1))
		}
		else if (e.key?.toLowerCase() === "enter") {
			submitCurrentGuess()
		}
	}

	const focusOnGuessInput = () => {
		guessInputRef.current?.focus()
	}

	const guessRowClassName = (row: number): string => {
		const guess = row < 0 ? currentGuess : guesses[row].name

		return classnames(
			"guess-row",
			{
				"correct": row >= 0 && guess === game.name,
				"current-guess": row < 0,
				"empty-guess": row < 0 && guess.length === 0,
				"has-focus": guessFocus === row,
				"previous-guess": row >= 0,
			},
		)
	}

	const guessRowKey = (guessIdx: number): string => {
		return `guess-row-${guesses.length - guessIdx}`
	}

	const guessStatsRowClassName = (row: number): string => {
		const guess = row < 0 ? currentGuess : guesses[row].name

		return classnames(
			"guess-stats",
			{
				"correct": guess === game.name,
			},
		)
	}

	const submitCurrentGuess = () => {
		if (currentGuess.length < minLetters || currentGuess.length > maxLetters) {
			return
		}

		if (guessesToday.length >= dailyGuesses) {
			return
		}

		addGuess(currentGuess)		
		setCurrentGuess("")
	}

	useEffect(() => {
		if (askForLinkModalOpen || !profile.loaded || rulesModalOpen || !game) { return }

		setTimeout(() => {
			if (!localData.userIdLoaded && !game.demo) {
				setAskForLinkModalOpen(true)
			}
			else if (!localData.didViewRules) {
				setRulesModalOpen(true)
				localData.didViewRules = true
			}
		}, 300)	
	}, [askForLinkModalOpen, profile, rulesModalOpen, game])

	useEffect(() => {
		if (
			(!localData.userIdLoaded && !game.demo)
			|| !localData.didViewRules
			|| rulesModalOpen
			|| nameModalOpen
			|| !profile.loaded
			|| profile.name
		) { return }

		setTimeout(() => {
			if (!profile.name) {
				setNameModalOpen(true)
			}
		}, 500)
	}, [nameModalOpen, profile, rulesModalOpen])

	useEffect(() => {
		if (guesses.length > 0 && guesses[0].name === game.name) {
			setTimeout(() => {
				setGotItModalOpen(true)
			}, game.name.length * 100 + 1100)
		}
	}, [guesses])

	const gotTheName = guesses.length > 0 && guesses[0].name === game.name

	const inputBoxClassName = classnames(
		"guess-letter",
		{
			"blink": guessFocus === -1,
			"tap-here-to-guess": guessFocus !== -1 && currentGuess.length === 0,
		},
	)

	return (
		<>
			<div className="name-game">

				<h1 className="title">Name Game</h1>
				
				<div className="game-title">
					{game.title}
				</div>

				<div className="profile-name">
					{profile.name}
				</div>
				
				<RulesButton onClick={() => setRulesModalOpen(true)} />
				<LeaderboardButton gameId={gameId!} onClick={() => setLeaderboardModalOpen(true)} />

				{guessesLoaded && !gotTheName && (
					<div className="todays-guesses">
						Today's guesses: <div className="guess-count">{Math.min(guessesToday.length, dailyGuesses)} / {dailyGuesses}</div>
					</div>
				)}

				{!gotTheName && guessesToday.length >= dailyGuesses && (
					<div className="daily-max-reached">
						You've reached the daily guess limit.<br />
						Play again tomorrow!
					</div>
				)}
				
				{guessesLoaded && profile.name && !gotTheName && guessesToday.length < dailyGuesses && (
					<>
						<h3 className="type-your-guess">Type your guess</h3>
	
						<div className={guessRowClassName(-1)}>
							
							{currentGuess.split("").map((letter, idx) => (
								<GuessLetter key={`guess-letter-${idx}`} letter={letter} onClick={() => focusOnGuessInput()} />
							))}
							
							<div className="guess-letter-container cursor-container">
								<div className={inputBoxClassName} onClick={() => focusOnGuessInput()}>
									<input
										autoFocus={true}
										className="guess-input"
										onBlur={() => setGuessFocus(undefined)}
										onChange={() => {}}
										onFocus={() => setGuessFocus(-1)}
										onKeyDown={e => currentGuessKeyDown(e)}
										ref={input => guessInputRef.current = input || undefined}
										type="text"
										value=""
									/>
									{ guessFocus === -1 || currentGuess.length ? "_" : "Tap here to guess" }
								</div>
							</div>

						</div>
						
						<div className="submit-guess">
							<button
								className={classnames({
									"empty-guess": currentGuess.length === 0,
								})}
								disabled={currentGuess.length < minLetters || currentGuess.length > maxLetters}
								onClick={() => submitCurrentGuess()}
							>
								{ currentGuess.length < minLetters ? `Hint: ≥ ${minLetters} letters` : (currentGuess.length > maxLetters) ? `Hint: ≤ ${maxLetters} letters` : "Submit Guess" }
							</button>
						</div>
					</>
				)}
				
				{guesses.map((guess, guessIdx) => (
					<div key={guessRowKey(guessIdx)}>
						<div className={guessRowClassName(guessIdx)}>
							{guess.name.split("").map((letter, letterIdx) => (
								<GuessLetter key={`${guessRowKey(guessIdx)}-guess-letter-${letterIdx}`} letter={letter} letterIndex={letterIdx} />
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
						</div>
					</div>
				))}
			</div>
			
			<AskForLinkModal isOpen={askForLinkModalOpen} onRequestClose={() => setAskForLinkModalOpen(false)} />
			<GotItModal gameId={gameId!} isOpen={gotItModalOpen} onRequestClose={() => setGotItModalOpen(false)} />
			<LeaderboardModal gameId={gameId!} isOpen={leaderboardModalOpen} onRequestClose={() => setLeaderboardModalOpen(false)} />
			<NameEntryModal isOpen={nameModalOpen} onRequestClose={() => setNameModalOpen(false)} />
			<RulesModal game={game} isOpen={rulesModalOpen} onRequestClose={() => setRulesModalOpen(false)} />
		</>
	)
}
