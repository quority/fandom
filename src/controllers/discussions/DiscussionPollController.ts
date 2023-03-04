import { BaseController } from '../BaseController'
import type { WikiaEndpoint } from '../../endpoints'

export class DiscussionPollController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionPoll'

	public async getVoters( pollId: string ): Promise<unknown> {
		const req = await this.get( {
			method: 'getVoters',
			pollId
		} )
		return req.body.json()
	}
}
