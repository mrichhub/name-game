import Modal from "react-modal"
import "./ask-for-link-modal.component.scss"

type AskForLinkModalProps = {
	isOpen?: boolean
	onRequestClose?: () => unknown
}

export function AskForLinkModal(props: AskForLinkModalProps) {
	const isOpen = props.isOpen || false
	const requestClose = () => props.onRequestClose?.()

	return <>
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
			<div className="modal ask-for-link-modal">
				<div className="modal-content">
					<h1>⚠️</h1>
					
					<p>To keep things simple (so I don't need to implement a login for this game), you need a unique link to play.</p>

					<p>Please ask Michael for one 🙂</p>
				</div>
			</div>		
		</Modal>
	</>
}
