import { BaseController } from '../BaseController'
import type { DiscussionsAPI } from './types'
import type { WikiaEndpoint } from '../../endpoints'

export interface CreateForumOptions {
	name: string
	siteId: number
}

export interface DeleteForumOptions {
	forumId: string
	moveChildrenTo: string
}

export interface MoveThreadsOptions {
	forumId: string
	threadIds: string[]
}

export interface UpdateForumOptions {
	forumId: string
	name: string
}

export class DiscussionForumController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionForum'

	public async createForum( options: CreateForumOptions ): Promise<DiscussionsAPI.DiscussionForum> {
		const req = await this.post( {
			method: 'createForum',
			name: options.name,
			parentId: '1',
			siteId: `${ options.siteId }`
		}, { contentType: 'application/json' } )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionForum>
	}

	public async deleteForum( { forumId, moveChildrenTo }: DeleteForumOptions ): Promise<boolean> {
		const req = await this.post(
			{
				method: 'deleteForum',
				moveChildrenTo
			},
			{
				contentType: 'application/json',
				query: { forumId }
			}
		)
		return req.statusCode === 204
	}

	public async getForum( forumId: `${ number }` ): Promise<DiscussionsAPI.DiscussionForum> {
		const req = await this.get( {
			forumId,
			method: 'getForum'
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionForum>
	}

	public async getForums(): Promise<DiscussionsAPI.DiscussionRootForum> {
		const req = await this.get( {
			method: 'getForums'
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionRootForum>
	}

	public async moveThreadsIntoForum( { forumId, threadIds }: MoveThreadsOptions ): Promise<boolean> {
		const req = await this.post(
			{
				method: 'moveThreadsIntoForum',
				threadIds
			},
			{
				contentType: 'application/json',
				query: { forumId }
			}
		)
		return req.statusCode === 204
	}

	public async updateForum( { forumId, name }: UpdateForumOptions ): Promise<DiscussionsAPI.DiscussionForum> {
		const req = await this.post(
			{
				method: 'updateForum',
				name
			},
			{
				contentType: 'application/json',
				query: { forumId }
			}
		)
		return req.body.json() as Promise<DiscussionsAPI.DiscussionForum>
	}

	public async updateForumDisplayOrder( forumIds: string[] ): Promise<{ forumIds: Array<`${ number }`> }> {
		const req = await this.post( {
			forumIds,
			method: 'updateForumDisplayOrder'
		}, { contentType: 'application/json' } )
		return req.body.json() as Promise<{ forumIds: Array<`${ number }`> }>
	}
}
