import 'mocha'
import assert from 'assert'
import { env } from './lib'
import { Wiki } from '../main'

describe( 'Controllers', () => {
	const wiki = new Wiki( {
		api: env.FANDOM_WIKI
	} )
	let wikiId = 0

	before( async function() {
		this.timeout( 5000 )
		await wiki.platform.login( env.FANDOM_USERNAME, env.FANDOM_PASSWORD )
		wikiId = await wiki.platform.getWikiId()
	} )

	describe( '#ArticleComments', () => {
		const controller = wiki.custom.wikia.ArticleComments

		const title = 'ArticleCommentsController'
		let articleId: string
		let replyId: string
		let rootCommentId: string
		let threadId: string

		it( '#postNewCommentThread', async () => {
			const comment = await controller.postNewCommentThread( {
				jsonModel: {
					content: [ {
						content: [ {
							text: 'This is a test.',
							type: 'text'
						} ],
						type: 'paragraph'
					} ],
					type: 'doc'
				},
				namespace: 0,
				title
			} )

			rootCommentId = comment.firstPost.id
			threadId = comment.id
			assert.strictEqual( comment.firstPost.createdBy.name, env.FANDOM_USERNAME )
		} )

		it( '#postNewCommentReply', async () => {
			const reply = await controller.postNewCommentReply( {
				jsonModel: {
					content: [ {
						content: [ {
							text: 'This is a reply.',
							type: 'text'
						} ],
						type: 'paragraph'
					} ],
					type: 'doc'
				},
				namespace: 0,
				threadId,
				title
			} )

			replyId = reply.reply.id
			assert.strictEqual( reply.reply.createdBy.name, env.FANDOM_USERNAME )
		} )

		it( '#getThread', async () => {
			const thread = await controller.getThread( threadId, title )
			articleId = thread.thread.containerId

			assert.strictEqual( thread.thread.id, threadId )
			assert.strictEqual( thread.thread.firstPost.id, rootCommentId )
			assert.strictEqual( thread.thread.posts.at( 0 )?.id, replyId )
		} )

		it( '#getArticleTitle', async () => {
			const article = await controller.getArticleTitle( articleId )

			assert.strictEqual( article, title )
		} )

		it( '#getCommentCount', async () => {
			const count = await controller.getCommentCount( title )
			if ( count <= 0 ) {
				assert.fail()
			}
		} )

		it( '#getComments', async () => {
			const comments = await controller.getComments( title )
			const thread = comments.threads.find( t => t.id === threadId )

			assert.strictEqual( thread?.firstPost.id, rootCommentId )
			assert.strictEqual( thread.posts.at( 0 )?.id, replyId )
		} )

		it( '#editComment', async () => {
			const editComment = await controller.editComment( {
				jsonModel: {
					content: [ {
						content: [ {
							text: 'Edited comment.',
							type: 'text'
						} ],
						type: 'paragraph'
					} ],
					type: 'doc'
				},
				namespace: 0,
				postId: rootCommentId,
				title
			} )
			const editReply = await controller.editComment( {
				jsonModel: {
					content: [ {
						content: [ {
							text: 'Edited reply.',
							type: 'text'
						} ],
						type: 'paragraph'
					} ],
					type: 'doc'
				},
				namespace: 0,
				postId: replyId,
				title
			} )

			assert.strictEqual( editComment.lastEditedBy.name, env.FANDOM_USERNAME )
			assert.strictEqual( editReply.lastEditedBy.name, env.FANDOM_USERNAME )
		} )

		it( '#reportPost', async () => {
			const reported = await controller.reportPost( {
				namespace: 0,
				postId: replyId,
				title
			} )

			assert.strictEqual( reported, true )
		} )

		it( '#deletePost', async () => {
			const deleted = await controller.deletePost( replyId )

			assert.strictEqual( deleted, true )
		} )

		it( '#undeletePost', async () => {
			const undeleted = await controller.undeletePost( replyId )

			assert.strictEqual( undeleted, true )
		} )

		after( async () => {
			await controller.deletePost( rootCommentId )
		} )
	} )

	describe( 'DiscussionContributionController', () => {
		const controller = wiki.custom.wikia.DiscussionContribution

		it( '#deleteAll', async () => {
			const result = await controller.deleteAll( 46509460 )

			assert.strictEqual( result.deletedBy.name, env.FANDOM_USERNAME )
		} )
	} )

	describe( 'DiscussionForumController', () => {
		beforeEach( function( done ) {
			this.timeout( 3000 )
			setTimeout( done, 2000 )
		} )

		const controller = wiki.custom.wikia.DiscussionForum
		const createdForums: Array<{
			id: `${ number }`
			name: string
		}> = []

		it( '#createForum', async () => {
			const names = [ 'Test forum', 'Placeholder' ]
			for ( const name of names ) {
				const forum = await controller.createForum( {
					name,
					siteId: wikiId
				} )

				createdForums.push( { id: forum.id, name } )
				assert.strictEqual( forum.siteId, `${ wikiId }` )
				assert.strictEqual( forum.name, name )
			}
		} )

		it( '#getForum', async () => {
			const forumData = createdForums.at( 0 )
			if ( !forumData ) {
				assert.fail()
			}

			const forum = await controller.getForum( forumData.id )

			assert.strictEqual( forum.name, forumData.name )
		} )

		it( '#updateForumDisplayOrder', async () => {
			const ids = createdForums.map( i => i.id ).reverse()
			const forums = await controller.getForums()
			const otherForums = forums._embedded[ 'doc:forum' ].map( i => i.id ).filter( i => !ids.includes( i ) )
			const forumIds = [ ...otherForums, ...ids ]
			const result = await controller.updateForumDisplayOrder( forumIds )

			for ( let i = 0; i < result.forumIds.length; i++ ) {
				assert.strictEqual( result.forumIds.at( i ), forumIds.at( i ) )
			}
		} )

		it( '#updateForum', async () => {
			const forumData = createdForums.at( 0 )
			if ( !forumData ) {
				assert.fail()
			}
			forumData.name = 'Re-placeholder'

			const forum = await controller.updateForum( {
				forumId: forumData.id,
				name: forumData.name
			} )

			assert.strictEqual( forum.id, forumData.id )
			assert.strictEqual( forum.name, forumData.name )
		} )

		it( '#getForums', async () => {
			const forums = await controller.getForums()
			for ( const forumData of createdForums ) {
				const forum = forums._embedded[ 'doc:forum' ].find( i => i.id === forumData.id )
				assert.strictEqual( forum?.name, forumData.name )
			}
		} )

		it( '#deleteForum', async () => {
			for ( const forum of createdForums ) {
				const removed = await controller.deleteForum( {
					forumId: forum.id,
					moveChildrenTo: `${ wikiId }`
				} )

				assert.strictEqual( removed, true )
			}
		} )
	} )

	describe( 'DiscussionLeaderboardController', () => {
		const controller = wiki.custom.wikia.DiscussionLeaderboard

		it( '#getModeratorActions', async () => {
			const actions = await controller.getModeratorActions()
			assert.strictEqual( actions.days, 30 )
		} )

		it( '#getPosts', async () => {
			const posts = await controller.getPosts()
			assert.strictEqual( posts.days, 30 )
		} )

		it( '#getReports', async () => {
			const reports = await controller.getReports()
			assert.strictEqual( reports.days, 30 )
		} )
	} )

	describe( 'DiscussionModerationController', () => {
		const controller = wiki.custom.wikia.DiscussionModerationController
		const discussionPost = wiki.custom.wikia.DiscussionThreadController
		const discussionReply = wiki.custom.wikia.DiscussionPostController

		let threadId: `${ number }`
		let replyId: `${ number }`

		before( async () => {
			const thread = await discussionPost.create( {
				body: 'Post used to test reports.',
				forumId: `${ wikiId }`,
				siteId: `${ wikiId }`,
				title: 'Report test'
			} )
			threadId = thread.id

			const reply = await discussionReply.create( {
				body: 'Test reply.',
				siteId: `${ wikiId }`,
				threadId
			} )
			replyId = reply.id
		} )

		it( '#reportPost', async () => {
			const reported = await controller.reportPost( replyId )
			assert.strictEqual( reported, true )
		} )

		it( '#getReportedPosts', async () => {
			const reports = await controller.getReportedPosts()
			
			const reply = reports._embedded['doc:posts'].find( i => i.id === replyId )
			assert.strictEqual( reply?.createdBy.name, env.FANDOM_USERNAME )
		} )

		it( '#getPostListReports', async () => {
			const reports = await controller.getPostListReports( replyId )
			const ownReport = reports.posts[0]?.userInfo.find( i => i.name === env.FANDOM_USERNAME )
			assert.strictEqual( ownReport?.name, env.FANDOM_USERNAME )
		} )

		it( '#validatePostReport', async () => {
			const validated = await controller.validatePostReport( replyId )
			assert.strictEqual( validated, true )
		} )

		after( async () => {
			await discussionPost.delete( threadId )
		} )
	} )

	describe( 'DiscussionPermalinkController', () => {
		const controller = wiki.custom.wikia.DiscussionPermalinkController
		const discussionThread = wiki.custom.wikia.DiscussionThreadController
		let postId: `${ number }`
		let threadId: `${ number }`

		before( async () => {
			const thread = await discussionThread.create( {
				body: 'Post used to test permalinks.',
				forumId: `${ wikiId }`,
				siteId: `${ wikiId }`,
				title: 'Permalink test'
			} )
			postId = thread.firstPostId
			threadId = thread.id
		} )

		it( '#getThreadByPostId', async () => {
			const thread = await controller.getThreadByPostId( postId )
			assert.strictEqual( thread.firstPostId, postId )
		} )

		after( async () => {
			await discussionThread.delete( threadId )
		} )
	} )

	describe( 'DiscussionPostController', () => {
		const controller = wiki.custom.wikia.DiscussionPostController
		const discussionThread = wiki.custom.wikia.DiscussionThreadController
		let replyId: `${ number }`
		let threadId: `${ number }`

		before( async () => {
			const thread = await discussionThread.create( {
				body: 'Post used to test replies.',
				forumId: `${ wikiId }`,
				siteId: `${ wikiId }`,
				title: 'Reply test'
			} )
			threadId = thread.id
		} )

		it( '#create', async () => {
			const reply = await controller.create( {
				body: `This is a test reply.`,
				siteId: `${ wikiId }`,
				threadId
			} )
			replyId = reply.id
			assert.strictEqual( reply.createdBy.name, env.FANDOM_USERNAME )
		} )

		it( '#update', async () => {
			const reply = await controller.update( replyId, {
				body: 'This is an edited reply',
				threadId
			} )
			assert.strictEqual( reply.createdBy.name, env.FANDOM_USERNAME )
		} )

		it( '#getPost', async () => {
			const reply = await controller.getPost( replyId )
			assert.strictEqual( reply.rawContent, 'This is an edited reply' )
		} )

		it( '#getPosts', async () => {
			await controller.getPosts()
		} )

		it( '#delete', async () => {
			const reply = await controller.delete( replyId )
			assert.strictEqual( reply.id, replyId )
		} )

		it( '#undelete', async () => {
			const reply = await controller.undelete( replyId )
			assert.strictEqual( reply.id, replyId )
		} )

		after( async () => {
			await discussionThread.delete( threadId )
		} )
	} )

	describe( 'DiscussionThreadController', () => {
		const controller = wiki.custom.wikia.DiscussionThreadController
		let threadId: `${ number }`

		it( '#create', async () => {
			const thread = await controller.create( {
				body: `Post used to test threads.`,
				forumId: `${ wikiId }`,
				siteId: `${ wikiId }`,
				title: 'Thread test'
			} )
			threadId = thread.id

			assert.strictEqual( thread.createdBy.name, env.FANDOM_USERNAME )
		} )

		it( '#update', async () => {
			const thread = await controller.update( {
				body: `Edited thread`,
				forumId: `${ wikiId }`,
				title: `Edited thread test`,
				threadId: threadId
			} )

			assert.strictEqual( thread.createdBy.name, env.FANDOM_USERNAME )
		} )

		it( '#lock', async () => {
			const locked = await controller.lock( threadId )

			assert.strictEqual( locked, true )
		} )

		it( '#getThread', async () => {
			const thread = await controller.getThread( threadId )

			assert.strictEqual( thread.isLocked, true )
		} )

		it( '#unlock', async () => {
			const unlocked = await controller.unlock( threadId )

			assert.strictEqual( unlocked, true )
		} )

		after( async () => {
			await controller.delete( threadId )
		} )
	} )

	describe.only( 'MessageWallController', () => {
		const controller = wiki.custom.wikia.MessageWallController
		let postId: `${ number }`
		let threadId: `${ number }`
		let userId: number

		before( async () => {
			const id = await wiki.platform.getUserId( env.FANDOM_USERNAME )
			if ( id ) {
				userId = id
			} else {
				assert.fail()
			}
		} )

		it( '#createThread', async () => {
			const thread = await controller.createThread( {
				jsonModel: {
					content: [ {
						content: [ {
							text: 'This is a message wall test.',
							type: 'text'
						} ],
						type: 'paragraoh'
					} ],
					type: 'doc'
				},
				title: 'Message Wall test',
				wallOwnerId: `${ userId }`
			} )
			postId = thread.firstPostId
			threadId = thread.id

			assert.strictEqual( thread.createdBy.name, env.FANDOM_USERNAME )
		} )

		after( '#deleteReply', async () => {
			await controller.deleteReply( {
				postId,
				wallOwnerId: `${ userId }`
			} )
		} )
	} )
} )