<template>
  <div class="min-h-screen relative overflow-hidden p-4 md:p-8">
    <!-- Animated Background Blobs -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>

    <!-- Main Container -->
    <div class="max-w-4xl mx-auto relative z-10">
      
      <!-- Sticky Header -->
      <div class="sticky top-0 z-20 py-4 glass-card rounded-2xl shadow-lg mb-8 backdrop-blur-xl">
        <div class="flex items-center justify-center gap-3">
          <span class="text-4xl">📝</span>
          <h1 class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            My Notes
          </h1>
        </div>
        <p class="text-center text-sm text-gray-500 mt-1">Organize your thoughts beautifully</p>
      </div>

      <!-- Form Card -->
      <div class="glass-card rounded-2xl shadow-xl p-6 md:p-8 mb-8 transition-all hover:shadow-2xl">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xl">{{ editing ? '✏️' : '✨' }}</span>
          <h2 class="text-xl font-semibold text-gray-700">{{ editing ? 'Edit Note' : 'Create New Note' }}</h2>
        </div>

        <div class="space-y-4">
          <input
            v-model="form.title"
            type="text"
            placeholder="Write a catchy title..."
            class="w-full bg-white/80 backdrop-blur-sm border-0 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 shadow-inner focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          />
          <textarea
            v-model="form.content"
            rows="3"
            placeholder="What's on your mind?..."
            class="w-full bg-white/80 backdrop-blur-sm border-0 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 shadow-inner focus:ring-2 focus:ring-purple-400 focus:outline-none transition resize-none"
          ></textarea>
          
          <div class="flex flex-wrap gap-3">
            <button
              @click="saveNote"
              class="flex-1 md:flex-none bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
            >
              {{ editing ? '💾 Update Note' : '🚀 Publish Note' }}
            </button>
            <button
              v-if="editing"
              @click="cancelEdit"
              class="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Notes Counter -->
      <div class="flex justify-between items-center mb-4 px-1">
        <span class="text-sm font-medium text-gray-500">
          📚 {{ notes.length }} {{ notes.length === 1 ? 'note' : 'notes' }}
        </span>
        <span v-if="notes.length > 0" class="text-xs text-gray-400">✨ Tap the dots for options</span>
      </div>

      <!-- Notes Grid with Animations -->
      <TransitionGroup name="note-list" tag="div" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Note
          v-for="note in notes"
          :key="note.id"
          :note="note"
          @edit="editNote"
          @delete="deleteNote"
        />
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="notes.length === 0" class="text-center py-16 glass-card rounded-2xl">
        <span class="text-6xl block mb-4">📭</span>
        <h3 class="text-2xl font-semibold text-gray-600">Your inbox is empty</h3>
        <p class="text-gray-400 mt-1">Start writing your first masterpiece above!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Note from './components/NoteList.vue';

const notes = ref([]);
const form = ref({ title: '', content: '' });
const editing = ref(false);
const editId = ref(null);

const API_URL = '/api/notes';

const fetchNotes = async () => {
  const res = await axios.get(API_URL);
  notes.value = res.data;
};

const saveNote = async () => {
  if (!form.value.title || !form.value.content) {
    alert('Please fill in both fields ✍️');
    return;
  }
  if (editing.value) {
    await axios.put(`${API_URL}/${editId.value}`, form.value);
    editing.value = false;
    editId.value = null;
  } else {
    await axios.post(API_URL, form.value);
  }
  form.value = { title: '', content: '' };
  await fetchNotes();
};

const editNote = (note) => {
  form.value = { title: note.title, content: note.content };
  editing.value = true;
  editId.value = note.id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const deleteNote = async (id) => {
  if (!confirm('Are you sure you want to delete this note? 🗑️')) return;
  await axios.delete(`${API_URL}/${id}`);
  await fetchNotes();
};

const cancelEdit = () => {
  form.value = { title: '', content: '' };
  editing.value = false;
  editId.value = null;
};

onMounted(fetchNotes);
</script>