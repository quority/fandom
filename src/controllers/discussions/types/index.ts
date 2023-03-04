export interface CreationDate {
	epochSecond: number
	nano: number
}

export interface ArticleCommentsBody {
	containerId: `${ number }`
	creationDate: CreationDate
	firstPost: {
		attachments: {
			atMentions: unknown[]
			contentImages: unknown[]
			openGraphs: unknown[]
			polls: unknown[]
			quizzes: unknown[]
		}
		createdBy: {
			avatarUrl: string
			badgePermission: string
			id: `${ number }`
			name: string
		}
		creationDate: {
			epochSecond: number
			nano: number
		}
		id: `${ number }`
		jsonModel: string
		upvoteCount: number
		userData: {
			hasUpvoted: boolean
			isReported: boolean
			permissions: {
				canEdit: boolean
				canDelete: boolean
			}
			postId: number
		}
	}
	followed: boolean
	id: `${ number }`
	postId: `${ number }`
	posts: Array<ArticleCommentsBody[ 'firstPost' ]>
	readOnlyMode: boolean
}

export interface ArticleCommentsReply {
	followed: boolean
	reply: ArticleCommentsBody[ 'firstPost' ]
	threadId: `${ number }`
}

export interface ArticleCommentsThread {
	thread: ArticleCommentsBody
	reportedData: {
		posts: unknown[]
	}
}

export interface ArticleCommentsResponse {
	links: unknown[]
	readOnlyMode: boolean
	reportedData: {
		posts: unknown[]
	}
	threads: ArticleCommentsBody[]
	totalCount: number
}

export type ArticleCommentsEdited = ArticleCommentsBody[ 'firstPost' ] & {
	lastEditedBy: {
		avatarUrl: string
		badgePermission: string
		id: `${ number }`
		name: string
	}
}

export interface DiscussionPost {
	_embedded: {
		attachments: Array<{
			atMentions: unknown[]
			contentImages: unknown[]
			openGraphs: unknown[]
			polls: unknown[]
			quizzes: unknown[]
		}>
		contentImages: unknown[]
		userData: Array<{
			hasReported: boolean
			hasUpvoted: boolean
			permissions: string[]
		}>
	}
	createdBy: {
		avatarUrl: string
		badgePermission: string
		id: `${ number }`
		name: string
	}
	creationDate: CreationDate
	creatorId: `${ number }`
	creatorIp: string
	id: `${ number }`
	isDeleted: boolean
	isEditable: boolean
	isLocked: boolean
	isReported: boolean
	jsonModel: unknown | null
	latestRevisionId: `${ number }`
	modificationDate: CreationDate | null
	position: number
	rawContent: string
	renderedContent: unknown | null
	requesterId: `${ number }`
	siteId: `${ number }`
	threadId: `${ number }`
	title: string
	upvoteCount: number
}

export interface DiscussionThreadBody {
	_embedded: {
		contentImages: unknown[]
		attachments: Array<{
			atMentions: unknown[]
			contentImages: unknown[]
			openGraphs: unknown[]
			polls: unknown[]
			quizzes: unknown[]
		}>
		firstPost: DiscussionPost[]
		userData: Array<{
			hasReported: boolean
			hasUpvoted: boolean
			permissions: string[]
		}>
	}
	createdBy: {
		avatarUrl: string
		badgePermission: string
		id: `${ number }`
		name: string
	}
	creationDate: CreationDate
	firstPostId: `${ number }`
	forumId: `${ number }`
	forumName: string
	funnel: string
	id: `${ number }`
	isDeleted: boolean
	isEditable: boolean
	isFollowed: boolean
	isLocked: boolean
	isReported: boolean
	jsonModel: unknown | null
	lastPostId: `${ number }`
	latestRevisionId: `${ number }`
	modificationDate: CreationDate
	postCount: number
	rawContent: string
	renderedContent: unknown | null
	requesterId: `${ number }`
	siteId: `${ number }`
	source: string
	tags: unknown | null
	title: string
	trendingScore: number
	upvoteCount: number
}

export interface DiscussionForumBody {
	_embedded: {
		contributors: Array<{
			count: number
			userInfo: Array<{
				avatarUrl: string
				badgePermission: string
				id: `${ number }`
				name: string
			}>
		}>
		'doc:threads': DiscussionThreadBody[]
	}
	allowsThreads: boolean
	creationDate: CreationDate
	creatorId: `${ number }`
	description: string | null
	displayOrder: number
	id: `${ number }`
	imageUrl: string | null
	isDeleted: boolean
	isEditable: boolean
	isLocked: boolean
	latestContribution: {
		author: number | null
		date: CreationDate | null
		item: string | null
		itemId: number | null
		forumId: number | null
		siteId: number | null
	} | null
	name: string
	parentId: '1'
	postCount: 0
	recentContributors: Array<{
		avatarUrl: string
		badgePermission: string
		id: `${ number }`
		name: string
	}> | null
	requesterId: `${ number }`
	siteId: `${ number }`
	threadCount: 0
}

