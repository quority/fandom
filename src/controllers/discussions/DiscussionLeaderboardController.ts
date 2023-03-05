import { BaseController } from '../BaseController'
import type { DiscussionsAPI } from './types'
import type { WikiaEndpoint } from '../../endpoints'

export class DiscussionLeaderboardController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionLeaderboard'

	public async getModeratorActions(): Promise<DiscussionsAPI.DiscussionLeaderboard> {
		const req = await this.get( {
			method: 'getModeratorActions'
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionLeaderboard>
	}

	public async getPosts(): Promise<DiscussionsAPI.DiscussionLeaderboard> {
		const req = await this.get( {
			method: 'getPosts'
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionLeaderboard>
	}

	public async getReports(): Promise<DiscussionsAPI.DiscussionReportLeaderboard> {
		const req = await this.get( {
			method: 'getReports'
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionReportLeaderboard>
	}
}
