import Confetti from "react-confetti"
import Modal from "react-modal"
import { GAMES } from "../../../common/games"
import "./got-it-modal.component.scss"
import closeBtn from "/close-button.png"
import youWin from "/you-win.png"

type GotItModalProps = {
	gameId: string
	isOpen?: boolean
	onRequestClose?: () => unknown
}

export function GotItModal(props: GotItModalProps) {
	const gameId = props.gameId
	const isOpen = props.isOpen || false
	const requestClose = () => props.onRequestClose?.()
	const game = GAMES[gameId]

	return (
		<>
			<Modal
				closeTimeoutMS={300}
				isOpen={isOpen}
				onRequestClose={requestClose}
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
				<div className="modal got-it-modal">
					<div className="modal-content">
						<h1 className="correct-name">{game.name}</h1>
						<h1>You got the {game.title.toLowerCase()}!</h1>

						<img src={youWin} className="you-win-img" />

						{!game.demo && (
							<p>We look forward to meeting them soon.</p>
						)}
					</div>

					<div className="close-btn">
						<a onClick={() => requestClose()}>
							<img src={closeBtn} />
						</a>
					</div>
				</div>
			</Modal>

			{isOpen && (
				<Confetti />
			)}
		</>
	)
}
