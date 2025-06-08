<template>
  <div class="flashcard-container" @click="flipCard" v-if="currentCard">
    <div class="flashcard" :class="{ flipped: isFlipped }">
      <div class="front">
        {{ currentCard.question }}
      </div>
      <div class="back">
        {{ currentCard.answer }}
        <div v-if="countdown > 0" class="countdown-wrapper">
          <span class="countdown" :key="'count-' + countdown">{{ countdown }}</span>
          <span class="pulse-circle" :key="'pulse-' + countdown"></span>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>No cards available.</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  cards: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['progress-changed'])

const cards = ref([...props.cards])

const currentIndex = ref(0)
const isFlipped = ref(false)
const countdown = ref(0)
let countdownTimer = null

const currentCard = computed(() => cards.value[currentIndex.value])


// Watch for changes in props.cards and update internal cards
watch(() => props.cards, (newCards) => {
  cards.value = [...newCards]
})

watch(currentIndex, (newIndex) => {
  emit('progress-changed', newIndex)
})


function flipCard() {
  if (isFlipped.value || !currentCard.value) return
  isFlipped.value = true
  countdown.value = 5
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(countdownTimer)
      moveToNextCard()
    }
  }, 1000)
}

function moveToNextCard() {
  if (currentIndex.value < cards.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0  // Restart deck after last card
  }
  isFlipped.value = false
  countdown.value = 0
}
</script>


<style scoped>
  .flashcard-container {
    max-width: 400px;
    margin: 1rem auto;
    perspective: 1000px;
    user-select: none;
  }
  .flashcard {
    width: 100%;
    height: 220px;
    position: relative;
    cursor: pointer;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    border-radius: 10px;
  }
  .flashcard.flipped {
    transform: rotateY(180deg);
  }
  .flashcard .front,
  .flashcard .back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border: 1px solid #e0bfc5;
    border-radius: 10px;
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1rem;
    background-color: #ffeef2;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
  }
  .flashcard .back {
    transform: rotateY(180deg);
    background-color: #fce4ec;
  }
  .countdown-wrapper {
    position: absolute;
    bottom: 8px;
    right: 12px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .countdown {
    font-weight: bold;
    font-size: 1.2rem;
    color: #d33;
    animation: popPulse 1s ease-in-out;
    z-index: 3;
  }
  .pulse-circle {
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    background-color: rgba(9, 9, 9, 0.4);
    border-radius: 50%;
    z-index: 2;
    animation: circleExpand 1s ease-in-out;
  }
  @keyframes popPulse {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }
    20% {
      opacity: 1;
      transform: scale(1.3);
    }
    50% {
      transform: scale(1);
    }
    90% {
      opacity: 0.5;
      transform: scale(1.4);
    }
    100% {
      opacity: 0;
      transform: scale(1.6);
    }
  }
  @keyframes circleExpand {
    0% {
      transform: scale(0.3);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 0.2;
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }
</style>
