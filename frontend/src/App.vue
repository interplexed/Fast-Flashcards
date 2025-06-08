<template>
  <div>
    <Toolbar
      :collections="collections"
      :selectedCount="selectedCardIds.length"
      :hasCards="hasCards"
      :hasMoreThanOneCard="hasMoreThanOneCard"
      :isAdding="showAddForm"
      :isManaging="showManage"
      @open-collection-modal="openCollectionModal"
      @toggle-add="toggleAddForm"
      @toggle-manage="toggleManageCards"
      :reorder-mode="reorderMode" 
      @toggle-reorder="toggleReorderMode"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <h1 v-if="selectedCollectionName">
      {{ selectedCollectionName }} 
      <span v-if="!showAddForm && !showManage && cards.length"> ( {{ currentIndex + 1 }} / {{ cards.length }} )</span>
    </h1>
    <h1 v-else>
      Flashcards App
    </h1>

    <CollectionSelectModal
      v-if="showCollectionModal"
      :collections="collections"
      @select="handleCollectionSelect"
      @close="showCollectionModal = false"
    />

    <AddCardForm v-if="showAddForm && !showManage"
      :collections="collections"    
      :selectedCollectionId="selectedCollectionId"
      :selectedCollectionName="selectedCollectionName"
      @open-collection-modal="showCollectionModal=true"
      @card-added="handleCardAdded" 
    />
    <FlashcardDeck v-if="!showAddForm && !showManage && cards.length" 
      :cards="cards" 
      @progress-changed="updateProgress"
    />
    <div v-if="!showAddForm && !showManage && !cards.length">
      <p>No cards available - add a card or select a collection</p>
    </div>

    

    <ManageCards
      v-if="showManage"
      :cards="cards"
      :collections="collections"
      :reorder-mode="reorderMode" 
      @selection-change="selectedCardIds = $event"
      @update-card="handleCardUpdate"
      @update-card-order="handleCardOrderUpdate"
      @reorder-mode="reorderMode"
      />
  </div>
</template>


<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'

import Toolbar from '@/components/Toolbar.vue'
import AddCardForm from '@/components/AddCardForm.vue'
import FlashcardDeck from '@/components/FlashcardDeck.vue'
import ManageCards from '@/components/ManageCards.vue'
import CollectionSelectModal from '@/components/CollectionSelectModal.vue'

/*---------------------
  UI State
---------------------*/
const showCollectionModal = ref(false)
const showAddForm = ref(false)
const showManage = ref(false)
const reorderMode = ref(false)
const nextAction = ref(null)

/*---------------------
  Data State
---------------------*/
const collections = ref([])
const cards = ref([])
const selectedCardIds = ref([])

/*---------------------
  Selected Collection
---------------------*/
const selectedCollectionId = ref(null)
const selectedCollectionName = ref('')

const currentIndex = ref(0)
const hasCards = computed(() => cards.value.length > 0)
const hasMoreThanOneCard = computed(() => cards.value.length > 1)

/*---------------------
  Fetch Functions
---------------------*/
async function fetchCollections() {
  try {
    const res = await axios.get('/api/collections')
    collections.value = res.data
  } catch (err) {
    console.error('Error fetching collections:', err)
  }
}

async function fetchCards() {
  if (!selectedCollectionId.value) return
  try {
    const res = await axios.get(`/api/cards?collectionId=${selectedCollectionId.value}`)
    cards.value = res.data
  } catch (e) {
    console.error('Error fetching cards:', e)
  }
}

/*---------------------
  UI Event Handlers
---------------------*/
function openCollectionModal() {
  showCollectionModal.value = true
}

function toggleAddForm() {
  showAddForm.value = !showAddForm.value
  showManage.value = false
}

function toggleManageCards() {
  if (!selectedCollectionId.value) {
    showCollectionModal.value = true
    nextAction.value = 'manage'
    return
  }
  showManage.value = !showManage.value
  showAddForm.value = false
}

function toggleReorderMode() {
  reorderMode.value = !reorderMode.value
}

// Reset Reorder Mode when exiting Manage Cards
watch(() => showManage.value, (newVal) => {
  if (!newVal) {
    reorderMode.value = false;
  }
});


async function handleDelete() {
  if (!selectedCardIds.value.length) return

  if (confirm(`Delete ${selectedCardIds.value.length} card(s)?`)) {
    try {
      await Promise.all(selectedCardIds.value.map(id =>
        axios.delete(`/api/cards/${id}`)
      ))
      await fetchCards()
      selectedCardIds.value = []
    } catch (e) {
      console.error('Failed to delete cards:', e)
    }
  }
}

/*---------------------
  Child Component Events
---------------------*/
function handleCollectionSelect(collection) {
  selectedCollectionId.value = collection._id
  selectedCollectionName.value = collection.name
  showCollectionModal.value = false

  if (nextAction.value === 'manage') {
    fetchCards().then(() => {
      showManage.value = true
      showAddForm.value = false
      nextAction.value = null
    })
  }
}

function handleCardAdded() {
  fetchCollections()
  fetchCards()
}

function handleCardUpdate(updatedCard) {
  cards.value = cards.value.filter(c => c._id !== updatedCard._id)
  if (updatedCard.collectionId === selectedCollectionId.value) {
    cards.value.push(updatedCard)
  }
}

function handleCardOrderUpdate(newOrder) {
  cards.value = [...newOrder]
}

function updateProgress(newIndex) {
  currentIndex.value = newIndex
}


/*---------------------
  Reactive Watchers
---------------------*/
watch(selectedCollectionId, fetchCards)

/*---------------------
  Init
---------------------*/
onMounted(fetchCollections)
</script>


<style scoped>
.toolbar {
  display: flex;
  gap: 1rem;
  background: #eee;
  padding: 0.5rem 1rem;
  user-select: none;
  border-bottom: 1px solid #ccc;
}

button {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

button.active {
  background-color: #007BFF;
  color: white;
  border-color: #0056b3;
}

button:hover {
  background-color: #e0e0e0;
}
</style>