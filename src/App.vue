<script setup>
import conf from '@/config/config.json'
import { ref, onMounted, computed, onUnmounted } from 'vue'
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
// import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
// import WavyBackground from '@/components/WavyBackground.vue'
import FluidCursor from '@/components/FluidCursor.vue'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
  // const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  // const saved = localStorage.getItem('theme')
  // if (saved === 'dark' || (!saved && systemDark)) {
  //   setDarkMode(true)
  // } else {
  //   setDarkMode(false)
  // }
})

const countdown = ref('')
const countdownDays = ref('00')
const countdownHours = ref('00')
const countdownMinutes = ref('00')
const countdownSeconds = ref('00')
const lightboxOpen = ref(false)
const lightboxImg = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  // guests: '',
  attending: '',
  contact_no: '',
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

function scrollToNextSection() {
  const sections = Array.from(document.querySelectorAll('section'))
  const currentY = window.scrollY
  const next = sections.find(section => section.offsetTop > currentY + 20)
  if (next) {
    next.scrollIntoView({ behavior: 'smooth' })
  } else if (sections.length) {
    sections[sections.length - 1].scrollIntoView({ behavior: 'smooth' })
  }
}

function scrollToPreviousSection() {
  const sections = Array.from(document.querySelectorAll('section'))
  const currentY = window.scrollY
  const prevSections = sections.filter(section => section.offsetTop < currentY - 20)
  if (prevSections.length) {
    prevSections[prevSections.length - 1].scrollIntoView({ behavior: 'smooth' })
  } else if (sections.length) {
    sections[0].scrollIntoView({ behavior: 'smooth' })
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

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        } else {
          entry.target.classList.remove('revealed')
        }
      })
    },
    { threshold: 0.2 }
  )
  const reveals = document.querySelectorAll('[data-reveal]')
  reveals.forEach(el => observer.observe(el))

  onUnmounted(() => {
    observer.disconnect()
  })
})

function openLightbox(src) {
  lightboxImg.value = src
  lightboxOpen.value = true
}

