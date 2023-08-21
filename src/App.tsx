import { useState } from "react"
import Modal from "react-modal"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.scss"
import { Dashboard } from "./components/dashboard/dashboard.component"
import { Home } from "./components/home/home.component"
import { LoadUser } from "./components/load-user/load-user.component"
import { NameGame } from "./components/name-game/name-game.component"
import { ResetLeaderboard } from "./components/reset/reset-leaderboard"
import { Reset } from "./components/reset/reset.component"
import { User } from "./components/user/user.component"
import { Util } from "./components/util/util.component"
import "./styles/animations.scss"
import reactLogo from "/react.svg"
import viteLogo from "/vite.svg"

Modal.setAppElement("#root")

export function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Routes>
					<Route path="/" Component={Home} />
					<Route path="/admin/user" Component={User} />
					<Route path="/game/:gameId/dashboard" Component={Dashboard} />
					<Route path="/game/:gameId" Component={NameGame} />
					<Route path="/reset" Component={Reset} />
					<Route path="/reset/leaderboard" Component={ResetLeaderboard} />
					<Route path="/u/:userId" Component={LoadUser} />
					<Route path="/u/:userId/:gameId" Component={LoadUser} />
					<Route path="/util" Component={Util} />
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export function ReactDefaultApp() {
	const [count, setCount] = useState(0)

	return (
	  <div className="App">
		<div>
		  <a href="https://vitejs.dev" target="_blank">
			<img src={viteLogo} className="logo" alt="Vite logo" />
		  </a>
		  <a href="https://reactjs.org" target="_blank">
			<img src={reactLogo} className="logo react" alt="React logo" />
		  </a>
		</div>
		<h1>Vite + React</h1>
		<div className="card">
		  <button onClick={() => setCount((count) => count + 1)}>
			count is {count}
		  </button>
		  <p>
			Edit <code>src/App.tsx</code> and save to test HMR
		  </p>
		</div>
		<p className="read-the-docs">
		  Click on the Vite and React logos to learn more
		</p>
	  </div>
	)
}

export default App
// export default ReactDefaultApp
