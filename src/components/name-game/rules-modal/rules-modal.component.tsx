import Modal from "react-modal"
import { DEFAULT_DAILY_GUESSES } from "../../../common/constants"
import { Game } from "../../../common/games"
import "./rules-modal.component.scss"
import closeBtn from "/close-button.png"

type RulesModalProps = {
	game: Game
	isOpen?: boolean
	onRequestClose?: () => unknown
}

export function RulesModal(props: RulesModalProps) {
	const requestClose = () => props.onRequestClose?.()
	const game = props.game
	const dailyGuesses = game?.dailyGuesses ?? DEFAULT_DAILY_GUESSES

	return (
		<Modal
			closeTimeoutMS={300}
			isOpen={props.isOpen || false}
			onRequestClose={props.onRequestClose}
			style={{
				content: {
					border: "solid 1px black",
					borderRadius: "15px",
					margin: "auto",
					maxHeight: "1000px",
					maxWidth: "700px",
					overflow: "visible",
					padding: 0,
				},
				overlay: {
					backgroundColor: "#00000088",
				},
			}}
		>
			<div className="modal rules-modal">
				<div className="modal-content">
					<h2>Welcome to the</h2>
					<h1>Name Game!</h1>

					{game.demo && (
						<p className="demo-notice">
							This is a DEMO. The name has been randomly generated to protect the innocent.
						</p>
					)}

					<p>
						The most talked about game in 2023 is here for you to play! The Name Game,
						created by Michael & Kristin, is built to reveal the name of Baby
						Richards in the most competive name reveal in history.
					</p>

					<h4>Here are the rules:</h4>

					<ul>
						<li>
							This game is a mix of Wordle and Mastermind.
						</li>
						<li>
							Every day, you get {dailyGuesses} guesses at the name. As we get closer to delivery,
							we'll increase the number of guesses per day.
						</li>
						<li>
							For every guess, we'll tell you how many letters are correct, and how many
							letters are correct but in the wrong spot.<br />
							🟢 = Correct letter in right spot<br />
							🟡 = Correct letter in wrong spot<br />
							❌ = No correct letters
						</li>
						<li>
							The trick is we don't tell you WHICH letter is correct. You'll have to
							figure that out with your guesses. Guess wisely!
						</li>
						<li>
							When we say a letter is in the wrong spot, we're always determining
							the spot from the start of the name.<br /><br />

							Meaning, if the name ends with a "Z": _ _ Z, and you guess _ _ _ _ _ _ Z,
							we'll give you a 🟡 because while the last letter is "Z", it's not
							in the 7th position as you guessed.
						</li>
					</ul>

					<h4>Hints:</h4>

					<ul>
						<li>
							The name has 3 or more letters, and 8 or less letters. The game will
							only let you guess names that are in that range. As we get closer to
							delivery, we'll shorten that range.
						</li>
					</ul>

					<h4>We hope you enjoy the game! Good luck!</h4>

					<p style={{textAlign: "center"}}>
						(We are open to considering offers from NY Times, BuzzFeed, etc. to acquire this game)
					</p>
				</div>

				<div className="close-btn">
					<a onClick={() => requestClose()}>
						<img src={closeBtn} />
					</a>
				</div>
			</div>
		</Modal>
	)
}
