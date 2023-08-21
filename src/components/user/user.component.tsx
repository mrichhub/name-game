import { useEffect, useState } from "react"
import { useProfile } from "../../hooks/useProfile"
import { NameEntryModal } from "../modals/name-entry-modal/name-entry-modal.component"

export function User() {
	const [nameModalOpen, setNameModalOpen] = useState(false)
	const profile = useProfile()

	useEffect(() => {
		if (nameModalOpen || !profile.loaded || profile.name) { return }

		setTimeout(() => {
			if (!profile.name) {
				setNameModalOpen(true)
			}
		}, 500)
	}, [nameModalOpen, profile])

	return <>
		<div className="user">
			<h1>User</h1>
			<h3>{profile.name}</h3>
			<button onClick={() => setNameModalOpen(true)}>Change Name</button>
		</div>
		
		<NameEntryModal isOpen={nameModalOpen} onRequestClose={() => setNameModalOpen(false)} />
	</>
}
