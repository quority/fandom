import { Wiki as DefaultWiki } from '@wikiscript/core'
import { Fandom } from '../strategies'

export class Wiki extends DefaultWiki<Fandom> {
	static override readonly defaultStrategy = Fandom
}
