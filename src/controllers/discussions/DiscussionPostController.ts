import { BaseController } from '../BaseController'
import type { DiscussionsAPI } from './types'
import type { DocNode } from '@atlaskit/adf-schema'
import type { WikiaEndpoint } from '../../endpoints'

export type CreateReplyOptions = {
	attachments?: Record<string, unknown>
	siteId: `${ number }`
	threadId: `${ number }`
} & ( {
	body: string
	jsonModel?: never
} | {
	body?: never
	jsonModel: DocNode | Record<string, unknown>
} )

export interface GetPostsOptions {
	canViewHiddenPosts?: `${ boolean }`
	canViewHiddenPostsInContainer?: `${ boolean }`
	limit?: number
	page?: number
}

export class DiscussionPostController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionPost'

	public async create( options: CreateReplyOptions ): Promise<DiscussionsAPI.DiscussionPost> {
		options.attachments ??= DiscussionPostController.attachmentsDefault
		const req = await this.post( {
			...options,
			jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined,
			method: 'create'
		}, { contentType: 'application/json' } )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionPost>
	}

	public async delete( postId: `${ number }` ): Promise<DiscussionsAPI.DiscussionPost> {
		const req = await this.post( {
			method: 'delete',
			postId
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionPost>
	}

	public async getPost( postId: `${ number }` ): Promise<DiscussionsAPI.DiscussionPost> {
		const req = await this.get( {
			method: 'getPost',
			postId
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionPost>
	}

	public async getPosts( options?: GetPostsOptions ): Promise<DiscussionsAPI.DiscussionPostListContainer> {
		const req = await this.get( {
			method: 'getPosts',
			...options
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionPostListContainer>
	}

	public async undelete( postId: `${ number }` ): Promise<DiscussionsAPI.DiscussionPost> {
		const req = await this.post( {
			method: 'undelete',
			postId
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionPost>
	}

	public async update( replyId: `${ number }`, options: Omit<CreateReplyOptions, 'siteId'> ): Promise<DiscussionsAPI.DiscussionPost> {
		options.attachments ??= DiscussionPostController.attachmentsDefault

		const req = await this.post(
			{
				...options,
				jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined,
				method: 'update'
			},
			{
				contentType: 'application/json',
				query: { postId: replyId }
			}
		)
		return req.body.json() as Promise<DiscussionsAPI.DiscussionPost>
	}
}
