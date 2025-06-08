<template>
  <nav class="toolbar">
    <button v-if="!isAdding && !isManaging" :disabled="collections.length===0" @click="$emit('open-collection-modal')">Select Collection</button>
    <button @click="$emit('toggle-add')" :class="{ active: isAdding }">{{ isAdding ? 'Exit Add Card' : 'Add Card' }}</button>
    <button :disabled="!isManaging && !hasCards" @click="$emit('toggle-manage')" :class="{ active: isManaging }">{{ isManaging ? 'Exit Manage Cards' : 'Manage Cards' }}</button>
      <template v-if="isManaging">
        <button :disabled="!hasMoreThanOneCard" @click="$emit('toggle-reorder')" :class="{ active: reorderMode }">{{ reorderMode ? 'Exit Reorder' : 'Reorder' }}</button>
        <button :disabled="selectedCount === 0" @click="$emit('delete')" :class="{ active: selectedCount > 0 }">Delete</button>
      </template>
  </nav>
</template>

<script setup>
  const props = defineProps({
    collections: Array,
    selectedCount: Number,
    isManaging: Boolean,
    isAdding: Boolean,
    reorderMode: Boolean,
    hasCards: Boolean,
    hasMoreThanOneCard: Boolean
  })
</script>

<style scoped>
  .toolbar {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f6f6f6;
    border-bottom: 1px solid #ddd;
    justify-content: flex-start;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #eee;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  button.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
