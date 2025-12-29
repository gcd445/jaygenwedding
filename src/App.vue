<script setup>

import conf from '@/config/config.json'
const coupleNames = conf.coupleNames
const schedule = conf.schedule
const weddingDate = conf.weddingDate
const location = conf.location
const email = conf.email
const phone = conf.phone
const venue = conf.venue
const registryLink = conf.registryLink

import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import WavyBackground from '@/components/WavyBackground.vue'
import FluidCursor from '@/components/FluidCursor.vue'

// --- Dark mode logic ---
const isDark = ref(false)

function setDarkMode(val) {
  isDark.value = val
  const root = document.documentElement
  if (val) {
    root.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    root.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

function toggleDarkMode() {
  setDarkMode(!isDark.value)
}

onMounted(() => {
  // System preference
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && systemDark)) {
    setDarkMode(true)
  } else {
    setDarkMode(false)
  }
})

const countdown = ref('')
const lightboxOpen = ref(false)
const lightboxImg = ref('')

const form = ref({
  name: '',
  guests: '',
  attending: '',
  notes: ''
})
const responseMessage = ref('')

// Smooth scroll to section by id
function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function updateCountdown() {
  const weddingDate = new Date(conf.weddingDate).getTime()
  const now = new Date().getTime()
  const distance = weddingDate - now
  if (distance <= 0) {
    countdown.value = "It's our wedding day!"
    return
  }
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  countdown.value = `${days}d ${hours}h ${minutes}m ${seconds}s`
}

onMounted(() => {
  updateCountdown()
  setInterval(updateCountdown, 1000)
})

function openLightbox(src) {
  lightboxImg.value = src
  lightboxOpen.value = true
}

async function submitRSVP() {
  if (!form.value.name || !form.value.guests || !form.value.attending) {
    responseMessage.value = 'Please fill in all required fields.'
    return
  }
  try {
    const res = await fetch('YOUR_WEB_APP_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    if (res.ok) {
      responseMessage.value = 'Thank you! Your RSVP has been recorded.'
      form.value = { name: '', guests: '', attending: '', notes: '' }
    } else {
      throw new Error('Submission failed')
    }
  } catch {
    responseMessage.value = 'Oops! Something went wrong. Please try again.'
  }
}
</script>

