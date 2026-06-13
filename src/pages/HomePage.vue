<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoom } from '@/composables/useRoom'
import { useExpire } from '@/composables/useExpire'
import RoomCard from '@/components/RoomCard.vue'
import { copyToClipboard } from '@/utils/helpers'
import { scenes } from '@/topics'
import type { Scene } from '@/types'
import { TOPIC_COLORS } from '@/types'

const router = useRouter()
const { activeRooms, createRoom, joinRoomByCode, error, loadRooms } = useRoom()
const { checkAndCleanExpiredRooms } = useExpire()

const showCreateModal = ref(false)
const showJoinModal = ref(false)
const roomName = ref('')
const hostName = ref('')
const joinCode = ref('')
const joinName = ref('')
const copySuccess = ref(false)
const selectedSceneId = ref<string | null>(null)

const selectedScene = computed((): Scene | undefined => {
  if (!selectedSceneId.value) return undefined
  return scenes.find(s => s.id === selectedSceneId.value)
})

onMounted(() => {
  loadRooms()
  checkAndCleanExpiredRooms()
})

const handleCreateRoom = () => {
  if (!roomName.value.trim() || !hostName.value.trim()) return
  
  const room = createRoom(
    roomName.value.trim(), 
    hostName.value.trim(),
    selectedSceneId.value || undefined
  )
  
  copyToClipboard(room.code).then(() => {
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  })
  
  showCreateModal.value = false
  router.push(`/room/${room.id}`)
}

const selectScene = (sceneId: string) => {
  selectedSceneId.value = selectedSceneId.value === sceneId ? null : sceneId
}

const handleJoinRoom = () => {
  if (!joinCode.value.trim() || !joinName.value.trim()) return
  
  const room = joinRoomByCode(joinCode.value.trim(), joinName.value.trim())
  if (room) {
    showJoinModal.value = false
    router.push(`/room/${room.id}`)
  }
}

const goToRoom = (roomId: string) => {
  router.push(`/room/${roomId}`)
}

const closeModals = () => {
  showCreateModal.value = false
  showJoinModal.value = false
  error.value = null
  roomName.value = ''
  hostName.value = ''
  joinCode.value = ''
  joinName.value = ''
  selectedSceneId.value = null
}
</script>

