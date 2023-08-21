import Modal from "react-modal"
import { GAMES } from "../../../common/games"
import { useLeaderboard } from "../../../hooks/useLeaderboard"
import "./leaderboard-modal.component.scss"
import closeBtn from "/close-button.png"

type LeaderboardModalProps = {
	gameId: string
	isOpen?: boolean
	onRequestClose?: () => unknown
}

export function LeaderboardModal(props: LeaderboardModalProps) {
	const gameId = props.gameId
	const isOpen = props.isOpen || false
	const requestClose = () => props.onRequestClose?.()
	const game = GAMES[gameId]
	const leaderboard = useLeaderboard(gameId)

	const medalForIndex = (idx: number): string|undefined => {
		if (idx === 0) {
			return "🥇"
		}

		if (idx === 1) {
			return "🥈"
		}

		if (idx === 2) {
			return "🥉"
		}

		return undefined
	}

	return (
		<Modal
			closeTimeoutMS={300}
			isOpen={isOpen}
			onRequestClose={() => requestClose()}
			style={{
				content: {
					border: "solid 5px #ffffff",
					borderRadius: "15px",
					inset: "20px",
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
			<div className="modal leaderboard-modal">
				<div className="close-btn">
					<a onClick={() => requestClose()}>
						<img src={closeBtn} />
					</a>
				</div>

				<div className="modal-content">
					<h1>Leaderboard</h1>
					<h3 className="game-title">{game.title}</h3>

					{leaderboard.winners.length == 0 && (
						<div className="empty-leaderboard">
							<h3>No one has guessed the name, yet...</h3>
							<h3>The 🏆🥇 could be yours!</h3>
						</div>
					)}

					{leaderboard.winners.length > 0 && (
						<table className="winner-table">
							<thead>
								<tr>
									<td>Name</td>
									<td>Guesses</td>
									<td>Date</td>
								</tr>
							</thead>
							<tbody>
								{leaderboard.winners.map((l, idx) => (
									<tr key={`winner-${idx}`}>
										<td>{idx + 1}. {medalForIndex(idx)} {l.name}</td>
										<td>{l.guesses}</td>
										<td>{l.successDate.getMonth() + 1}/{l.successDate.getDate()}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</Modal>
	)
}