<template>
  <FluidCursor />
  <!-- Dark mode toggle button -->
  <div class="fixed top-4 right-4 z-50">
    <Button
      @click="toggleDarkMode"
      variant="outline"
      size="icon"
      class="rounded-full shadow bg-white/80 dark:bg-black/60 border-pink-200"
    >
      <span v-if="!isDark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-pink-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </span>
      <span v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-yellow-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
          />
        </svg>
      </span>
    </Button>
  </div>
  <!-- Hero -->
  <WavyBackground
    :backgroundFill="isDark ? '#181024' : 'white'"
    :colors="isDark ? ['#831843', '#581c87', '#312e81'] : ['#fbcfe8', '#f9a8d4', '#fef3c7']"
    :waveOpacity="0.5"
    :waveWidth="3"
    :blur="1"
  >
    <section class="py-28 text-center dark:bg-transparent">
      <img
        v-if="conf.heroImage"
        :src="conf.heroImage"
        alt="Hero"
        class="mx-auto mb-8 rounded-2xl shadow-lg max-h-80 object-cover"
      />
      <h1 class="text-7xl font-bold text-pink-700 drop-shadow-pink dark:text-pink-200">
        {{ coupleNames }}
      </h1>
      <p class="mt-6 text-2xl font-semibold text-pink-900 dark:text-pink-100">
        {{ weddingDate }} • {{ location }}
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <Button
          @click="scrollToSection('rsvp-section')"
          class="wedding-btn dark:bg-pink-700 dark:hover:bg-pink-800 dark:text-white"
          >RSVP Now</Button
        >
        <Button
          variant="outline"
          class="wedding-btn bg-white text-pink-500 border-pink-300 hover:bg-pink-50 dark:bg-gray-900 dark:text-pink-200 dark:hover:bg-gray-800"
          @click="scrollToSection('schedule-section')"
          >View Schedule</Button
        >
      </div>
    </section>
  </WavyBackground>
  <!-- Countdown -->
  <section
    class="max-w-3xl mx-auto text-center my-10 wedding-section dark:bg-gray-900 dark:text-pink-100"
  >
    <h2 class="text-3xl font-script mb-4">Countdown to Our Wedding</h2>
    <div class="text-2xl font-mono text-pink-600 dark:text-pink-200">{{ countdown }}</div>
  </section>

  <!-- Our Story -->
  <section
    class="max-w-3xl mx-auto wedding-section text-center dark:bg-gray-900 dark:text-pink-100"
  >
    <h2 class="text-3xl font-script mb-6">Our Story</h2>
    <p class="leading-relaxed text-lg text-pink-900 dark:text-pink-200">
      Jay and Gen’s story began in the halls of their high school, where a chance meeting in the
      library sparked a friendship that quickly blossomed into something more. From late-night study
      sessions to cheering each other on at every milestone, their bond only grew stronger through
      the years. After graduation, they navigated college and the start of their careers
      hand-in-hand, always supporting each other’s dreams. Their journey was filled with laughter,
      adventures, and the kind of love that felt both effortless and extraordinary. On a beautiful
      evening surrounded by family and friends, Jay proposed to Gen at the very spot where they
      first met. Today, they invite you to celebrate the next chapter of their love story as they
      say “I do.”
    </p>
  </section>

  <!-- Wedding Party -->
  <!-- <section class="max-w-5xl mx-auto my-12 px-4">
    <h2 class="text-3xl font-semibold text-center mb-8">Wedding Party</h2>
    <div class="grid md:grid-cols-3 gap-8">
      <Card>
        <p class="font-bold">Bridesmaid</p>
        <p>[Name]</p>
      </Card>
      <Card>
        <p class="font-bold">Groomsman</p>
        <p>[Name]</p>
      </Card>
    </div>
  </section> -->

  <!-- Schedule -->
  <section
    id="schedule-section"
    class="max-w-4xl mx-auto wedding-section dark:bg-gray-900 dark:text-pink-100"
  >
    <h2 class="text-4xl font-script text-center mb-10">Wedding Day Schedule</h2>
    <div class="grid md:grid-cols-3 gap-8">
      <Card v-for="(item, i) in schedule" :key="i" class="wedding-card dark:bg-gray-800">
        <p class="font-bold text-pink-700 dark:text-pink-200">{{ item.title }}</p>
        <p class="dark:text-pink-100">📍 Venue: {{ item.location }} ⏰ {{ item.time }}</p>
      </Card>
    </div>
  </section>

  <!-- Gallery -->
  <section class="max-w-5xl mx-auto wedding-section dark:bg-gray-900 dark:text-pink-100">
    <h2 class="text-3xl font-script text-center mb-8">Our Journey in Photos</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <img
        v-for="(img, i) in conf.gallery"
        :key="i"
        :src="img"
        class="rounded-xl shadow-lg cursor-pointer border-4 border-pink-100 hover:scale-105 transition"
        @click="openLightbox(img)"
      />
    </div>
  </section>
  <!-- RSVP -->
  <section
    id="rsvp-section"
    class="max-w-lg mx-auto wedding-section dark:bg-gray-900 dark:text-pink-100"
  >
    <h2 class="text-3xl font-script mb-4 text-center">RSVP</h2>
    <form @submit.prevent="submitRSVP" class="flex flex-col gap-4">
      <Input v-model="form.name" placeholder="Your Name" />
      <Input v-model="form.guests" type="number" placeholder="Number of Guests" />
      <Select v-model="form.attending">
        <SelectTrigger>Will you attend?</SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
        </SelectContent>
      </Select>
      <Textarea v-model="form.notes" :placeholder="conf.rsvp && conf.rsvp.notesPlaceholder ? conf.rsvp.notesPlaceholder : 'Notes'" />
      <Button type="submit" class="wedding-btn">Submit RSVP</Button>
    </form>
    <p class="mt-4 text-center text-pink-600 dark:text-pink-200">{{ responseMessage }}</p>
  </section>

  <!-- Venue -->
  <section
    class="max-w-3xl mx-auto wedding-section text-center dark:bg-gray-900 dark:text-pink-100"
  >
    <h2 class="text-3xl font-script mb-6">Venue & Travel</h2>
    <p class="text-pink-900 dark:text-pink-200">📍 {{ venue.name }}</p>
    <p class="text-pink-900 dark:text-pink-200">{{ venue.address }}</p>
    <p class="text-pink-900 dark:text-pink-200">
      Nearby Hotels:
      <span v-if="venue.hotels && venue.hotels.length">
        <span v-for="(hotel, i) in venue.hotels" :key="i">{{ hotel }}<span v-if="i !== venue.hotels.length - 1">, </span></span>
      </span>
      <span v-else>[Hotel List]</span>
    </p>
    <p class="text-pink-900 dark:text-pink-200">
      Directions:
      <a :href="venue.mapLink" class="underline" target="_blank" rel="noopener">Open in Google Maps</a>
    </p>
  </section>

  <!-- Registry -->
  <section
    class="max-w-3xl mx-auto wedding-section text-center dark:bg-gray-900 dark:text-pink-100"
  >
    <h2 class="text-3xl font-script mb-6">Registry</h2>
    <p class="text-pink-900">
      We are grateful for your love and support. If you’d like to give a gift, please visit:
    </p>
    <a :href="registryLink" class="underline text-pink-700 font-semibold dark:text-pink-200" target="_blank" rel="noopener"
      >Our Wedding Registry</a
    >
  </section>

  <!-- FAQ -->
  <section class="max-w-3xl mx-auto wedding-section dark:bg-gray-900 dark:text-pink-100">
    <h2 class="text-3xl font-script text-center mb-8">FAQ</h2>
    <div class="space-y-4">
      <div v-for="(item, i) in conf.faq" :key="i">
        <h3 class="font-bold text-pink-700 dark:text-pink-200">{{ item.question }}</h3>
        <p class="text-pink-900 dark:text-pink-200">{{ item.answer }}</p>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section
    class="max-w-3xl mx-auto wedding-section text-center dark:bg-gray-900 dark:text-pink-100"
  >
    <h2 class="text-3xl font-script mb-6">Contact Us</h2>
    <p class="text-pink-900 dark:text-pink-200">
      Email: <a :href="`mailto:${email}`" class="underline">{{ email }}</a>
    </p>
    <p class="text-pink-900 dark:text-pink-200">Phone: {{ phone }}</p>
  </section>

  <!-- Footer -->
  <footer
    class="wedding-footer dark:bg-linear-to-r dark:from-gray-900 dark:to-gray-800 dark:text-pink-200"
  >
    <p class="font-script text-xl">{{ conf.footerNote }}</p>
    <p class="text-sm text-pink-800 dark:text-pink-200">© 2025 {{ coupleNames }}</p>
  </footer>

  <!-- Lightbox -->
  <div
    v-if="lightboxOpen"
    class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
    @click="lightboxOpen = false"
  >
    <img :src="lightboxImg" class="max-h-[90%] max-w-[90%] rounded-lg shadow-lg" />
  </div>
</template>
