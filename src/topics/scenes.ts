import type { Scene } from '@/types'

export const scenes: Scene[] = [
  {
    id: 'dinner',
    name: '聚餐饭局',
    emoji: '🍜',
    description: '朋友聚餐、同事饭局必备话题，轻松破冰不冷场',
    gradient: 'from-orange-400 to-red-400',
    topics: [
      { type: 'gossip', content: '最近吃到最离谱的瓜是什么？' },
      { type: 'recommend', content: '这家餐厅你最推荐哪道菜？' },
      { type: 'silly', content: '你吃过最奇葩的食物组合是什么？' },
      { type: 'trouble', content: '最近有没有什么让你哭笑不得的事？' },
      { type: 'music', content: '吃饭时必听的一首歌是什么？' },
      { type: 'gossip', content: '有没有什么事是你爸妈不知道的？' }
    ]
  },
  {
    id: 'camping',
    name: '露营野炊',
    emoji: '⛺️',
    description: '星空下的真心话，适合户外露营、烧烤派对',
    gradient: 'from-green-400 to-teal-500',
    topics: [
      { type: 'deep', content: '如果可以在星空下许一个愿，你会许什么？' },
      { type: 'silly', content: '你有过什么特别糗的户外经历？' },
      { type: 'trouble', content: '有没有什么事让你至今想起来还后怕？' },
      { type: 'recommend', content: '你最想安利的露营装备是什么？' },
      { type: 'deep', content: '你觉得最能治愈你的大自然场景是什么？' },
      { type: 'music', content: '露营时必听的一首歌是什么？' }
    ]
  },
  {
    id: 'birthday',
    name: '生日派对',
    emoji: '🎂',
    description: '寿星专场，温馨又有趣的生日专属话题',
    gradient: 'from-pink-400 to-rose-500',
    topics: [
      { type: 'deep', content: '今年最想感谢的人是谁？' },
      { type: 'silly', content: '你收到过最奇葩的生日礼物是什么？' },
      { type: 'music', content: '想对寿星说的一句心里话是什么？' },
      { type: 'recommend', content: '推荐一个寿星一定会喜欢的东西' },
      { type: 'gossip', content: '寿星有什么不为人知的小秘密？' },
      { type: 'deep', content: '下一年最想达成的一个目标是什么？' }
    ]
  },
  {
    id: 'roadTrip',
    name: '自驾旅行',
    emoji: '🚗',
    description: '公路旅行必备，让漫长车程充满欢声笑语',
    gradient: 'from-blue-400 to-indigo-500',
    topics: [
      { type: 'silly', content: '你旅途中做过最疯狂的事是什么？' },
      { type: 'recommend', content: '你去过最值得推荐的地方是哪里？' },
      { type: 'deep', content: '有没有哪次旅行改变了你的想法？' },
      { type: 'trouble', content: '旅行中遇到过最大的乌龙是什么？' },
      { type: 'music', content: '自驾路上必循环的歌单榜首是？' },
      { type: 'gossip', content: '旅行中认识过什么有意思的人？' }
    ]
  },
  {
    id: 'date',
    name: '约会之夜',
    emoji: '💕',
    description: '情侣约会、暧昧期升温必备，甜蜜不尴尬',
    gradient: 'from-rose-400 to-pink-500',
    topics: [
      { type: 'deep', content: '你对我们第一次见面的印象是什么？' },
      { type: 'silly', content: '你在喜欢的人面前做过最糗的事是什么？' },
      { type: 'music', content: '有没有一首歌会让你想起我？' },
      { type: 'deep', content: '你理想中的完美约会是什么样的？' },
      { type: 'recommend', content: '你最想带我去的地方是哪里？' },
      { type: 'gossip', content: '你暗恋我的时候有过什么小心思？' }
    ]
  },
  {
    id: 'reunion',
    name: '老友重聚',
    emoji: '👯',
    description: '老同学、老朋友聚会，回忆杀满满',
    gradient: 'from-amber-400 to-orange-500',
    topics: [
      { type: 'deep', content: '这么多年，你觉得我变了吗？' },
      { type: 'silly', content: '还记得我们一起干过最傻的事吗？' },
      { type: 'gossip', content: '当年的那些同学，你还和谁有联系？' },
      { type: 'music', content: '有没有一首歌能瞬间把我们拉回过去？' },
      { type: 'trouble', content: '这些年有没有什么事你一直没告诉我？' },
      { type: 'deep', content: '你觉得我们这段友谊最珍贵的是什么？' }
    ]
  }
]

export function getSceneById(id: string): Scene | undefined {
  return scenes.find(s => s.id === id)
}

export function getSceneTopics(id: string): Scene['topics'] {
  const scene = getSceneById(id)
  return scene?.topics || []
}
