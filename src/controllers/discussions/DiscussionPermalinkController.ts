import { BaseController } from '../BaseController'
import type { DiscussionThreadBody } from './types'
import type { WikiaEndpoint } from '../../endpoints'

export class DiscussionPermalinkController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionPermalink'

	public async getThreadByPostId( postId: string ): Promise<DiscussionThreadBody> {
		const req = await this.get( {
			method: 'getThreadByPostId',
			postId
		} )
		return req.body.json() as Promise<DiscussionThreadBody>
	}
}
