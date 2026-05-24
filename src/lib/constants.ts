// 阶段元数据
export const STAGE_META: Record<string, { label: string; color: string; icon: string }> = {
  sprout: { label: '萌芽期', color: '#22c55e', icon: '🌱' },
  growing: { label: '成长期', color: '#f59e0b', icon: '🌿' },
  thriving: { label: '绽放期', color: '#1b61c9', icon: '🌳' },
}

// 年级标签
export const GRADE_LABELS: Record<string, string> = {
  '高一': '高一',
  '高二': '高二',
  '高三': '高三',
}

// 年级对应的级别标题
export const GRADE_HEADERS: Record<string, string> = {
  '高一': '高一写作训练',
  '高二': '高二写作训练',
  '高三': '高三写作训练',
}

// 中文关卡名称
export const CHINESE_LEVEL_NAMES: Record<number, string> = {
  1: '审题立意', 2: '段落功能卡', 3: '开头段专项', 4: '论证段专项',
  5: '过渡段专项', 6: '结尾段专项', 7: '全文整合',
}

// 英文关卡名称
export const ENGLISH_LEVEL_NAMES: Record<number, string> = {
  1: '句式仿写', 2: '段落骨架', 3: '应用文格式', 4: '读后续写开头',
  5: '语法纠错', 6: '全文写作',
}

// 关卡图标
export const LEVEL_ICONS: Record<number, string> = {
  1: '📝', 2: '🃏', 3: '📖', 4: '💡', 5: '🔄', 6: '✨', 7: '📚',
}
