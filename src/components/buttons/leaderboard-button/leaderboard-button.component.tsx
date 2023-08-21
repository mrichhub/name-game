import { useLeaderboard } from "../../../hooks/useLeaderboard"
import "./leaderboard-button.component.scss"

type LeaderboardButtonProps = {
	gameId: string
	onClick?: () => unknown
}

export function LeaderboardButton(props: LeaderboardButtonProps) {
	const gameId = props.gameId
	const leaderboard = useLeaderboard(gameId)
	const onClick = props.onClick

	return (
		<div className="leaderboard-button">
			<button onClick={() => onClick?.()}>
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="4 4 24 24" width="24" className="leaderboard-icon" data-testid="icon-help">
					<path d="M20.6666 14.8333V5.5H11.3333V12.5H4.33325V26.5H27.6666V14.8333H20.6666ZM13.6666 7.83333H18.3333V24.1667H13.6666V7.83333ZM6.66659 14.8333H11.3333V24.1667H6.66659V14.8333ZM25.3333 24.1667H20.6666V17.1667H25.3333V24.1667Z"></path>
				</svg>
			</button>

			{leaderboard.winners.length > 0 && (
				<div className="leaderboard-count">{leaderboard.winners.length}</div>
			)}
		</div>
	)
}
