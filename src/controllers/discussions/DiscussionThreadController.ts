import type { DiscussionThreadBody, DiscussionThreadList } from './types'
import { BaseController } from '../BaseController'
import type { WikiaEndpoint } from '../../endpoints'

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

		const req = await this.post(
			{
				...options,
				jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined,
				method: 'create'
			},
			{
				contentType: 'application/json',
				query: { forumId }
			}
		)
		return req.body.json() as Promise<DiscussionThreadBody>
	}

	public async delete( threadId: `${ number }` ): Promise<unknown> {
		const req = await this.post(
			{ method: 'delete' },
			{ query: { threadId } }
		)
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
		const req = await this.post(
			{ method: 'lock' },
			{ query: { threadId } }
		)
		return req.statusCode >= 200 && req.statusCode < 300
	}

	public async undelete( threadId: `${ number }` ): Promise<unknown> {
		const req = await this.post(
			{ method: 'undelete' },
			{ query: { threadId } }
		)
		return req.body.json()
	}

	public async unlock( threadId: string ): Promise<boolean> {
		const req = await this.post(
			{ method: 'unlock' },
			{ query: { threadId } }
		)
		return req.statusCode >= 200 && req.statusCode < 300
	}

	public async update( { threadId, ...options }: UpdateThreadOptions ): Promise<DiscussionThreadBody> {
		const req = await this.post(
			{
				...options,
				jsonModel: options.jsonModel ? JSON.stringify( options.jsonModel ) : undefined,
				method: 'update'
			},
			{
				contentType: 'application/json',
				query: { threadId }
			}
		)
		return req.body.json() as Promise<DiscussionThreadBody>
	}
}
