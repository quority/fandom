// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DiscussionsAPI {
	export enum ContainerTypes {
		ArticleComment = 'ARTICLE_COMMENT',
		Forum = 'FORUM',
		Post = 'POST',
		Reply = 'REPLY',
		Wall = 'WALL'
	}

	export type PostId = `${ number }`

	export interface Date {
		epochSecond: number
		nano: number
	}

	export interface ContentImage {
		height: number
		id: number
		mediaType: string
		position: number
		url: string
		width: number
	}

	export interface Attachments {
		atMentions: unknown[]
		contentImages: ContentImage[]
		openGraphs: unknown[]
		polls: unknown[]
		quizzes: unknown[]
	}

	export interface User {
		avatarUrl: string
		badgePermission: string
		id: `${ number }`
		name: string
	}

	export interface UserPostData {
		hasUpvoted: boolean
		isReported: boolean
		permissions: {
			canDelete: boolean
			canEdit: boolean
		}
		postId: PostId
	}

	export interface Report {
		containerType: ContainerTypes
		count: number
		postId: PostId
		userInfo: User[]
	}

	export interface Resource {
		creationDate: Date
		id: PostId
	}

	export interface Post extends Resource {
		attachments: Attachments
		createdBy: User
		jsonModel: string | null
		lastEditedBy?: User
		upvoteCount: number
		userData: UserPostData
	}

	export interface ArticleComment extends Resource {
		containerId: PostId
		firstPost: Post
		followed: boolean
		postId: PostId
		posts: Post[]
		readOnlyMode: boolean
	}

	export interface ArticleCommentThread {
		reportedData: {
			reportedData: {
				posts: Report[]
			}
		}
		thread: ArticleComment
	}

	export interface ArticleCommentReply {
		followed: boolean
		reply: Post
		threadId: PostId
	}

	export interface ArticleComments {
		readOnlyMode: false
		reportedData: {
			posts: Report[]
		}
		threads: ArticleComment[]
		totalCount: number
	}

	export interface Tag {
		articleId: PostId
		articleTitle: string
		relativeUrl: string
		siteId: PostId
		image: null
	}

	export interface DiscussionEmbedded {
		attachments: Attachments
		contentImages: ContentImage[]
		userData: [ {
			hasReported: boolean
			hasUpvoted: boolean
			permissions?: DiscussionThreadPermissions[]
		} ]
	}

	export interface BaseDiscussionPost extends Resource {
		creatorId: PostId
		creatorIp: string
		jsonModel: string
		rawContent: string
		renderedContent: unknown | null
	}

	export interface DiscussionPostEmbedded extends DiscussionEmbedded {
		latestRevision: [ BaseDiscussionPost & {
			postId: PostId
		} ]
		thread?: [ {
			containerId: PostId
			containerType: ContainerTypes
			creatorId: PostId
			firstPost: [ {
				attachments: Attachments
				createdBy: User
				createdByIp: unknown | null
				id: PostId
				jsonModel: string
				renderedContent: null
				threadId: PostId
				title: string
			} ]
			isDeleted: boolean
			isEditable: boolean
			isLocked: boolean
			isReply: boolean
			isReported: boolean
			postCount: PostId
			tags: Tag[]
			title: string
		} ]
	}

	export interface DiscussionPost extends BaseDiscussionPost {
		_embedded: DiscussionPostEmbedded
		createdBy: User
		isDeleted: boolean
		isEditable: boolean
		isLocked: boolean
		isReported: boolean
		latestRevisionId: PostId
		modificationDate: Date
		position: number
		requesterId: PostId
		siteId: PostId
		threadId: PostId
		title: string
		upvoteCount: number
	}

	export type DiscussionThreadPermissions = 'canDelete' | 'canUndelete' | 'canSuppress' | 'canModerate' | 'canLock' | 'canUnlock' | 'canMove' | 'canEdit'

	export interface DiscussionThreadEmbedded extends DiscussionEmbedded {
		'doc:posts': DiscussionPost[]
		// Seems to be always empty
		contributors: [ {
			count: 0
			userInfo: []
		} ]
		firstPost: [ DiscussionPost ]
	}

	export interface DiscussionThread extends Resource {
		_embedded: DiscussionThreadEmbedded
		createdBy: User
		firstPostId: PostId
		forumId: PostId
		forumName: string
		funnel: 'TEXT'
		isDeleted: boolean
		isEditable: boolean
		isFollowed: boolean
		isLocked: boolean
		isReported: boolean
		jsonModel: string | null
		lastPostId: PostId
		latestRevisionId: PostId
		modificationDate: Date
		postCount: number
		rawContent: string
		readOnlyMode: boolean
		renderedContent: unknown | null
		requesterId: PostId
		siteId: PostId
		source: 'DESKTOP_WEB_FEPO'
		tags: Tag[]
		title: string
		trendingScore: number
		upvoteCount: number
	}

	export interface DiscussionThreadContainer {
		_embedded: {
			contributors: Array<{
				count: 0
				userInfo: User[]
			}>
			forums: DiscussionForum[]
			threads: DiscussionThread[]
		}
	}

	export interface BaseDiscussionForum extends Resource {
		allowsThreads: boolean
		creatorId: PostId
		description: string | null
		displayOrder: number
		imageUrl: null
		isDeleted: boolean
		isEditable: boolean
		isLocked: boolean
		latestContribution: {
			author: number | null
			date: Date | null
			forumId: number | null
			item: ContainerTypes.Post | ContainerTypes.Reply | null
			itemId: number | null
			siteId: number | null
		}
		name: string
		parentId: '1'
		postCount: number
		recentContributors: User[]
		requesterId: PostId
		siteId: PostId
		threadCount: number
	}

	export interface DiscussionForum extends BaseDiscussionForum {
		description: null
		latestContribution: {
			[ K in keyof BaseDiscussionForum[ 'latestContribution' ] ]: NonNullable<BaseDiscussionForum[ 'latestContribution' ][ K ]>
		}
	}

	export interface DiscussionRootForum extends BaseDiscussionForum {
		_embedded: {
			'doc:forum': DiscussionForum[]
		}
		allowsThreads: false
		creatorId: '1'
		description: string
		displayOrder: 0
		id: '1'
		latestContribution: {
			[ K in keyof BaseDiscussionForum[ 'latestContribution' ] ]: null
		}
		name: 'Root Forum'
		postCount: 0
		recentContributors: []
		threadCount: 0
	}

	export interface DiscussionLeaderboard {
		days: number
		users: Array<{
			rank: number
			totalCount: number
			userInfo: User
		}>
	}

	export interface DiscussionReportLeaderboard extends DiscussionLeaderboard {
		users: Array<DiscussionLeaderboard[ 'users' ][ number ] & {
			actionBreakdown: {
				deleted: number
				queued: number
				validated: number
			}
		}>
	}

	export interface DiscussionPostList {
		contributors: [ {
			count: 0
			userInfo: User[]
		} ]
		count: [ {
			ARTICLE_COMMENT: number
			FORUM: number
			WALL: number
			total: number
		} ]
		'doc:posts': Array<DiscussionPost & {
			isReply: boolean
			threadCreatedBy: User
		}>
		wallOwners?: Array<{
			userId: PostId
			wallContainerId: PostId
		}>
	}

	export interface DiscussionPostListContainer {
		_embedded: DiscussionPostList
		postCount: PostId
		readOnlyMode: boolean
	}
}
