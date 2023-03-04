import type { WikiaEndpoint } from '../../endpoints'
import { BaseController } from '../BaseController'
import type { DiscussionPostList, DiscussionReply } from './types'

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
			controller: this.controller,
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
			controller: this.controller,
			method: 'undelete',
			postId
		} )
		return req.body.json() as Promise<DiscussionReply>
	}

	public async update( replyId: `${ number }`, options: Omit<CreateReplyOptions, 'siteId'> ): Promise<DiscussionReply> {
		const url = new URL( `?controller=${ this.controller }&method=update&postId=${ replyId }`, this.endpoint.url )
		options.attachments ??= DiscussionPostController.attachmentsDefault
		const req = await this.raw( url, {
			body: JSON.stringify( {
				...options,
				jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined
			} ),
			method: 'POST'
		} )
		return req.body.json() as Promise<DiscussionReply>
	}
}
