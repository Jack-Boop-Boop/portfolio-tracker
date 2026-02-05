import { useState, useEffect } from 'react'
import { ArrowBigUp, MessageCircle, ExternalLink } from 'lucide-react'
import { Portfolio, RedditPost } from '../../types'
import { api } from '../../services/api'

interface RedditFeedProps {
  portfolio: Portfolio
  trackedNames: string[]
}

// Mock Reddit data
const MOCK_REDDIT: RedditPost[] = [
  {
    id: '1',
    title: 'Nancy Pelosi just disclosed another NVDA purchase - thoughts?',
    subreddit: 'wallstreetbets',
    author: 'diamond_hands_42',
    score: 2547,
    num_comments: 432,
    url: '#',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    sentiment: 'positive',
  },
  {
    id: '2',
    title: 'Congressional trading tracker shows unusual activity',
    subreddit: 'stocks',
    author: 'market_researcher',
    score: 1823,
    num_comments: 267,
    url: '#',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    sentiment: 'neutral',
  },
  {
    id: '3',
    title: 'Following congress trades - my 6 month results',
    subreddit: 'investing',
    author: 'value_investor_99',
    score: 956,
    num_comments: 189,
    url: '#',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    sentiment: 'positive',
  },
  {
    id: '4',
    title: 'Why insider trading laws dont apply to congress',
    subreddit: 'politics',
    author: 'concerned_citizen',
    score: 4521,
    num_comments: 892,
    url: '#',
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    sentiment: 'negative',
  },
]

export default function RedditFeed({ portfolio, trackedNames }: RedditFeedProps) {
  const [posts, setPosts] = useState<RedditPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      if (trackedNames.length === 0) {
        setPosts(MOCK_REDDIT)
        setLoading(false)
        return
      }

      try {
        const data = await api.getRedditPosts(trackedNames[0], 10)
        setPosts(data.length > 0 ? data : MOCK_REDDIT)
      } catch (error) {
        setPosts(MOCK_REDDIT)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [trackedNames])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    return `${Math.floor(diffHours / 24)}d`
  }

  const formatScore = (score: number) => {
    if (score >= 1000) return `${(score / 1000).toFixed(1)}k`
    return score.toString()
  }

  const getSentimentDot = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-positive'
      case 'negative':
        return 'bg-negative'
      default:
        return 'bg-warning'
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading Reddit...</div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto space-y-2">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 bg-terminal-bg rounded-lg hover:bg-terminal-hover
                   transition-colors group"
        >
          <div className="flex gap-3">
            {/* Score */}
            <div className="flex flex-col items-center text-text-muted">
              <ArrowBigUp className="w-5 h-5 text-accent-primary" />
              <span className="text-xs font-medium">{formatScore(post.score)}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-accent-secondary">
                  r/{post.subreddit}
                </span>
                <span className="text-text-muted text-xs">·</span>
                <span className="text-xs text-text-muted">u/{post.author}</span>
                <span className="text-text-muted text-xs">·</span>
                <span className="text-xs text-text-muted">{formatTime(post.created_at)}</span>
                <div className={`w-2 h-2 rounded-full ${getSentimentDot(post.sentiment)}`} />
              </div>

              <h4 className="text-sm text-text-primary group-hover:text-accent-primary
                           transition-colors line-clamp-2">
                {post.title}
              </h4>

              <div className="flex items-center gap-3 mt-2 text-text-muted">
                <span className="flex items-center gap-1 text-xs">
                  <MessageCircle className="w-3 h-3" />
                  {post.num_comments}
                </span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </a>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          No Reddit posts found
        </div>
      )}
    </div>
  )
}
