type GuessLetterProps = {
	letter: string
	letterIndex?: number
	onClick?: () => unknown|Promise<unknown>
}

export function GuessLetter(props: GuessLetterProps) {
	const letter = props.letter
	const letterIndex = props.letterIndex
	const onClick = props.onClick

	return (
		<div
			className="guess-letter-container"
			onClick={() => onClick?.()}
			style={{
				animationDelay: letterIndex !== undefined ? `${letterIndex * 100}ms` : "",
			}}
		>
			<div className="guess-letter">
				{letter}
			</div>
		</div>
	)
}
