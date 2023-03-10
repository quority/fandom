import { BaseController } from '../BaseController'
import type { DiscussionsAPI } from './types'
import type { DocNode } from '@atlaskit/adf-schema'
import type { WikiaEndpoint } from '../../endpoints'

export interface CommentOptions {
	attachments?: Record<string, unknown>
	jsonModel: DocNode | Record<string, unknown>
	namespace: number
	title: string
}

export interface EditCommentOptions extends CommentOptions {
	postId: string
}

export interface CommentReplyOptions extends CommentOptions {
	threadId: string
}

export interface ReportCommentOptions {
	namespace: number
	postId: string
	title: string
}

export class ArticleCommentsController extends BaseController<WikiaEndpoint> {
	public readonly controller = 'ArticleComments'

	public async deletePost( postId: string ): Promise<boolean> {
		const req = await this.post( {
			method: 'deletePost',
			postId,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.statusCode >= 200 && req.statusCode < 300
	}

	public async editComment( options: EditCommentOptions ): Promise<DiscussionsAPI.Post> {
		options.attachments ??= ArticleCommentsController.attachmentsDefault

		const req = await this.post( {
			attachments: JSON.stringify( options.attachments ),
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'editComment',
			namespace: `${ options.namespace }`,
			postId: options.postId,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json() as Promise<DiscussionsAPI.Post>
	}

	public async getArticleTitle( stablePageId: number | string ): Promise<string> {
		const req = await this.get( {
			method: 'getArticleTitle',
			stablePageId: `${ stablePageId }`
		} )
		const res = await req.body.json() as {
			title: string
		}
		return res.title
	}

	public async getCommentCount( title: string, namespace = 0, hideDeleted = true ): Promise<number> {
		const req = await this.get( {
			hideDeleted: `${ hideDeleted }`,
			method: 'getCommentCount',
			namespace: `${ namespace }`,
			title
		} )
		return req.body.json() as Promise<number>
	}

	public async getComments( title: string, namespace = 0, hideDeleted = true ): Promise<DiscussionsAPI.ArticleComments> {
		const req = await this.get( {
			hideDeleted: `${ hideDeleted }`,
			method: 'getComments',
			namespace: `${ namespace }`,
			title
		} )
		return req.body.json() as Promise<DiscussionsAPI.ArticleComments>
	}

	public async getThread( threadId: string, title: string, namespace = 0, hideDeleted = true ): Promise<DiscussionsAPI.ArticleCommentThread> {
		const req = await this.get( {
			hideDeleted: `${ hideDeleted }`,
			method: 'getThread',
			namespace: `${ namespace }`,
			threadId,
			title
		} )
		return req.body.json() as Promise<DiscussionsAPI.ArticleCommentThread>
	}

	public async postNewCommentReply( options: CommentReplyOptions ): Promise<DiscussionsAPI.ArticleCommentReply> {
		options.attachments ??= ArticleCommentsController.attachmentsDefault
		const req = await this.post( {
			attachments: JSON.stringify( options.attachments ),
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'postNewCommentReply',
			namespace: `${ options.namespace }`,
			threadId: options.threadId,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json() as Promise<DiscussionsAPI.ArticleCommentReply>
	}

	public async postNewCommentThread( options: CommentOptions ): Promise<DiscussionsAPI.ArticleComment> {
		options.attachments ??= ArticleCommentsController.attachmentsDefault
		const req = await this.post( {
			attachments: JSON.stringify( options.attachments ),
			jsonModel: JSON.stringify( options.jsonModel ),
			method: 'postNewCommentThread',
			namespace: `${ options.namespace }`,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.body.json() as Promise<DiscussionsAPI.ArticleComment>
	}

	public async reportPost( options: ReportCommentOptions ): Promise<boolean> {
		const req = await this.post( {
			method: 'reportPost',
			namespace: `${ options.namespace }`,
			postId: options.postId,
			title: options.title,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.statusCode >= 200 && req.statusCode < 300
	}

	public async undeletePost( postId: string ): Promise<boolean> {
		const req = await this.post( {
			method: 'undeletePost',
			postId,
			token: await this.endpoint.wiki.platform.getCSRFToken()
		} )
		return req.statusCode >= 200 && req.statusCode < 300
	}
}
