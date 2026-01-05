<script setup>
import conf from '@/config/config.json'
import { ref, onMounted, computed } from 'vue'
const coupleNames = conf.coupleNames
const schedule = conf.schedule
const weddingDateRaw = conf.weddingDate
const location = conf.location
const email = conf.email
const phone = conf.phone
const venue = conf.venue
const registryLink = conf.registryLink

// Format wedding date for display
const weddingDateObj = computed(() => new Date(weddingDateRaw))
const weddingDateDisplay = computed(() => {
  if (isNaN(weddingDateObj.value.getTime())) return conf.weddingDate
  return weddingDateObj.value.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
})

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
const countdownDays = ref('00')
const countdownHours = ref('00')
const countdownMinutes = ref('00')
const countdownSeconds = ref('00')
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

// Countdown logic using ISO date
function updateCountdown() {
  const d = new Date(conf.weddingDate)
  if (isNaN(d.getTime())) {
    countdown.value = 'Invalid wedding date'
    countdownDays.value =
      countdownHours.value =
      countdownMinutes.value =
      countdownSeconds.value =
        '00'
    return
  }
  const now = new Date()
  const distance = d.getTime() - now.getTime()
  if (distance <= 0) {
    countdown.value = "It's our wedding day!"
    countdownDays.value =
      countdownHours.value =
      countdownMinutes.value =
      countdownSeconds.value =
        '00'
    return
  }
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  countdown.value = `${days}d ${hours}h ${minutes}m ${seconds}s`
  countdownDays.value = String(days).padStart(2, '0')
  countdownHours.value = String(hours).padStart(2, '0')
  countdownMinutes.value = String(minutes).padStart(2, '0')
  countdownSeconds.value = String(seconds).padStart(2, '0')
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
  <!-- <div class="fixed top-4 right-4 z-50">
    <Button @click="toggleDarkMode" variant="outline" size="icon"
      class="rounded-full shadow bg-white/80 dark:bg-black/60 border-pink-200" :aria-pressed="isDark"
      :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
      <span v-if="!isDark">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
      <span v-else>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      </span>
    </Button>
  </div> -->

  <section class="min-h-screen flex pt-30 justify-center bg-[#512731] text-white py-0">
    <div class="text-center space-y-0">
      <!-- Arc Text -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 250"
        class="mx-auto mb-[-100px] w-[300px] h-[250px]"
      >
        <!-- Arc Path -->
        <path id="arcPath" d="M50,200 A200,200 0 0,1 450,200" fill="none" stroke="transparent" />
        <!-- Text on Path -->
        <text
          fill="white"
          font-size="35"
          letter-spacing="5"
          style="font-family: 'Aviano Sans', 'Inter', sans-serif"
        >
          <textPath xlink:href="#arcPath" startOffset="50%" text-anchor="middle">
            THE WEDDING OF
          </textPath>
        </text>
      </svg>

      <!-- Main Text -->

      <p class="text-[80px] md:text-[140px] m-0" style="font-family: 'The Seasons'; line-height: 1">
        JAY
      </p>
      <p
        class="text-[25px] md:text-[60px] m-0 md:mt-1"
        style="
          font-family: 'Arsenica Trial', 'Inter', sans-serif;
          margin: -0.5rem 0 -0.2rem;
          line-height: 1;
        "
      >
        &
      </p>
      <p class="text-[80px] md:text-[140px] m-0" style="font-family: 'The Seasons'; line-height: 1">
        GEN
      </p>

      <p class="text-xl mt-2">at Silang, Cavite</p>
      <p class="text-lg text-gray-300">Tuesday • April 28, 2026 • 1:00 PM</p>
    </div>
  </section>

  <section
    class="min-h-screen text-[#512731] bg-[#f5f0e6] flex flex-col items-center mt-20 px-6 text-center space-y-8"
  >
    <!-- Placeholder Image -->
    <img src="/img/lily.png" alt="Floral artwork" class="mx-auto w-150" />

    <!-- Countdown Timer -->
    <div
      class="flex justify-center space-x-6 text-center"
      aria-live="polite"
      style="font-family: 'Cormorant Garamond', serif"
    >
      <div>
        <div class="text-5xl font-bold">{{ countdownDays }}</div>
        <div class="uppercase text-lg">Days</div>
      </div>
      <div>
        <div class="text-5xl font-bold">{{ countdownHours }}</div>
        <div class="uppercase text-lg">Hours</div>
      </div>
      <div>
        <div class="text-5xl font-bold">{{ countdownMinutes }}</div>
        <div class="uppercase text-lg">Minutes</div>
      </div>
      <div>
        <div class="text-5xl font-bold">{{ countdownSeconds }}</div>
        <div class="uppercase text-lg">Seconds</div>
      </div>
    </div>

    <!-- Message -->
    <div class="space-y-12 flex flex-col text-center items-center">
      <div class="text-[20px]" style="font-family: 'Aviano Sans'">
        <p>We're counting down to our wedding day and couldn't be more excited to</p>
        <p>celebrate with our close family and friends.</p>
        <p>We've created this website to share all the details as we get closer to "I do."</p>
        <p>Thank you for being part of our lives and celebrating this next chapter with us.</p>
        <p>With love,</p>
        <br />
      </div>
      <div class="flex items-center">
        <p class="text-[40px]" style="font-family: 'The Seasons'">JAY</p>
        <p class="text-[20px]" style="font-family: 'Arsenica Trial'">&</p>
        <p class="text-[40px]" style="font-family: 'The Seasons'">GEN</p>
      </div>
    </div>
  </section>

  <section
    class="relative bg-white min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center space-y-8 text-[#4b2e2e]"
  >
    <!-- Top Right Floral -->
    <img src="/img/lily2.png" alt="Top right floral" class="absolute top-5 right-0 w-30 md:w-80" />

    <!-- Bottom Left Floral (rotated for balance) -->
    <img
      src="/img/lily2.png"
      alt="Bottom left floral"
      class="absolute bottom-0 left-0 w-30 md:w-80"
      style="transform: rotate(180deg)"
    />

    <!-- RSVP Content -->
    <div class="max-w-xl space-y-6">
      <h2 class="text-3xl md:text-6xl font-bold tracking-wide" style="font-family: 'The Seasons'">
        RSVP
      </h2>
      <div style="font-family: 'Aviano Sans'" class="space-y-4">
        <p class="text-sm md:text-lg">
          Please respond by <strong>March 8</strong>
        </p>

        <form @submit.prevent="submitRSVP" class="flex flex-col gap-4">
          <Input v-model="form.name" placeholder="Your Name" />
          <!-- <Input v-model="form.guests" type="number" placeholder="Number of Guests" /> -->
           <div class="flex items-center gap-5">
          <Select v-model="form.attending">
            <SelectTrigger>Will you attend?</SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
          {{ form.attending }}
        </div>
          <Textarea
            v-model="form.notes"
            :placeholder="
              conf.rsvp && conf.rsvp.notesPlaceholder ? conf.rsvp.notesPlaceholder : 'Notes'
            "
          />
          <Button
            type="submit"
            class="bg-[#4b2e2e] hover:bg-[#6b4b4b] text-white font-bold rounded-full px-8 py-3 shadow transition font-script text-xl dark:bg-pink-700 dark:hover:bg-pink-800 dark:text-white"
            style="font-family: 'Dancing Script', cursive; font-size: 1.25rem"
            >Submit RSVP</Button
          >
        </form>
        <p class="mt-4 text-center text-pink-600 dark:text-pink-200">{{ responseMessage }}</p>

        <div class="text-md mt-6 space-y-4">
          <p>We kindly ask that only formally invited guests attend.</p>
          <p>
            While we would love to celebrate with everyone, we are keeping our gathering small and
            intimate.
          </p>
          <p>Thank you for your understanding and warm wishes.</p>
        </div>
      </div>
    </div>
  </section>

  <section
    class="bg-[#f5f0e6] min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-12 space-y-8 md:space-y-0 md:space-x-12 text-[#4b2e2e]"
  >
    <!-- <div class="md:w-1/3 w-full flex justify-center">
      <img src="/img/lily3.png" alt="Floral illustration" class="w-40 md:w-full object-contain" />
    </div> -->

    <div class="md:w-2/3 w-full space-y-6 max-w-2xl text-center ">
      <h2
        class="bg-[linear-gradient(rgba(245,240,230,0.9),rgba(245,240,230,0.9)),url('/img/lily3.png')] bg-cover bg-center text-3xl font-bold tracking-wide p-10"
        style="font-family: 'Cormorant Garamond', serif"
      >
      <div class="flex items-center justify-center gap-5  ">
        <p class="text-[30px]" style="font-family: 'The Seasons'">Our</p>
        <p class="text-[40px]" style="font-family: 'Swear Display'">Love</p>
        <p class="text-[30px]" style="font-family: 'The Seasons'">Story</p>
      </div>
        
      </h2>
      <div class="flex items-center justify-center  ">
        <p class="text-[30px]" style="font-family: 'The Seasons'">J</p>
        <p class="text-[30px]" style="font-family: 'Arsenica Trial'">&</p>
        <p class="text-[30px]" style="font-family: 'The Seasons'">G</p>
      </div>
      <div style="font-family: 'Cormorant Garamond', serif">
        <p class="text-md leading-relaxed mb-2">
          Jay & Gen first crossed paths in Grade 5; just familiar faces in the same halls. It wasn’t
          until highschool, when their friend groups intertwined, that fate stepped in and began to
          rewrite the story.
        </p>
        <p class="text-md leading-relaxed mb-2">
          What started as a simple slow dance soon turned into exchanging pick-up lines, taking
          digital polaroids, listening to music together, friendly table tennis matches, and moments
          that made ordinary days unforgettable...
        </p>
        <p class="text-md leading-relaxed mb-2">
          In 2011, Jay knew his heart had made its choice. He courted Gen with patience and charm,
          and six months later, on a rainy August evening with Aerosmith’s “I Don’t Want to Miss a
          Thing” playing softly in the background, Gen finally said yes.
        </p>
        <p class="text-md leading-relaxed mb-2">
          Over more than a decade, celebrating milestones, figuring out adulting, binge-watching
          superhero and anime series, movie date nights, weekend getaways, and exploring new foods
          and places across cities and countries, every experience together has felt like its own
          little adventure.
        </p>
        <p class="text-md leading-relaxed mb-2">
          On an intimate anniversary weekend in Batangas, as they watched the sky shift into sunset
          hues and the gentle waves crash in front of them, Jay asked Gen to spend forever with him,
          and she said yes.
        </p>
        <p class="text-md leading-relaxed mb-2">
          By grace and through faith, they are now ready for the adventure of a lifetime, surrounded
          by the people who have supported and celebrated alongside them throughout the years.
        </p>
      </div>
    </div>
  </section>

  <section
    class="bg-[url('/img/backgrounds/church_bg.jpg')] bg-cover bg-center text-white min-h-screen px-6 py-12 flex flex-col items-center justify-center space-y-8 text-center"
  >
    <h2 class="text-1xl md:text-3xl" style="font-family: 'The Seasons'">
        <div class="flex items-center justify-center gap-5  ">
          Directions to the
      
        
        
      </div>
      <p class="text-2xl md:text-5xl" style="font-family: 'Swear Display'">Venues</p>
    </h2>
    <div class="space-y-6 max-w-xl" style="font-family: 'Aviano Sans', sans-serif">
      <div>
        <h3 class="text-xl md:text-2xl font-semibold">Ceremony at</h3>
        <p class="text-base md:text-lg">
          St. Benedict Parish<br />Ayala Westgrove Heights, South Boulevard, Silang, Cavite
        </p>
        <a
          href="#"
          class="mt-2 inline-block bg-white text-[#3b0a0f] px-4 py-2 rounded-full font-semibold text-sm md:text-base"
          >Get Directions</a
        >
      </div>
      <div>
        <h3 class="text-xl md:text-2xl font-semibold">Reception will follow at</h3>
        <p class="text-base md:text-lg">
          Alta Veranda de Tibig, Plaza Guevarra<br />Alcalde St. Brgy. Tibig, Silang, Cavite
        </p>
        <a
          href="#"
          class="mt-2 inline-block bg-white text-[#3b0a0f] px-4 py-2 rounded-full font-semibold text-sm md:text-base"
          >Get Directions</a
        >
      </div>
    </div>
  </section>
  <section class="bg-[#f5f0e6] min-h-screen px-6 py-12 text-center text-[#4b2e2e] space-y-8">
    <h2 class="text-4xl md:text-5xl font-bold tracking-wide" style="font-family: 'The Seasons'">
      The Dress Code
    </h2>
    <p class="text-base md:text-lg" style="font-family: 'Aviano Sans', sans-serif">
      The dress code is formal, and we kindly ask guests to avoid white.
    </p>
    <div
      class="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left"
      style="font-family: 'Aviano Sans', sans-serif"
    >
      <div class="text-base md:text-lg">
        <strong>Gentlemen:</strong> Beige barong with black slacks
      </div>
      <div class="text-base md:text-lg"><strong>Ladies:</strong> Long, flowy gowns or dresses</div>
    </div>
    <p class="text-base md:text-lg mt-4" style="font-family: 'Aviano Sans', sans-serif">
      Celebrate our summer wedding in soft, pastel shades. All colors are welcome as long as they’re
      light and airy. Subtle florals are also warmly encouraged.
    </p>
    <a
      href="#"
      class="inline-block bg-[#4b2e2e] text-white px-6 py-3 rounded-full text-base md:text-lg font-semibold hover:bg-[#6a3f3f] transition"
      style="font-family: 'Aviano Sans', sans-serif"
      >View Pegs Here</a
    >
  </section>
  <section class="bg-white min-h-screen px-6 py-12 text-center text-[#4b2e2e] space-y-8">
    <h2 class="text-4xl md:text-5xl font-bold tracking-wide" style="font-family: 'The Seasons'">
      A Note on Gifts
    </h2>
    <p
      class="text-base md:text-lg max-w-2xl mx-auto"
      style="font-family: 'Aviano Sans', sans-serif"
    >
      Your presence at our wedding is the greatest gift of all. If you wish to contribute to our
      future together, you can do so via the QR code linked to our UnionBank account.
    </p>
    <a
      href="#"
      class="inline-block bg-[#4b2e2e] text-white px-6 py-3 rounded-full text-base md:text-lg font-semibold hover:bg-[#6a3f3f] transition"
      style="font-family: 'Aviano Sans', sans-serif"
      >Download QR Code Here</a
    >
    <p class="text-md max-w-xl mx-auto" style="font-family: 'Aviano Sans', sans-serif">
      Your generosity will help us as we start this new chapter together, and we are deeply
      grateful.
    </p>
  </section>
  <section
    class="bg-[url('/img/backgrounds/section_8_bg.jpg')] bg-cover bg-center min-h-screen px-6 py-12 text-center text-[#f5f0e6] space-y-8"
  >
    <h2 class="text-4xl md:text-5xl font-bold tracking-wide" style="font-family: 'The Seasons'">
      Where to Stay
    </h2>
    <p
      class="text-base md:text-lg max-w-2xl mx-auto"
      style="font-family: 'Aviano Sans', sans-serif"
    >
      Please feel free to book directly at any of the suggested accommodations.
    </p>

    <div
      class="space-y-6 max-w-3xl mx-auto text-left"
      style="font-family: 'Aviano Sans', sans-serif"
    >
      <div class="space-y-2">
        <h3 class="text-xl md:text-2xl font-semibold">Our Reception Venue</h3>
        <p class="text-base md:text-lg">
          Alta Veranda de Tibig<br />Distance to Church: approx. 12 minutes
        </p>
        <a
          href="#"
          class="inline-block bg-[#4b2e2e] text-white px-4 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-[#6a3f3f] transition"
          >Inquire Here</a
        >
      </div>

      <div class="space-y-2">
        <h3 class="text-xl md:text-2xl font-semibold">Nearby Hotels</h3>
        <p class="text-base md:text-lg">
          Microtel by Wyndham, South Forbes<br />Distance to Church: approx. 5 minutes
        </p>
        <div class="space-x-2">
          <a
            href="#"
            class="inline-block bg-[#4b2e2e] text-white px-4 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-[#6a3f3f] transition"
            >Book Here</a
          >
          <a
            href="#"
            class="inline-block bg-white text-[#4b2e2e] px-4 py-2 rounded-full font-semibold text-sm md:text-base border border-[#4b2e2e] hover:bg-[#f5eae6] transition"
            >Get Directions</a
          >
        </div>

        <p class="text-base md:text-lg mt-4">
          Seda Hotel, Nuvali<br />Distance to Church: approx. 15 minutes
        </p>
        <div class="space-x-2">
          <a
            href="#"
            class="inline-block bg-[#4b2e2e] text-white px-4 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-[#6a3f3f] transition"
            >Book Here</a
          >
          <a
            href="#"
            class="inline-block bg-white text-[#4b2e2e] px-4 py-2 rounded-full font-semibold text-sm md:text-base border border-[#4b2e2e] hover:bg-[#f5eae6] transition"
            >Get Directions</a
          >
        </div>
      </div>

      <div class="space-y-2 mt-6">
        <h3 class="text-xl md:text-2xl font-semibold">Nearby Airbnb</h3>
        <p class="text-base md:text-lg">
          Stanford Suites<br />Distance to Church: approx. 2 minutes
        </p>
        <a
          href="#"
          class="inline-block bg-white text-[#4b2e2e] px-4 py-2 rounded-full font-semibold text-sm md:text-base border border-[#4b2e2e] hover:bg-[#f5eae6] transition"
          >Get Directions</a
        >
      </div>
    </div>
  </section>
 

  <!-- Footer -->
  <footer
    :class="
      isDark
        ? 'py-6 mt-10 text-center text-pink-200 bg-[linear-gradient(90deg,_#312e81_0%,_#512731_100%)]'
        : 'py-6 mt-10 text-center text-pink-900 bg-[linear-gradient(90deg,_#fbcfe8_0%,_#512731_100%)]'
    "
  >
    <p
      class="font-script text-xl"
      style="font-family: 'Dancing Script', cursive; letter-spacing: 0.01em"
    >
      {{ conf.footerNote }}
    </p>
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
