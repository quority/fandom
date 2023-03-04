import { BaseController } from '../BaseController'
import type { WikiaEndpoint } from '../../endpoints'

export class DiscussionVoteController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionVote'

	public async upvote( postId: `${ number }` ): Promise<unknown> {
		const req = await this.post(
			{ method: 'upVotePost' },
			{ query: { postId } }
		)
		return req.body.json()
	}

	public async downvote( postId: `${ number }` ): Promise<unknown> {
		const req = await this.post(
			{ method: 'downVotePost' },
			{ query: { postId } }
		)
		return req.body.json()
	}
}
