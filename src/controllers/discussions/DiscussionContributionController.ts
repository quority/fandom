import type { ArticleCommentsBody } from './types'
import { BaseController } from '../BaseController'
import type { WikiaEndpoint } from '../../endpoints'

export class DiscussionContributionController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionContribution'

	public async deleteAll( userId: number ): Promise<{ deletedBy: ArticleCommentsBody[ 'firstPost' ][ 'createdBy' ] }> {
		const req = await this.post( {
			controller: this.controller,
			method: 'deleteAll',
			userId: `${ userId }`
		} )
		return req.body.json() as Promise<{ deletedBy: ArticleCommentsBody[ 'firstPost' ][ 'createdBy' ] }>
	}
}
