export class LocalData
{
	get didViewRules(): boolean {
		return this.getBoolItem("didViewRules") ?? false
	}

	set didViewRules(didViewRules: boolean) {
		this.setBoolItem("didViewRules", didViewRules)
	}

	reset() {
		localStorage.clear()
	}

	get userId(): string|undefined {
		return this.getItem("userId")
	}

	set userId(userId: string|undefined) {
		this.setItem("userId", userId)
	}

	get userIdLoaded(): boolean {
		return this.getBoolItem("userIdLoaded") ?? false
	}

	set userIdLoaded(userIdLoaded: boolean) {
		this.setBoolItem("userIdLoaded", userIdLoaded)
	}

	private getBoolItem(key: string): boolean|undefined {
		const value = this.getItem(key)

		if (value === undefined) {
			return undefined
		}

		return value === "true"
	}

	private getItem(key: string): string|undefined {
		return localStorage.getItem(key) || undefined
	}

	private setBoolItem(key: string, value: boolean|undefined): void {
		this.setItem(key, value === undefined ? undefined : (value ? "true" : "false"))
	}

	private setItem(key: string, value: string|undefined): void {
		if (value === undefined) {
			localStorage.removeItem(key)
		}
		else {
			localStorage.setItem(key, value)
		}
	}
}

export const localData = new LocalData()
