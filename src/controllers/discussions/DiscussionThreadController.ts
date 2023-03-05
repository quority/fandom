import { BaseController } from '../BaseController'
import type { DiscussionsAPI } from './types'
import type { DocNode } from '@atlaskit/adf-schema'
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
	jsonModel: DocNode | Record<string, unknown>
} )

export type UpdateThreadOptions = Omit<CreateThreadOptions, 'siteId'> & {
	threadId: `${ number }`
}

export class DiscussionThreadController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'DiscussionThread'

	public async create( { forumId, ...options }: CreateThreadOptions ): Promise<DiscussionsAPI.DiscussionThread> {
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
		return req.body.json() as Promise<DiscussionsAPI.DiscussionThread>
	}

	public async delete( threadId: `${ number }` ): Promise<unknown> {
		const req = await this.post(
			{ method: 'delete' },
			{ query: { threadId } }
		)
		return req.body.json()
	}

	public async getThread( threadId: `${ number }` ): Promise<DiscussionsAPI.DiscussionThread> {
		const req = await this.get( {
			method: 'getThread',
			threadId
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionThread>
	}

	public async getThreadForAnons( threadId: `${ number }` ): Promise<DiscussionsAPI.DiscussionThread> {
		const req = await this.get( {
			method: 'getThreadForAnons',
			threadId
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionThread>
	}

	public async getThreads(): Promise<DiscussionsAPI.DiscussionThreadContainer> {
		const req = await this.get( {
			method: 'getThreads'
		} )
		return req.body.json() as Promise<DiscussionsAPI.DiscussionThreadContainer>
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

	public async update( { threadId, ...options }: UpdateThreadOptions ): Promise<DiscussionsAPI.DiscussionThread> {
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
		return req.body.json() as Promise<DiscussionsAPI.DiscussionThread>
	}
}
