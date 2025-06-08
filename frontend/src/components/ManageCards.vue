<template>  
  <div class="card-grid-container" ref="scrollContainer" @scroll="onScroll">
    <div  v-if="!props.reorderMode" class="card-grid">
      <div v-for="(card, index) in visibleCards" :key="card._id" class="card-tile">  
        <div class="card-header">
          <span class="card-label">Q:</span>
          <input
            type="checkbox"
            class="card-checkbox"
            :value="card._id"
            v-model="selectedCardIds"
          />
          <button @click="handleEdit(card)">Edit</button>
        </div>

        <div class="question-value">{{ card.question }}</div>

        <div class="card-answer">
          <span class="card-label">A:</span>
          <div class="answer-value">{{ card.answer }}</div>
        </div>
      </div>
    </div>

    <draggable
      v-else
      v-model="localCards"
      item-key="_id"
      class="card-grid"
      :animation="200"
      ghost-class="ghost"
      @end="onReorderEnd"
    >
      <template #item="{ element: card }">
        <div class="card-tile" :key="card._id">
          <div class="question-value">{{ card.question }}</div>
        </div>
      </template>
    </draggable>

    <EditCardModal
      v-if="editingCard"
      :card="editingCard"
      :collections="collections"
      @save="handleModalSave"
      @close="handleModalClose"
    />

  </div>
</template>


<script setup>
  import { defineProps, defineEmits, ref, watch, computed, onMounted } from 'vue'
  import axios from 'axios'
  import draggable from 'vuedraggable'
  import EditCardModal from '@/components/EditCardModal.vue'

  const props = defineProps({
    cards: Array,
    collections: Array,
    selectable: Boolean,
    reorderMode: Boolean
  })

  const emit = defineEmits(['selection-change', 'update-card', 'update-card-order'])//,'visible-cards-len'])

  const selectedCardIds = ref([])
  const editingCard = ref(null)
  const scrollContainer = ref(null)
  const start = ref(0)
  const buffer = 50
  const visibleCards = computed(() => props.cards.slice(start.value, start.value + buffer))

  watch(selectedCardIds, (newVal) => {
    emit('selection-change', newVal)
  })


  function handleEdit(card) {
    if (!card) return
    // If any checkboxes are selected, then deselect them
    selectedCardIds.value = []
    //const index = selectedCardIds.value.indexOf(card._id)
    //if (index !== -1) {
    //  selectedCardIds.value.splice(index, 1)
    //}
    editingCard.value = { ...card }
  }


  async function handleModalSave(updatedCard) {
    try {
      const updated = await updateCard(updatedCard);
      emit('update-card', updated);
      editingCard.value = null;
    } catch (e) {
      console.error('Update failed:', e);
    }
  }

  function handleModalClose() {
    editingCard.value = null
  }

  async function updateCard(updated) {
    try {
      const res = await axios.put(`/api/cards/${updated._id}`, {
        question: updated.question,
        answer: updated.answer,
        collectionId: updated.collectionId,
      });
      return res.data;
    } catch (error) {
      console.error('Failed to update card:', error);
      throw new Error(error?.message || 'Failed to update card');
    }
  }



  const localCards = ref([])
  watch(
    () => props.cards,
    (newCards) => {
      if (!props.reorderMode) {
        localCards.value = [...newCards]
      }
    },
    { immediate: true }
  )

  // Handle exiting manage mode whilst still in reorder mode 
  watch(
    () => props.reorderMode,
    (isReordering) => {
      if (!isReordering) {
        // Restore localCards to match props.cards in case user cancelled reordering
        localCards.value = [...props.cards];
      }
    }
  );

  function onReorderEnd() {
    emit('update-card-order', localCards.value)
  }



  function onScroll() {
    const el = scrollContainer.value
    if (!el) return
    const scrollTop = el.scrollTop
    const scrollHeight = el.scrollHeight
    const clientHeight = el.clientHeight
    const percentScrolled = scrollTop / (scrollHeight - clientHeight)
    const total = props.cards.length
    const newStart = Math.floor(percentScrolled * (total - buffer))
    start.value = Math.max(0, newStart)
  }
</script>


<style scoped>
  .card-grid-container {
    height: 80vh;
    overflow-y: auto;
    padding: 1rem;
  }
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  .card-tile {
    background-color: #ffe6ec; /* very light pink */
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
    min-height: 100px;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-checkbox {
    transform: scale(1.1);
  }
  .card-label {
    font-weight: bold;
    margin-right: 0.5rem;
  }
  .question-value {
    margin-left: 1rem;
    margin-top: 0.25rem;
  }
  .card-answer {
    margin-top: 0.75rem;
  }
  .answer-value {
    margin-left: 1rem;
    margin-top: 0.25rem;
  }
  .ghost {
    opacity: 0.4;
  }
</style>
