<template>
  <div class="group glass-card rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-400 hover:border-l-pink-400 flex flex-col justify-between">
    <div>
      <div class="flex justify-between items-start gap-2">
        <h3 class="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-purple-600 transition">
          {{ note.title }}
        </h3>
        <div class="flex gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            @click="$emit('edit', note)"
            class="p-1.5 rounded-full hover:bg-blue-100 text-blue-500 transition-all hover:scale-110"
            title="Edit"
          >
            ✏️
          </button>
          <button
            @click="$emit('delete', note.id)"
            class="p-1.5 rounded-full hover:bg-red-100 text-red-400 transition-all hover:scale-110"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <p class="text-gray-600 mt-2 text-sm whitespace-pre-wrap break-words line-clamp-4">
        {{ note.content }}
      </p>
    </div>
    
    <div class="mt-4 pt-3 border-t border-gray-200/50 flex justify-between items-center">
      <span class="text-[10px] font-mono text-gray-400 bg-gray-100/50 px-2 py-1 rounded-full">
        {{ new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
      </span>
      <span class="text-[10px] text-gray-300">#note</span>
    </div>
  </div>
</template>

<script setup>
defineProps(['note']);
defineEmits(['edit', 'delete']);
</script>