export interface DiscussionForums extends Omit<DiscussionForumBody, '_embedded'> {
	_embedded: {
		'doc:forum': Array<Omit<DiscussionForumBody, '_embedded'>>
	}
}

export interface DiscussionLeaderboard {
	days: number
	users: Array<{
		rank: number
		totalCount: number
		userInfo: {
			avatarUrl: string
			badgePermission: string
			id: `${ number }`
			name: string
		}
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

export interface DiscussionReportedPosts {
	_embedded: {
		count: [ {
			ARTICLE_COMMENT: number
			FORUM: number
			WALL: number
			total: number
		} ]
		contributors: [ {
			count: number
			userInfo: Array<{
				avatarUrl: string
				badgePermission: string
				id: `${ number }`
				name: string
			}>
		} ]
		'doc:posts': Array<{
			_embedded: {
				attachments: [ {
					atMentions: unknown[]
					contentImages: unknown[]
					openGraphs: unknown[]
					polls: unknown[]
					quizzes: unknown[]
				} ]
				contentImages: unknown[]
				latestRevision: [ {
					creationDate: CreationDate
					creatorId: `${ number }`
					creatorIp: string
					id: `${ number }`
					jsonModel: unknown | null
					postId: `${ number }`
					rawContent: string
					renderedContent: unknown | null
				} ]
				thread: [ {
					containerId: `${ number }`
					containerType: string
					creatorId: `${ number }`
					firstPost: DiscussionPost
					isDeleted: boolean
					isEditable: boolean
					isLocked: boolean
					isReported: boolean
					postCount: `${ number }`
					tags: unknown[]
					title: string
				} ]
				userData: [ {
					hasReported: boolean
					hasUpvoted: boolean
					permissions: string[]
				} ]
			}
			createdBy: {
				avatarUrl: string
				badgePermission: string
				id: `${ number }`
				name: string
			}
			creationDate: CreationDate
			creatorId: `${ number }`
			creatorIp: string
			forumId: `${ number }`
			forumName: string
			id: `${ number }`
			isDeleted: boolean
			isEditable: boolean
			isLocked: boolean
			isReply: boolean
			isReported: boolean
			jsonModel: unknown | null
			latestRevisionId: `${ number }`
			modificationDate: CreationDate | null
			position: number
			rawContent: string
			renderedContent: unknown | null
			requesterId: `${ number }`
			siteId: `${ number }`
			threadCreatedBy: {
				avatarUrl: string
				badgePermission: string
				id: `${ number }`
				name: string
			}
			threadId: `${ number }`
			title: string | null
			upvoteCount: number
		}>
		wallOwners: Array<{
			userId: `${ number }`
			wallContainerId: `${ number }`
		}>
	}
	postCount: `${ number }`
	readOnlyMode: boolean
}

export interface DiscussionPostReports {
	posts: [] | [ {
		containerType: string
		count: number
		postId: `${ number }`
		userInfo: Array<{
			avatarUrl: string
			badgePermission: string
			id: `${ number }`
			name: string
		}>
	} ]
}

export interface DiscussionReply {
	_embedded: {
		attachments: [ {
			atMentions: unknown[]
			contentImages: unknown[]
			openGraphs: unknown[]
			polls: unknown[]
			quizzes: unknown[]
		} ]
		contentImages: unknown[]
		openGraph: unknown[]
		userData: [ {
			hasReported: boolean
			hasUpvoted: boolean
			permissions: string[]
		} ]
	}
	createdBy: {
		avatarUrl: string
		badgePermission: string
		id: `${ number }`
		name: string
	}
	createdIp: string
	creationDate: CreationDate
	creatorId: `${ number }`
	id: `${ number }`
	isDeleted: boolean
	isEditable: boolean
	isLocked: boolean
	isReported: boolean
	latestRevisionId: `${ number }`
	position: number
	rawContent: string
	requesterId: `${ number }`
	siteId: `${ number }`
	threadId: `${ number }`
	upvoteCount: number
}

export interface DiscussionPostList {
	_embedded: DiscussionReportedPosts[ '_embedded' ]
	postCount: `${ number }`
	readOnlyMode: boolean
}

export interface DiscussionThreadList {
	_embedded: {
		contributors: Array<{
			count: number
			userInfo: Array<{
				avatarUrl: string
				badgePermission: string
				id: `${ number }`
				name: string
			}>
		}>
		forums: DiscussionForumBody[]
		threads: DiscussionThreadBody[]
	}
	readOnlyMode: boolean
	requesterId: `${ number }`
	postCount: number
	siteId: number
	threadCount: number
}
