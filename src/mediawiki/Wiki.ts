import { Wiki as DefaultWiki } from '@quority/core'
import { Fandom } from '../strategies'

export class Wiki extends DefaultWiki<Fandom> {
	public static override readonly defaultStrategy = Fandom
}
