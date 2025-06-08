<template v-if="localcard">
  <div class="modal-overlay">
    <div class="modal">
      <h3>Edit Card</h3>
      <form @submit.prevent="saveEdit">
        <label>Question:
          <input 
            v-model="localcard.question" 
            @input="localcard.question = capitalizeFirst(localcard.question)"
            required 
          />
        </label>
        <label>Answer:
          <input 
          v-model="localcard.answer" 
          @input="localcard.answer = capitalizeFirst(localcard.answer)"
          required />
          
        </label>
        <label>Collection:
          <select v-model="localcard.collectionId">
            <option v-for="col in collections" :key="col._id" :value="col._id">
              {{ col.name }}
            </option>
          </select>
        </label>
        <button type="submit">Save</button>
        <button type="button" @click="$emit('close')">Close</button>
        
      </form>
    </div>
  </div>
</template>


<script setup>
  import { watch, ref } from 'vue'
  import {capitalizeFirst } from '@/utils/formatting.js'

  const props = defineProps({
    card: Object,
    collections: Array,
  })

  const emit = defineEmits(['save', 'close'])

  const localcard = ref(null)

  watch(
    () => props.card,
    (newCard) => {
      if (newCard) {
        localcard.value = {
          ...newCard,
          collectionId: typeof newCard.collectionId === 'object'
            ? newCard.collectionId._id
            : newCard.collectionId
        };    } else {
        localcard.value = null
      }
    },
    { immediate: true }
  )

  function saveEdit() {
    if (!localcard.value) return
    emit('save', { ...localcard.value })
  }

</script>


<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }
  .modal {
    background: white;
    padding: 1rem;
    margin: 5% auto;
    width: 300px;
  }
</style>