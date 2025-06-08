<template>
  <form @submit.prevent="submitCard" class="card-form">
    <div>
      <label v-if="collections.length>0">
        <input type="radio" value="existing" v-model="collectionMode" />
        Select collection
      </label>
      <label>
        <input type="radio" value="new" v-model="collectionMode" />
        Create collection
      </label>
    </div>

    <div v-if="collectionMode === 'existing'">
      <button type="button" @click="$emit('open-collection-modal')">
        Select collection
      </button>
      <span v-if="selectedCollectionName" style="color:green; margin-left: 8px;">{{ selectedCollectionName }}</span>
    </div>

    <div v-else>
      <input
        type="text"
        v-model="newCollectionName"
        @input="newCollectionName = toTitleCase(newCollectionName)"
        placeholder="New collection name"
        class="form-input"
        required
      />
    </div>

    <input
      v-model="question"
      @input="question = capitalizeFirst(question)"
      type="text"
      placeholder="Enter question"
      class="form-input"
      required
    />
    <input
      v-model="answer"
      @input="answer = capitalizeFirst(answer)"
      type="text"
      placeholder="Enter answer"
      class="form-input"
      required
    />

    <button type="submit" class="submit-button">Add Card</button>

    <p v-if="success" class="success-msg">Card added!</p>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </form>
</template>


  <script setup>
  import { ref, watch, onMounted } from 'vue'
  import axios from 'axios'
  import { toTitleCase, capitalizeFirst } from '@/utils/formatting.js'

  const question = ref('')
  const answer = ref('')
  const error = ref(null)
  const success = ref(false)
  const collectionMode = ref('existing')
  const newCollectionName = ref('')

  const emit = defineEmits(['card-added', 'open-collection-modal'])

  const props = defineProps({
    collections: Array,
    selectedCollectionName: String,
    selectedCollectionId: String,
  })

  watch(() => props.collections.length, (newLength) => {
    if (newLength === 0) collectionMode.value = 'new'
  })


  // Create collection
  async function createNewCollection(name) {
    const res = await axios.post('/api/collections', { name })
    return res.data;
  }

  async function getCollectionId() {
    let collectionIdToUse = null

    if (collectionMode.value === 'new') {
      // Call the api to create collection first and get the id
      if (!newCollectionName.value.trim()) {
        alert('Please enter a name for the new collection')
        return
      }
      const res = await createNewCollection(newCollectionName.value)
      collectionIdToUse = res._id
    } else {
      collectionIdToUse = props.selectedCollectionId
    }

    if (!collectionIdToUse) {
      alert('Please select or create a collection')
      return
    }

    return collectionIdToUse
  }


  async function submitCard() {
    try {
      const collectionId = await getCollectionId();
      const payload = {question:question.value, answer:answer.value, collectionId};
      await axios.post('/api/cards', payload);
      emit('card-added');
      success.value = true

      // Reset form fields
      question.value = '';
      answer.value = '';
      //selectedCollectionId.value = null;
      //selectedCollectionName.value = '';
      newCollectionName.value = '';

    } catch (error) {
      alert(error.message);
    }
  }

  onMounted(() => {
    if (props.collections.length === 0) {
      collectionMode.value = 'new'
    }
  })

  watch(() => props.collections.length, (newLen) => {
    if (newLen === 0) {
      collectionMode.value = 'new'
    }
  })
</script>

<style scoped>
  .card-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 400px;
    margin: 1rem auto;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  .form-input {
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
  }
  .form-input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
  .submit-button {
    background-color: #007bff;
    color: white;
    padding: 0.6rem;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .submit-button:hover {
    background-color: #0056b3;
  }
  .success-msg {
    color: green;
    font-weight: bold;
    text-align: center;
  }
  .error-msg {
    color: red;
    font-weight: bold;
    text-align: center;
  }
</style>