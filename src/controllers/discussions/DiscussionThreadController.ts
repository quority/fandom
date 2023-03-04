import type { WikiaEndpoint } from '../../endpoints'
import { BaseController } from '../BaseController'
import { DiscussionThreadBody, DiscussionThreadList } from './types'

export type CreateThreadOptions = {
	articleIds?: Array<`${ number }`>
	attachments?: Record<string, unknown>
	forumId: `${ number }`
	siteId: `${ number }`
	title: string
} & ( {
	body: string
	jsonModel?: never
} | {
	body?: never
	jsonModel: Record<string, unknown>
} )

export type UpdateThreadOptions = Omit<CreateThreadOptions, 'siteId'> & {
	threadId: `${ number }`
}

export class DiscussionThreadController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionThread'

	public async create( { forumId, ...options }: CreateThreadOptions ): Promise<DiscussionThreadBody> {
		options.articleIds ??= []
		options.attachments ??= DiscussionThreadController.attachmentsDefault
		const url = new URL( `?controller=${ this.controller }&method=create&forumId=${ forumId }`, this.endpoint.url )
		options.attachments ??= DiscussionThreadController.attachmentsDefault
		const req = await this.raw( url, {
			body: JSON.stringify( {
				...options,
				jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined
			} ),
			method: 'POST'
		} )
		return req.body.json() as Promise<DiscussionThreadBody>
	}

	public async delete( threadId: `${ number }` ): Promise<unknown> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'delete',
			threadId
		} )
		const req = await this.raw( url, {
			method: 'POST'
		} )
		return req.body.json()
	}

	public async getThread( threadId: `${ number }` ): Promise<DiscussionThreadBody> {
		const req = await this.get( {
			method: 'getThread',
			threadId
		} )
		return req.body.json() as Promise<DiscussionThreadBody>
	}

	public async getThreadForAnons( threadId: `${ number }` ): Promise<DiscussionThreadBody> {
		const req = await this.get( {
			method: 'getThreadForAnons',
			threadId
		} )
		return req.body.json() as Promise<DiscussionThreadBody>
	}

	public async getThreads(): Promise<DiscussionThreadList> {
		const req = await this.get( {
			method: 'getThreads'
		} )
		return req.body.json() as Promise<DiscussionThreadList>
	}

	public async lock( threadId: string ): Promise<boolean> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'lock',
			threadId
		} )
		const req = await this.raw( url, { method: 'POST' } )
		return req.statusCode >= 200 && req.statusCode < 300
	}

	public async undelete( threadId: `${ number }` ): Promise<unknown> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'undelete',
			threadId
		} )
		const req = await this.raw( url, {
			method: 'POST'
		} )
		return req.body.json()
	}

	public async unlock( threadId: string ): Promise<boolean> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'unlock',
			threadId
		} )
		const req = await this.raw( url, { method: 'POST' } )
		return req.statusCode >= 200 && req.statusCode < 300
	}

	public async update( { threadId, ...options }: UpdateThreadOptions ): Promise<DiscussionThreadBody> {
		const url = this.getUrl( {
			controller: this.controller,
			method: 'update',
			threadId
		} )
		const req = await this.raw( url, {
			body: JSON.stringify( {
				...options,
				jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined
			} ),
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST'
		} )
		return req.body.json() as Promise<DiscussionThreadBody>
	}
}