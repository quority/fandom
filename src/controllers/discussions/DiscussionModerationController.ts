import type { WikiaEndpoint } from '../../endpoints'
import { BaseController } from '../BaseController'
import { DiscussionPostReports, DiscussionReportedPosts } from './types'

export class DiscussionModerationController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionModeration'

	public async getPostListReports( postId: string ): Promise<DiscussionPostReports> {
		const req = await this.get( {
			method: 'getPostListReports',
			postId
		} )
		return req.body.json() as Promise<DiscussionPostReports>
	}

	public async getReportedPosts(): Promise<DiscussionReportedPosts> {
		const req = await this.get( {
			method: 'getReportedPosts'
		} )
		return req.body.json() as Promise<DiscussionReportedPosts>
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