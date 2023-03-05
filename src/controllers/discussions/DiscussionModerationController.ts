import { BaseController } from '../BaseController'
import type { DiscussionsAPI } from './types'
import type { WikiaEndpoint } from '../../endpoints'

export class DiscussionModerationController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionModeration'

	public async getPostListReports( postId: string ): Promise<{ posts: [] | [ DiscussionsAPI.Report ] }> {
		const req = await this.get( {
			method: 'getPostListReports',
			postId
		} )
		return req.body.json() as Promise<{ posts: [ DiscussionsAPI.Report ] }>
	}

	public async getReportedPosts(): Promise<DiscussionsAPI.DiscussionPostListContainer> {
		const req = await this.get( {
			method: 'getReportedPosts'
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionPostListContainer>
	}

	public async reportPost( postId: string ): Promise<boolean> {
		const req = await this.post( {
			controller: this.controller,
			method: 'reportPost',
			postId
		} )
		return req.statusCode === 201
	}

	public async validatePostReport( postId: string ): Promise<boolean> {
		const req = await this.post( {
			controller: this.controller,
			method: 'validatePostReport',
			postId
		} )
		return req.statusCode === 200
	}
}