<template>
  <div class="home-page min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <header class="text-center mb-12">
        <div class="inline-flex items-center gap-3 mb-4">
          <span class="text-5xl">🎒</span>
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            聚会话题保鲜袋
          </h1>
        </div>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          提前把话题丢进保鲜袋，聚会时轮流翻牌，再也不怕冷场啦！
          <br>
          <span class="text-sm text-gray-500">话题保留 7 天后自动过期消失哦～</span>
        </p>
      </header>

      <div class="flex flex-wrap justify-center gap-4 mb-10">
        <button 
          class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
          @click="showCreateModal = true"
        >
          <span class="text-xl">✨</span>
          创建新房间
        </button>
        <button 
          class="px-8 py-3 bg-white text-gray-700 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2 border border-gray-200"
          @click="showJoinModal = true"
        >
          <span class="text-xl">🚪</span>
          加入房间
        </button>
      </div>

      <div v-if="activeRooms.length > 0" class="mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span> 我的房间
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RoomCard 
            v-for="room in activeRooms" 
            :key="room.id" 
            :room="room"
            @click="goToRoom(room.id)"
          />
        </div>
      </div>

      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">🎉</div>
        <p class="text-gray-500 text-lg">还没有房间，创建一个开始聚会吧！</p>
      </div>

      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-2xl p-6 shadow-md">
          <div class="text-3xl mb-3">📝</div>
          <h3 class="font-bold text-gray-800 mb-2">提前丢话题</h3>
          <p class="text-gray-600 text-sm">
            烦心事、安利的歌、八卦、求推荐...想聊什么丢什么
          </p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-md">
          <div class="text-3xl mb-3">🎴</div>
          <h3 class="font-bold text-gray-800 mb-2">洗牌翻牌</h3>
          <p class="text-gray-600 text-sm">
            聚会开始随机洗牌，轮流翻牌，必须聊或真心话
          </p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-md">
          <div class="text-3xl mb-3">🆘</div>
          <h3 class="font-bold text-gray-800 mb-2">急救功能</h3>
          <p class="text-gray-600 text-sm">
            冷场了？点急救，从没翻过的话题里抽一个救场
          </p>
        </div>
      </div>
    </div>

    <div 
      v-if="showCreateModal || showJoinModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeModals"
    >
      <div 
        class="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all"
        :class="{ 'scale-100': showCreateModal || showJoinModal }"
      >
        <div v-if="showCreateModal">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            ✨ 创建新房间
          </h2>
          
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                房间名称
              </label>
              <input 
                v-model="roomName"
                type="text" 
                placeholder="比如：周末轰趴话题袋"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                @keyup.enter="handleCreateRoom"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                你的名字
              </label>
              <input 
                v-model="hostName"
                type="text" 
                placeholder="输入你的昵称"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                @keyup.enter="handleCreateRoom"
              />
            </div>
            
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-700">
                  🎨 场景灵感包
                </label>
                <span v-if="selectedScene" class="text-xs text-purple-600 font-medium">
                  已选：{{ selectedScene.name }} · {{ selectedScene.topics.length }} 个话题
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="scene in scenes"
                  :key="scene.id"
                  type="button"
                  class="p-3 rounded-xl border-2 transition-all text-left"
                  :class="[
                    selectedSceneId === scene.id 
                      ? `border-transparent bg-gradient-to-r ${scene.gradient} text-white shadow-md` 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  ]"
                  @click="selectScene(scene.id)"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xl">{{ scene.emoji }}</span>
                    <span 
                      class="text-sm font-medium"
                      :class="selectedSceneId === scene.id ? 'text-white' : 'text-gray-800'"
                    >
                      {{ scene.name }}
                    </span>
                  </div>
                  <p 
                    class="text-xs line-clamp-2"
                    :class="selectedSceneId === scene.id ? 'text-white/80' : 'text-gray-500'"
                  >
                    {{ scene.description }}
                  </p>
                </button>
              </div>
              <div v-if="selectedScene" class="mt-3 p-3 bg-purple-50 rounded-xl">
                <div class="flex items-center gap-2 text-xs text-purple-700 mb-2">
                  <span>📝</span>
                  <span class="font-medium">将自动带入以下话题：</span>
                </div>
                <div class="space-y-1 max-h-24 overflow-y-auto">
                  <div 
                    v-for="(topic, index) in selectedScene.topics.slice(0, 3)" 
                    :key="index"
                    class="text-xs text-gray-600 flex items-center gap-2"
                  >
                    <span class="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0"
                          :style="{ backgroundColor: TOPIC_COLORS[topic.type] }">
                      {{ index + 1 }}
                    </span>
                    <span class="truncate">{{ topic.content }}</span>
                  </div>
                  <div v-if="selectedScene.topics.length > 3" class="text-xs text-gray-400">
                    还有 {{ selectedScene.topics.length - 3 }} 个话题...
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {{ error }}
          </div>
          
          <div class="flex gap-3 mt-6">
            <button 
              class="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              @click="closeModals"
            >
              取消
            </button>
            <button 
              class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              :disabled="!roomName.trim() || !hostName.trim()"
              @click="handleCreateRoom"
            >
              {{ selectedScene ? '创建并带入话题' : '创建' }}
            </button>
          </div>
        </div>

        <div v-if="showJoinModal">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            🚪 加入房间
          </h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                房间邀请码
              </label>
              <input 
                v-model="joinCode"
                type="text" 
                placeholder="输入 6 位邀请码"
                maxlength="6"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-mono text-center text-xl tracking-widest uppercase"
                @keyup.enter="handleJoinRoom"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                你的名字
              </label>
              <input 
                v-model="joinName"
                type="text" 
                placeholder="输入你的昵称"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                @keyup.enter="handleJoinRoom"
              />
            </div>
          </div>
          
          <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {{ error }}
          </div>
          
          <div class="flex gap-3 mt-6">
            <button 
              class="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              @click="closeModals"
            >
              取消
            </button>
            <button 
              class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              :disabled="!joinCode.trim() || !joinName.trim()"
              @click="handleJoinRoom"
            >
              加入
            </button>
          </div>
        </div>
      </div>
    </div>

    <div 
      v-if="copySuccess"
      class="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
    >
      <span>✓</span>
      <span>房间码已复制到剪贴板</span>
    </div>
  </div>
</template>
