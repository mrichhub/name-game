import { useEffect, useState } from "react"
import Modal from "react-modal"
import { useProfile } from "../../../hooks/useProfile"
import { rediSync } from "../../../redisync/redisync.client"
import "./name-entry-modal.component.scss"

type NameEntryModalProps = {
	isOpen?: boolean
	onRequestClose?: () => unknown
}

export function NameEntryModal(props: NameEntryModalProps) {
	const isOpen = props.isOpen || false
	const [name, setName] = useState("")
	const profile = useProfile()
	const requestClose = () => props.onRequestClose?.()
	const [submittingName, setSubmittingName] = useState(false)

	const submitName = async() => {
		if (!name.length || submittingName) { return }

		setSubmittingName(true)

		await rediSync.setUserProfile(profile.userId, {
			name,
		})
	}

	useEffect(() => {
		if (profile.name) {
			requestClose()
		}
	}, [profile])

	return (
		<>
			<Modal
				closeTimeoutMS={300}
				isOpen={isOpen}
				style={{
					content: {
						border: "solid 1px black",
						borderRadius: "15px",
						margin: "auto",
						maxHeight: "300px",
						maxWidth: "300px",
						overflow: "visible",
						padding: 0,
					},
					overlay: {
						backgroundColor: "#00000088",
					},
				}}
			>
				<div className="modal name-entry-modal">
					<div className="modal-content">
						<h1>What's your name?</h1>
						<p>This will be how your name appears on the leaderboard.</p>

						<input type="text" onChange={e => setName(e.target.value)} placeholder="Name" />

						<button onClick={() => submitName()} disabled={!name || submittingName}>That's my name!</button>
					</div>
				</div>
			</Modal>
		</>
	)
}
