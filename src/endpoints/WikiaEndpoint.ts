import { ArticleCommentsController, DiscussionContributionController, DiscussionForumController, DiscussionLeaderboardController, DiscussionModerationController, DiscussionPermalinkController, DiscussionPollController, DiscussionPostController, DiscussionThreadController, DiscussionVoteController, FeedsAndPostsController, MessageWallController } from '../controllers'
import { BaseEndpoint, type Wiki } from '@wikiscript/core'
import type { Fandom } from '../strategies'

export class WikiaEndpoint extends BaseEndpoint<Fandom> {
	public readonly ArticleComments: ArticleCommentsController
	public readonly DiscussionContribution: DiscussionContributionController
	public readonly DiscussionForum: DiscussionForumController
	public readonly DiscussionLeaderboard: DiscussionLeaderboardController
	public readonly DiscussionModerationController: DiscussionModerationController
	public readonly DiscussionPermalinkController: DiscussionPermalinkController
	public readonly DiscussionPollController: DiscussionPollController
	public readonly DiscussionPostController: DiscussionPostController
	public readonly DiscussionThreadController: DiscussionThreadController
	public readonly DiscussionVoteController: DiscussionVoteController
	public readonly FeedsAndPostsController: FeedsAndPostsController
	public readonly MessageWallController: MessageWallController

	public constructor( wiki: Wiki<Fandom> ) {
		super( wiki, new URL( 'wikia.php', wiki.api ) )

		this.ArticleComments = new ArticleCommentsController( this )
		this.DiscussionContribution = new DiscussionContributionController( this )
		this.DiscussionForum = new DiscussionForumController( this )
		this.DiscussionLeaderboard = new DiscussionLeaderboardController( this )
		this.DiscussionModerationController = new DiscussionModerationController( this )
		this.DiscussionPermalinkController = new DiscussionPermalinkController( this )
		this.DiscussionPollController = new DiscussionPollController( this )
		this.DiscussionPostController = new DiscussionPostController( this )
		this.DiscussionThreadController = new DiscussionThreadController( this )
		this.DiscussionVoteController = new DiscussionVoteController( this )
		this.FeedsAndPostsController = new FeedsAndPostsController( this )
		this.MessageWallController = new MessageWallController( this )
	}

}
