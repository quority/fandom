import { BaseController } from '../BaseController'
import type { DiscussionsAPI } from './types'
import type { WikiaEndpoint } from '../../endpoints'

export class DiscussionContributionController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionContribution'

	public async deleteAll( userId: number ): Promise<{ deletedBy: DiscussionsAPI.User }> {
		const req = await this.post( {
			method: 'deleteAll',
			userId: `${ userId }`
		} )
		return req.body.json() as Promise<{ deletedBy: DiscussionsAPI.User }>
	}
}