async function submitRSVP() {
  if (!form.value.firstName || !form.value.lastName || !form.value.attending) {
    responseMessage.value = 'Please fill in all required fields.'
    return
  }
  try {

    const origin = window.location.origin
    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbz258_BHDDTkLwk0KSQRJ6Fxi-EMYGkXRx1BbPU29SorMsInoN_TRZGXHTxu1khyYys/exec?origin=${encodeURIComponent(origin)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form.value })
      }
    )

    if (res.ok) {
      responseMessage.value = 'Thank you! Your RSVP has been recorded.'
      form.value = {
        firstName: '',
        lastName: '',
        attending: '',
        notes: '',
        contact_no: ''
      }
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
      class="rounded-full shadow bg-[#fffaf6]/80 dark:bg-black/60 border-pink-200" :aria-pressed="isDark"
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

  <section class="min-h-screen flex flex-col items-center justify-center gap-y-10 bg-[#512731] text-white py-0 px-5">
    <div class="text-center space-y-0">
      <!-- Arc Text -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 250" class="mx-auto -mb-35 w-75 h-62">
        <!-- Arc Path -->
        <path id="arcPath" d="M50,200 A200,200 0 0,1 450,200" fill="none" stroke="transparent" />
        <!-- Text on Path -->
        <text fill="white" class="text-[30px] md:text-[45px]" letter-spacing="5"
          style="font-family: 'Aviano Sans', sans-serif">
          <textPath xlink:href="#arcPath" startOffset="50%" text-anchor="middle">
            THE WEDDING OF
          </textPath>
        </text>
      </svg>

      <!-- Main Text -->
      <div data-reveal class="flex flex-col items-center justify-center space-y-2"><br>
        <p class="text-[80px] md:text-[120px] m-0 leading-[0.8]" style="font-family: 'HeaderFont';">
          JAY
        </p>
        <p class="text-[30px] md:text-[80px] m-0 leading-[0.8]" style="font-family: 'Arsenica Trial';">
          &
        </p>
        <p class="text-[80px] md:text-[120px] m-0 leading-[1.15]" style="font-family: 'HeaderFont';">
          GEN
        </p>
      </div>
      <div style="font-family: 'Aviano Sans'; font-weight: 600;">
        <br></br>
        <p class="text-base mt-2">AT SILANG, CAVITE</p>
        <p class="text-base mt-2">TUESDAY • APRIL 28, 2026 • 1:00 PM</p>
      </div>
    </div>
  </section>

  <section
    class="flex flex-col bg-[#fffaf6]  min-h-screen justify-center items-center text-center text-[#4b2e2e] space-y-20 px-10">
    <!-- Placeholder Image -->
    <img data-reveal src="/img/roses1.png" alt="Floral artwork" class="mx-auto w-auto" />

    <!-- Countdown Timer -->
    <div data-reveal class="flex justify-center space-x-5 md:space-x-10 text-center" aria-live="polite">
      <div>
        <div class="text-4xl md:text-6xl" style="font-family: 'Lora';">{{ countdownDays }}</div>
        <div class="uppercase text-sm" style="font-family: 'Cormorant Garamond Italic';">Days</div>
      </div>
      <div>
        <div class="text-4xl md:text-6xl" style="font-family: 'Lora';">{{ countdownHours }}</div>
        <div class="uppercase text-sm" style="font-family: 'Cormorant Garamond Italic';">Hours</div>
      </div>
      <div>
        <div class="text-4xl md:text-6xl" style="font-family: 'Lora';">{{ countdownMinutes }}</div>
        <div class="uppercase text-sm" style="font-family: 'Cormorant Garamond Italic';">Minutes</div>
      </div>
      <div>
        <div class="text-4xl md:text-6xl" style="font-family: 'Lora';">{{ countdownSeconds }}</div>
        <div class="uppercase text-sm" style="font-family: 'Cormorant Garamond Italic';">Seconds</div>
      </div>
    </div>

    <!-- Message -->
    <div class="space-y-10 flex flex-col text-center items-center">
      <div class="max-w-sm md:max-w-4xl text-sm md:text-lg" style="font-family: 'Aviano Sans'; line-height: 1.75;">
        <p>We're counting down to our wedding day and couldn't be more excited to celebrate with you.</p>
        <p>We've created this website to share all the details as we get closer to "I do."</p>
        <p>Thank you for being part of our lives and celebrating this next chapter with us.</p>

      </div>
      <div class="flex flex-col items-center">
        <p class="-mb-1" style="font-family: 'Aviano Sans'">With love,</p>
        <div data-reveal class="flex items-center">
          <p class="text-[40px]" style="font-family: 'HeaderFont'">JAY</p>
          <p class="text-[20px]" style="font-family: 'Arsenica Trial'">&</p>
          <p class="text-[40px]" style="font-family: 'HeaderFont'">GEN</p>
        </div>
      </div>
    </div>
  </section>

  <section
    class="relative bg-[#fffaf6] min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-12 text-center space-y-8 text-[#4b2e2e]">
    <!-- Top Right Floral -->
    <img src="/img/roses2.png" alt="Top left floral" class="absolute top-5 left-0 w-30 md:w-80" />

    <!-- Bottom Left Floral (rotated for balance) -->
    <img src="/img/roses2.png" alt="Bottom right floral" class="absolute bottom-0 right-0 w-30 md:w-80"
      style="transform: rotate(180deg)" />

    <!-- RSVP Content -->
    <div class="max-w-xl space-y-6">
      <h2 data-reveal class="text-5xl md:text-6xl font-bold tracking-wide"
        style="font-family: 'Cormorant Garamond Italic'">
        RSVP
      </h2>
      <div style="font-family: 'Aviano Sans'" class="space-y-4">
        <p class="text-sm md:text-lg">
          Please respond by <strong>March 8</strong>
        </p>

        <form @submit.prevent="submitRSVP" class="flex flex-col gap-4">
          <div class="flex flex-col gap-4 md:flex-row">
            <Input class="border-[#512731] flex-1" v-model="form.firstName" placeholder="First Name" required />
            <Input class="border-[#512731] flex-1" v-model="form.lastName" placeholder="Last Name" required />
          </div>
          <!-- <Input v-model="form.guests" type="number" placeholder="Number of Guests" /> -->
          <div class="flex items-center gap-5">
            <!-- <Select class="border-[#512731]" v-model="form.attending" required> -->
            <p class="border-[#512731]">Will you attend?</p>
            <RadioGroup class="flex cursor-pointer gap-8" v-model="form.attending" default-value="">
              <div class="flex items-center space-x-2">
                <RadioGroupItem class="border-[#512731] cursor-pointer" id="Yes" value="Yes" />
                <Label class="cursor-pointer" for="Yes">Yes</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem class="border-[#512731] cursor-pointer" id="No" value="No" />
                <Label class="cursor-pointer" for="No">No</Label>
              </div>

            </RadioGroup>
            <!-- </Select> -->

          </div>
          <Textarea class="border-[#512731]" v-model="form.notes" :placeholder="conf.rsvp && conf.rsvp.notesPlaceholder ? conf.rsvp.notesPlaceholder : 'Notes'
            " />
          <Input class="border-[#512731]" v-model="form.contact_no" placeholder="Contact Number (optional)" />
          <Button type="submit" class="cursor-pointer bg-[#512731] hover:bg-[#5f3841]/25 text-white text-xl rounded-full"
            style="font-family: 'Aviano Sans'">Submit RSVP</Button>
        </form>

        <div class="text-sm md:text-lg space-y-4">
          While we would love to celebrate with everyone, we are keeping our gathering small and intimate. We kindly ask
          that only invited guests attend, and we really appreciate your understanding and warm wishes!
        </div>
      </div>
    </div>
  </section>

  <section
    class="flex flex-col bg-[#fffaf6] min-h-screen justify-center items-center text-justify text-[#4b2e2e] space-y-0 p-10">
    <!-- <div class="md:w-1/3 w-full flex justify-center">
      <img src="/img/roses3.png" alt="Floral illustration" class="w-40 md:w-full object-contain" />
    </div> -->

    <div class="md:w-2/3 w-full space-y-6 max-w-3xl text-center ">
      <h2 data-reveal class="rounded-lg text-3xl font-bold tracking-wide p-10"
        style="font-family: 'Cormorant Garamond Italic', serif">
        <div class="flex flex-col">
          <p class="text-3xl md:text-5xl" style="font-family: 'HeaderFont'">OUR</p>
          <p class="text-5xl md:text-7xl -mt-5" style='font-family: "Swear Display Light Cilati";'>Love Story</p>
        </div>

      </h2>
      <!-- <div data-reveal class="flex items-center justify-center  ">
        <p class="text-4xl md:text-5xl" style="font-family: 'Agatho Light Caps'">J</p>
        <p class="text-4xl md:text-5xl" style="font-family: 'Arsenica Trial'">&</p>
        <p class="text-4xl md:text-5xl" style="font-family: 'Agatho Light Caps'">G</p>
      </div> -->
      <div style="font-family: 'Cormorant Garamond Italic'">
        <p class="text-sm md:text-xl mb-2">
          Jay & Gen first crossed paths in Grade 5, just familiar faces in the same halls.
          It wasn't until highschool, when their friend groups intertwined, that fate stepped in and began to rewrite
          the story.
        </p>
        <p class="text-sm md:text-xl mb-2">
          What started as a slow dance soon turned into pick-up lines, digital Polaroids, friendly table tennis matches,
          and math
          tutoring sessions—all simple moments that made ordinary days unforgettable.
        </p>
        <p class="text-sm md:text-xl mb-2">
          In 2011, Jay knew his heart had made its choice. He courted Gen with patience and charm, and six months later,
          on a rainy August evening with Aerosmith's "I Don't Want to Miss a Thing" playing softly in the background,
          Gen finally said yes. That was the moment their story as highschool sweethearts truly began.
        </p>
        <p class="text-sm md:text-xl mb-2">
          Over more than a decade, celebrating milestones, figuring out adulting, binge-watching superhero and anime
          series, movie date nights, weekend getaways, and exploring new foods and places across cities and countries,
          every experience together has felt like its own little adventure. Yet through life's ups and downs, they've
          remained each other's home—a safe space, a steady comfort, and the constant they always come back to.
        </p>
        <p class="text-sm md:text-xl mb-2">
          On an intimate anniversary weekend in Batangas, just before sunset, as they watched the gentle waves crash
          along the shore, Jay asked Gen to spend forever with him —and she said yes.
        </p>
        <p class="text-sm md:text-xl leading-relaxed mb-2">
          By grace and through faith, they are now ready for the adventure of a lifetime, surrounded
          by the people who have supported and celebrated alongside them throughout the years.
        </p>
      </div>
    </div>
  </section>

  <section
    class="bg-[url('/img/backgrounds/church_bg.jpg')] bg-cover text-white min-h-screen flex flex-col items-center justify-center text-center"
    style="background-position: center 40%;">
    <h2 data-reveal class="text-2xl md:text-4xl mb-20" style="font-family: 'Swear Display Light Cilati';">
      <div class="flex items-center justify-center gap-5">
        directions to the
      </div>
      <p class="text-5xl md:text-7xl" style="font-family: 'HeaderFont'">VENUES</p>
    </h2>
    <div class="flex flex-col md:flex-row md:space-x-50 gap-10" style="font-family: 'Aviano Sans'">
      <div>
        <h3 class="text-sm md:text-xl">Ceremony at</h3>
        <div class="flex flex-col">
          <p class="text-base md:text-2xl" style="font-family: 'Lora'"><strong>ST. BENEDICT PARISH</strong></p>
          <p class="text-base md:text-xl" style="font-family: 'Cormorant Garamond Italic';">Ayala Westgrove
            Heights, South Boulevard, Silang, Cavite</p>
        </div>
        <a href="https://maps.app.goo.gl/6oRHBgGha6fQicPo8"
          class="mt-2 inline-block bg-[#fffaf6] text-[#512731] px-4 py-2 rounded-full text-sm md:text-sm"
          target="_blank" rel="noreferrer">Get Directions</a>
      </div>
      <div>
        <h3 class="text-sm md:text-xl">Reception will follow at</h3>
        <div class="flex flex-col">
          <p class="text-base md:text-2xl" style="font-family: 'Lora'"><strong>ALTA VERANDA DE TIBIG</strong></p>
          <p class="text-base md:text-xl" style="font-family: 'Cormorant Garamond Italic';">Alcalde St. Brgy. Tibig,
            Silang, Cavite
          </p>
        </div>
        <a href="https://maps.app.goo.gl/YAr1f6YgVdHib9RZA"
          class="mt-2 inline-block bg-[#fffaf6] text-[#512731] px-4 py-2 rounded-full text-sm md:text-base"
          target="_blank" rel="noreferrer">Get Directions</a>
      </div>
    </div>
  </section>

  <!-- Dress Code Section -->
  <section
    class="flex flex-col bg-white min-h-screen justify-center items-center text-center text-[#4b2e2e] space-y-20 px-6 md:px-16"
    style="font-family: 'Aviano Sans'">
    <div data-reveal class="flex flex-col">
      <p class="text-4xl md:text-5xl" style="font-family: 'HeaderFont'">THE</p>
      <p class="text-6xl md:text-7xl -mt-5" style='font-family: "Swear Display Light Cilati";'>Dress Code</p>
    </div>
    <div class="flex flex-col items-center max-w-sm md:max-w-3xl text-sm md:text-lg">
      <p>Please wear formal attire, and we kindly ask guests to avoid white.</p><br>
      <p><strong>Gentlemen:</strong> Beige barong with black slacks</p>
      <p><strong>Ladies:</strong> Long, flowy gowns or dresses</p>
      <!-- Color Palette Circles -->
      <div class="flex justify-center space-x-4 my-6">
        <div class="flex justify-center space-x-2">
          <div class="w-9 h-9 md:w-12 md:h-12 rounded-full" style="background-color:#b4b29dff;"></div>
          <!-- Sage Green -->
          <div class="w-9 h-9 md:w-12 md:h-12 rounded-full" style="background-color:#a495a8ff;"></div> <!-- Lilac -->
          <div class="w-9 h-9 md:w-12 md:h-12 rounded-full" style="background-color:#c6a4a2ff;"></div>
          <!-- Blush Pink-->
          <div class="w-9 h-9 md:w-12 md:h-12 rounded-full" style="background-color:#e8b8acff;"></div>
          <!-- Soft Peach -->
          <div class="w-9 h-9 md:w-12 md:h-12 rounded-full" style="background-color:#f7e7cdff;"></div> <!-- Champagne-->
        </div>
      </div>

      <p>Celebrate our summer wedding with us in light, soft pastel colors. Any gentle, muted shade is perfect, and
        delicate florals are welcome.</p>

    </div>



    <a href="https://pin.it/6rZBNSOw1"
      class="inline-block bg-[#512731] text-white px-6 py-3 rounded-full text-base md:text-lg font-semibold hover:bg-[#5f3841] transition">View
      Attire Pegs Here</a>
  </section>

  <!-- A NOTE ON Gifts -->
  <section class="min-h-screen flex items-center justify-center px-6 py-12 text-center text-[#512731]"
    style="background-image: linear-gradient(rgba(255,250,246,0.4), rgba(255,250,246,0.75)), url('/img/roses3.png'); background-size: cover; background-position: center;">
    <div
      class="mx-auto flex max-w-3xl flex-col items-center space-y-6 rounded-4xl border border-[#512731] bg-white/60 px-8 py-14 shadow-[0_30px_60px_rgba(0,0,0,0.08)]"
      style="backdrop-filter: blur(14px); font-family: 'Aviano Sans'">

      <!-- Heading -->
      <div data-reveal class="flex flex-col items-center text-center">
        <p class="text-4xl md:text-5xl" style="font-family: 'HeaderFont'">A NOTE ON</p>
        <p class="text-6xl md:text-7xl -mt-5 bold" style='font-family: "Swear Display Light Cilati";'>Gifts</p>
      </div>

      <!-- Body -->
      <p class="text-base md:text-lg max-w-xl">
        Your presence at our wedding is the greatest gift of all. If you wish to contribute to our future together,
        you can do so via the QR code linked to our UnionBank account.
      </p>

      <!-- Button -->
      <Button as="a" href="https://drive.google.com/file/d/1TFCZm7wWcSzReCtw6GP6YAcckbTkRuRW/view?usp=sharing"
        target="_blank" rel="noreferrer"
        class="cursor-pointer rounded-full bg-[#512731] text-white px-6 py-3 font-semibold hover:bg-[#5f3841] transition">
        Download QR Code Here
      </Button>

      <!-- Closing -->
      <p class="text-base md:text-lg max-w-xl">
        Your generosity will help us as we start this new chapter together, and we are deeply grateful.
      </p>
    </div>
  </section>


  <!-- Footer -->
  <footer class="bg-[#512731] text-center text-white py-8 px-4 space-y-2">
    <p class="font-script text-sm" style="font-family: 'Cormorant Garamond Italic'">
      <em>with love and gratitude,</em>
    </p>
    <p class="text-sm" style="font-family: 'Lora'">
      <span style="font-family: 'Lora';">© 2026</span> JAY <span style="font-family: 'Arsenica Trial'">&</span> GEN
    </p>
  </footer>

  <!-- Lightbox -->
  <div v-if="lightboxOpen" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
    @click="lightboxOpen = false">
    <img :src="lightboxImg" class="max-h-[90%] max-w-[90%] rounded-lg shadow-lg" />
  </div>
  <button type="button" @click="scrollToPreviousSection"
    class="cursor-pointer fixed border-[1px] left-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#512731] text-white shadow-2xl transition hover:-translate-y-2 hover:bg-[#512731]/25"
    aria-label="Scroll to previous section">
    <span class="text-2xl leading-none">↑</span>
  </button>
  <button type="button" @click="scrollToNextSection"
    class="cursor-pointer fixed border-[1px] right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#512731]/25 text-[#512731] shadow-2xl transition hover:-translate-y-2 hover:bg-white"
    aria-label="Scroll to next section">
    <span class="text-2xl leading-none">↓</span>
  </button>
</template>
