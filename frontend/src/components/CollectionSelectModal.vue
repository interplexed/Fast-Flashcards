<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Select Collection</h3>
      <ul class="collection-list">
        <li
          v-for="col in collections"
          :key="col._id"
          @click="$emit('select', col)"
          class="collection-item"
        >
          {{ col.name }}
        </li>
      </ul>
      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>


<script setup>
  defineProps({
    collections: Array,
    selectedId: String,
  })
  const emit = defineEmits(['select', 'close'])
</script>


<style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    z-index: 100;
    border-radius: 8px;
    max-height: 400px;
    width: 300px;
    overflow-y: auto;
    padding: 1rem;
    max-width: 90%;
  }
  .collection-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .collection-item {
    padding: 0.5rem;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .collection-item:hover {
    background-color: #eee;
  }
</style>
