'use client'

import { useState } from 'react'

interface WritingTipProps {
  subject: 'chinese' | 'english'
  level: number
}

interface TipContent {
  title: string
  items: string[]
  example?: string
}

function getTip(subject: 'chinese' | 'english', level: number): TipContent | null {
  if (subject === 'chinese') {
    switch (level) {
      case 1:
        return {
          title: '审题三步法',
          items: [
            '第一步：提取关键词 — 找出题目中的核心概念、限制词和情感词',
            '第二步：识别矛盾 — 题目中是否有对立面？如"传统与创新""个人与集体"',
            '第三步：多角度思考 — 从不同主体、不同层面寻找立意角度',
          ],
          example: '例："面对挫折"——关键词：面对、挫折；矛盾面：消极逃避 vs 积极应对；立意角度：个人成长、社会意义、哲学思辨',
        }
      case 2:
        return {
          title: '提纲编写四问',
          items: [
            '第一问：核心论点是什么？（一句话概括全文主旨）',
            '第二问：分论点有哪些？（通常2-3个，形成递进或并列）',
            '第三问：每个分论点用什么论据？（事例、道理、数据）',
            '第四问：段落之间如何衔接？（过渡词、逻辑连接）',
          ],
          example: '例：中心论点"奋斗是青春底色"→分论点1"奋斗磨砺意志"→分论点2"奋斗实现价值"→分论点3"奋斗引领时代"',
        }
      case 3:
      case 4:
      case 5:
      case 6:
        return {
          title: '论证段展开公式',
          items: [
            '论点句：段首明确表达分论点（一句话）',
            '论据：选择典型的事例或名言（具体、有说服力）',
            '分析：对论据进行深入解读，回扣论点（最易缺少的部分）',
            '小结：段尾呼应论点，形成闭环',
          ],
          example: '论点句→"历史证明，勇于创新是推动文明进步的关键"→论据（商鞅变法事例）→分析（变法打破旧制，激发社会活力）→小结（正是这种创新精神，铸就了秦国的强盛）',
        }
      case 7:
        return {
          title: '修改四步法',
          items: [
            '第一步：逻辑检查 — 论点之间是否递进？论据是否支撑论点？',
            '第二步：结构检查 — 段落比例是否合理？首尾是否呼应？',
            '第三步：语言检查 — 有无病句、口语化表达？用词是否准确？',
            '第四步：规范检查 — 错别字、标点、格式是否正确？',
          ],
          example: '修改时重点关注：删除与论点无关的句子、补充必要的分析段、替换口语化表达为书面语',
        }
      default:
        return null
    }
  }

  // English
  switch (level) {
    case 1:
      return {
        title: '句式升级要点',
        items: [
          '倒装句：Only when... / Not only...but also... / Never have I...',
          '强调句：It is/was...that/who... 强调关键信息',
          '分词结构：Using/Virtual as... 使句子更简洁紧凑',
          '虚拟语气：If I were... / I wish... 表达假设或愿望',
        ],
        example: '原句：We should protect the environment. 升级：Only by taking immediate action can we protect the environment for future generations.',
      }
    case 2:
    case 3:
    case 4:
      return {
        title: 'PEEL结构',
        items: [
          'Point（论点）：段首用一句话明确表达你的观点',
          'Evidence（论据）：给出具体的事例、数据或引用',
          'Explanation（解释）：分析论据如何支撑论点',
          'Link（衔接）：回应段首论点，或过渡到下一段',
        ],
        example: 'Point: Regular exercise is essential for mental health. Evidence: Studies show... Explanation: This is because... Link: Therefore, incorporating...',
      }
    case 5:
      return {
        title: '语法检查清单',
        items: [
          '主谓一致：主语是单数还是复数？谓语动词是否匹配？',
          '时态一致：全文时态是否统一？有无不必要的时态切换？',
          '冠词使用：a/an/the 是否正确？有无漏用或误用？',
          '介词搭配：动词/形容词后的介词是否正确？',
        ],
        example: '常见错误：He go to school every day. → He goes to school every day.（第三人称单数主谓一致）',
      }
    case 6:
      return {
        title: '全文检查清单',
        items: [
          '内容完整：是否回应了所有题目要求？观点是否有论据支撑？',
          '结构清晰：开头是否引出话题？中间段是否有逻辑递进？结尾是否总结？',
          '语言多样：是否使用了多种句式？有无高级词汇或表达？',
          '书写规范：拼写、标点、大小写、段落缩进是否正确？',
        ],
        example: '检查顺序：先通读全文确认内容 → 逐段检查逻辑 → 逐句检查语法 → 最后检查拼写和标点',
      }
    default:
      return null
  }
}

export default function WritingTip({ subject, level }: WritingTipProps) {
  const [expanded, setExpanded] = useState(false)
  const tip = getTip(subject, level)

  if (!tip) return null

  return (
    <div className="writing-tip">
      <div
        className="writing-tip-header"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded) }}
      >
        <span className="writing-tip-title">
          <span style={{ fontSize: '1rem' }}>&#128161;</span>
          {tip.title}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          &#9660;
        </span>
      </div>
      {expanded && (
        <div className="writing-tip-body">
          <ol>
            {tip.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
          {tip.example && (
            <div className="writing-tip-example">
              {tip.example}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
