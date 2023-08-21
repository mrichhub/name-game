import { KeyWatcher } from "@redsync/client-js"
import { rediSync } from "../redisync.client"

type KeyChangedListener<T> = (key: T) => unknown

export abstract class RediSyncKeyWatcher<T>
{
	lastValue?: T

	private keyWatcher?: KeyWatcher
	private isLoadingKey = false
	private isLoadingKeyWatcher = false
	private onKeyChangedListeners: Array<KeyChangedListener<T>> = []

	constructor(
		private readonly key: string,
	) {
		rediSync.on("connect", () => void this.loadKey())
	}

	protected abstract retrieveKeyValue(): T|Promise<T>

	stopAll() {
		this.onKeyChangedListeners = []
		void this.stopKeyWatcher()
	}

	stopWatching(onKeyChanged: KeyChangedListener<T>): void {
		this.onKeyChangedListeners = this.onKeyChangedListeners.filter(l => l !== onKeyChanged)
		void this.stopKeyWatcher()
	}

	watch(onKeyChanged: KeyChangedListener<T>): void {
		this.onKeyChangedListeners.push(onKeyChanged)

		// Send the previous last value if we already have one
		this.lastValue && onKeyChanged(this.lastValue)

		void this.loadKeyWatcher()
	}

	private async loadKey(): Promise<void> {
		if (this.isLoadingKey) { return }

		this.isLoadingKey = true

		const keyValue = await this.retrieveKeyValue()

		this.lastValue = keyValue

		for (const listener of this.onKeyChangedListeners) {
			listener(keyValue)
		}

		this.isLoadingKey = false
	}

	private async loadKeyWatcher(): Promise<void> {
		if (this.keyWatcher !== undefined) { return }

		if (!this.isLoadingKeyWatcher) {
			this.isLoadingKeyWatcher = true
			
			this.keyWatcher = await rediSync.watch(this.key, () => void this.loadKey())

			this.isLoadingKeyWatcher = false
		}

		await this.loadKey()
	}

	private async stopKeyWatcher(): Promise<void> {
		if (this.onKeyChangedListeners.length) {
			return
		}

		await this.keyWatcher?.dispose()
		this.keyWatcher = undefined
	}
}
