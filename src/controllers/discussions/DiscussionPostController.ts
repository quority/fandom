import type { DiscussionPostList, DiscussionReply } from './types'
import { BaseController } from '../BaseController'
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
	jsonModel: Record<string, unknown>
} )

export class DiscussionPostController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionPost'

	public async create( options: CreateReplyOptions ): Promise<DiscussionReply> {
		options.attachments ??= DiscussionPostController.attachmentsDefault
		const req = await this.post( {
			...options,
			jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined,
			method: 'create'
		}, { contentType: 'application/json' } )
		return req.body.json() as Promise<DiscussionReply>
	}

	public async delete( postId: `${ number }` ): Promise<DiscussionReply> {
		const req = await this.post( {
			method: 'delete',
			postId
		} )
		return req.body.json() as Promise<DiscussionReply>
	}

	public async getPost( postId: `${ number }` ): Promise<DiscussionReply> {
		const req = await this.get( {
			method: 'getPost',
			postId
		} )
		return req.body.json() as Promise<DiscussionReply>
	}

	public async getPosts(): Promise<DiscussionPostList> {
		const req = await this.get( {
			method: 'getPosts'
		} )
		return req.body.json() as Promise<DiscussionPostList>
	}

	public async undelete( postId: `${ number }` ): Promise<DiscussionReply> {
		const req = await this.post( {
			method: 'undelete',
			postId
		} )
		return req.body.json() as Promise<DiscussionReply>
	}

	public async update( replyId: `${ number }`, options: Omit<CreateReplyOptions, 'siteId'> ): Promise<DiscussionReply> {
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
		return req.body.json() as Promise<DiscussionReply>
	}
}
