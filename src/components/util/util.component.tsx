import { rediSync } from "../../redisync/redisync.client"

export function Util() {
	// const delAllKeys = async() => {
	// 	console.log("keys deleted", await rediSync.delAllKeys())
	// }

	const getRediSyncKeys = async() => {
		const keys = await rediSync.keys()
		console.log("keys", keys)
	}

	// const migrateV2 = async() => {
	// 	console.log("migrating")
	// 	await rediSync.migrate()
	// 	console.log("migrated")
	// }

	return (
		<>
			<h1>Util</h1>

			<button onClick={() => getRediSyncKeys()}>Keys</button><br />
			{/* <button onClick={() => migrateV2()}>Migrate</button><br /> */}
			{/* <button onClick={() => delAllKeys()}>Delete ALL Keys</button> */}
		</>
	)
}
