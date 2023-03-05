import { BaseController } from '../BaseController'
import type { DiscussionsAPI } from './types'
import type { WikiaEndpoint } from '../../endpoints'

export class DiscussionPermalinkController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionPermalink'

	public async getThreadByPostId( postId: string ): Promise<DiscussionsAPI.DiscussionThread> {
		const req = await this.get( {
			method: 'getThreadByPostId',
			postId
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionThread>
	}
}
