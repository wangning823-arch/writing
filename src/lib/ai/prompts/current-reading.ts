export function getCurrentReadingPrompt(subject: 'chinese' | 'english') {
  const lang = subject === 'chinese' ? '中文' : 'English'

  return {
    system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}时文推荐专家。
请推荐5篇适合高中生阅读的近期时文（新闻评论、社会观察、文化评论等）。
返回 JSON 格式：
{
  "weekStart": "YYYY-MM-DD",
  "articles": [
    {
      "title": "文章标题",
      "source": "来源媒体",
      "summary": "50-100字摘要",
      "tags": ["标签1", "标签2"]
    }
  ]
}

要求：
1. 文章内容积极向上，适合高中生阅读
2. 涉及社会热点、文化现象、科技发展等多个领域
3. 有助于积累写作素材和拓展视野`,
    user: `请用${lang}推荐本周适合高中生阅读的5篇时文。`,
  }
}
