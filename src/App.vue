<script setup>
import conf from '@/config/config.json'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
const coupleNames = conf.coupleNames
const schedule = conf.schedule
const weddingDateRaw = conf.weddingDate
const location = conf.location
const email = conf.email
const phone = conf.phone
const venue = conf.venue
const registryLink = conf.registryLink
const giftsBgStyle = {
  backgroundImage: `linear-gradient(rgba(255,250,246,0.75), rgba(255,250,246,0.7)), url('${import.meta.env.BASE_URL}img/roses3.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}

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

// Reactive form state
const form = reactive({
  firstName: '',
  lastName: '',
  attending: '',
  notes: '',
  contact_no: ''
})

// Reactive message state
const responseMessage = ref('')
const responseStatus = ref('')


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
  if (!form.firstName || !form.lastName || !form.attending) {
    responseMessage.value = 'Please fill in all required fields.'
    responseStatus.value = 'error'
    return
  }

  try {
    const body = new URLSearchParams({
      firstName: form.firstName,
      lastName: form.lastName,
      attending: form.attending,
      notes: form.notes,
      contact_no: form.contact_no
    })
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbyiD1lnAV5qIRiDrxAtlrHFHotl1vtH64MBrGKB26e5sB7gABK3UyXVTARPF5qhxruG/exec",
      {
        method: "POST",
        body
      }
    )

    if (res.ok) {
      const data = await res.json()
      if (data.ok) {
        responseMessage.value = 'Thank you! Your RSVP has been recorded.'
        responseStatus.value = 'success'
        // Reset form
        form.firstName = ''
        form.lastName = ''
        form.attending = ''
        form.notes = ''
        form.contact_no = ''
      } else {
        throw new Error(data.error || 'Submission failed')
      }
    } else {
      throw new Error('Network response was not ok')
    }
  } catch (err) {
    console.error(err)
    responseMessage.value = 'Oops! Something went wrong. Please try again.'
    responseStatus.value = 'error'
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





<section class="min-h-screen flex flex-col items-center
                justify-center md:justify-between
                bg-[#512731] text-white px-6 md:px-16 py-10 md:py-16">

<!-- Top Arc Text -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200"
     class="mx-auto w-5/6 md:w-2/3 h-20 md:h-28" preserveAspectRatio="xMidYMin meet" style="overflow: visible;">

  <!-- Mobile Arc Path -->
  <path id="arcPathMobile" d="M50,120 A180,60 0 0,1 450,120" class="md:hidden" fill="none" stroke="transparent" />

  <!-- Desktop Arc Path -->
  <path id="arcPathDesktop" d="M40,120 A220,60 0 0,1 460,120" class="hidden md:block" fill="none" stroke="transparent" />

  <text fill="white" style="font-family: 'Manrope Bold', sans-serif;">
    <!-- Mobile Text -->
    <textPath xlink:href="#arcPathMobile" startOffset="50%" text-anchor="middle" class="md:hidden"
              style="font-size:28px; letter-spacing:6px; line-height:1.3;">
      THE WEDDING OF
    </textPath>

    <!-- Desktop Text -->
    <textPath xlink:href="#arcPathDesktop" startOffset="50%" text-anchor="middle" class="hidden md:inline"
              style="font-size:28px; letter-spacing:8px; line-height:1.3;">
      THE WEDDING OF
    </textPath>
  </text>
</svg>


<!-- Main Names -->
<div data-reveal class="w-full flex items-center justify-center -mt-2 md:-mt-4 mb-10 md:mb-0">
  <div class="hero-name text-[16vw] md:text-[120px] lg:text-[120px] whitespace-nowrap"
       style="font-family: 'Mermaid'; line-height:1;">
    JAY & GEN
  </div>
</div>

  <!-- Bottom Content: Button + Ceremony Info -->
  <div class="flex flex-col items-center w-full max-w-3xl text-center">

    <!-- Calendar Button -->
    <Button
      as="a"
      href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Jay+%26+Gen+Wedding&dates=20260428T050000Z/20260428T120000Z&location=St.+Benedict+Parish,+Silang,+Cavite&details=We%E2%80%99re+getting+married!%0AJoin+us+as+we+celebrate+our+love.%0AMore+details+at+jaygenwedding.com%0A%0A1:00+PM+%E2%80%A2+Wedding+Ceremony%0ASt.+Benedict+Parish,+Silang,+Cavite%0A%0A4:00+PM+%E2%80%A2+Reception%0AAlta+Veranda+de+Tibig,+Silang,+Cavite%0A%0AReminder:%0APlease+adjust+your+notification+settings+after+adding+this+event+to+your+calendar+(recommended:+1+day+before+%26+1+hour+before)."
      target="_blank"
      rel="noreferrer"
      class="mt-6 sm:mt-8 md:mt-6 inline-flex items-center border border-[#5f3841] bg-[#512731] gap-2 cursor-pointer rounded-full text-white text-xs sm:text-sm md:text-sm px-4 py-2 hover:bg-[#5f3841]/25 uppercase"
      style="font-family: 'Manrope Bold'">
      <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 fill-current">
        <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm12 8H5v10h14V10Z" />
      </svg>
      <span>TUESDAY • APRIL 28, 2026 • 1:00 PM</span>
    </Button>

    <!-- Ceremony & Reception Info -->
    <div class="mt-4 sm:mt-6 md:mt-8 max-w-xs sm:max-w-2xl md:max-w-4xl text-[0.9rem] sm:text-base md:text-lg" style="font-family: 'Libre Baskerville', serif; line-height:1.5;">
      <span class="text-[0.8em] sm:text-sm md:text-sm"><em>ceremony at</em></span><br>
      <span class="text-base sm:text-lg md:text-xl font-semibold">ST. BENEDICT PARISH</span><br>
      <span class="text-[0.8em] sm:text-sm md:text-sm"><em>reception will follow at</em></span><br>
      <span class="text-base sm:text-lg md:text-xl font-semibold">ALTA VERANDA DE TIBIG<br> - PLAZA GUEVARRA</span><br>
      <span class="text-[0.85em] sm:text-sm md:text-sm">SILANG, CAVITE</span>
    </div>

  </div>
</section>







<section
  class="flex flex-col bg-[#EFE7E1] min-h-screen justify-center items-center text-center text-[#4b2e2e] space-y-12 md:space-y-16 px-6 md:px-16 lg:px-72 xl:px-88"
  style="font-family: 'Manrope'">
  
  <!-- Floral Artwork with top margin on desktop -->
  <img data-reveal src="/img/roses1.png" alt="Floral artwork"
       class="block mx-auto w-80 md:w-100 mt-8 md:mt-16"/>

  <!-- Countdown Timer with responsive sizing and spacing -->
  <div data-reveal 
       class="flex justify-center text-center w-full max-w-md md:max-w-none px-4 md:px-0 space-x-3 md:space-x-10" 
       aria-live="polite">

    <div>
      <div class="text-3xl sm:text-4xl md:text-6xl" style="font-family: 'Libre Baskerville Regular';">
        {{ countdownDays }}
      </div>
      <div class="uppercase text-xs sm:text-sm md:text-sm" style="font-family: 'Libre Baskerville Regular';">Days</div>
    </div>

    <div>
      <div class="text-3xl sm:text-4xl md:text-6xl" style="font-family: 'Libre Baskerville Regular';">
        {{ countdownHours }}
      </div>
      <div class="uppercase text-xs sm:text-sm md:text-sm" style="font-family: 'Libre Baskerville Regular';">Hours</div>
    </div>

    <div>
      <div class="text-3xl sm:text-4xl md:text-6xl" style="font-family: 'Libre Baskerville Regular';">
        {{ countdownMinutes }}
      </div>
      <div class="uppercase text-xs sm:text-sm md:text-sm" style="font-family: 'Libre Baskerville Regular';">Minutes</div>
    </div>

    <div>
      <div class="text-3xl sm:text-4xl md:text-6xl" style="font-family: 'Libre Baskerville Regular';">
        {{ countdownSeconds }}
      </div>
      <div class="uppercase text-xs sm:text-sm md:text-sm" style="font-family: 'Libre Baskerville Regular';">Seconds</div>
    </div>

  </div>

  <!-- Message -->
  <div class="flex flex-col items-center text-sm md:text-lg w-full max-w-md sm:max-w-2xl md:max-w-3xl px-4 sm:px-6">

  <p class="text-sm md:text-lg max-w-xl">
  We're counting down to our wedding day and have created this website to share every detail as we get closer to “I do.”
  </p><br>

  <p class="text-sm md:text-lg max-w-xl">
  To our family and friends, thank you for being part of our lives and for celebrating this next chapter with us.
  </p>
      
  </div>

    <!-- Signature -->
    <div class="flex flex-col items-center mb-12 md:mb-20">
      <p class="font-script text-sm md:text-lg" style="font-family: 'Libre Baskerville Regular'; line-height: 1.5;">with love,</p>
      <div data-reveal class="flex items-center space-x-2 md:space-x-4">
        <p class="text-[30px] md:text-[50px]" style="font-family: 'Mermaid'">JAY & GEN</p>
      </div>
    </div>
    
</section>






 <!-- Directions the Venues Section -->
 <section
    class="bg-[url('/img/backgrounds/church_bg.jpg')] bg-cover text-white min-h-screen flex flex-col items-center justify-center text-center
           bg-[center_45%]">

    <h2 data-reveal class="text-2xl md:text-4xl mb-20" style="font-family: 'Swear Display Light Cilati';">
      <div class="flex items-center justify-center gap-5">
        directions to the
      </div>
      <p class="text-5xl md:text-7xl" style="font-family: 'HeaderFont'">VENUES</p>
    </h2>
    <div class="flex flex-col md:flex-row md:space-x-50 gap-10" style="font-family: 'Manrope'">
      <div>
        <h3 class="text-sm md:text-xl" style="font-family: 'Manrope Bold'; line-height: 3;">THE CEREMONY</h3>

        <div class="flex flex-col">
          <p class="text-base md:text-2xl" style="font-family: 'Libre Baskerville Regular';"><strong>ST. BENEDICT PARISH</strong></p>

          <p class="text-sm md:text-lg" style="font-family: 'Libre Baskerville Regular';">Ayala Westgrove Heights, South Boulevard, <br>Silang, Cavite</p>
        </div>
        <a href="https://maps.app.goo.gl/6oRHBgGha6fQicPo8"
          class="mt-2 inline-block bg-[#fffaf6] text-[#512731] px-4 py-2 rounded-full text-xs md:text-sm uppercase"
          target="_blank" rel="noreferrer" style="font-family: 'Manrope Bold'">GET DIRECTIONS</a>
      </div>
      <div>
        <h3 class="text-sm md:text-xl" style="font-family: 'Manrope Bold'; line-height: 3;">THE RECEPTION</h3>

        <div class="flex flex-col">
          <p class="text-base md:text-2xl" style="font-family: 'Libre Baskerville Regular';"><strong>ALTA VERANDA DE TIBIG<br> - PLAZA GUEVARRA</strong></p>

          <p class="text-sm md:text-lg" style="font-family: 'Libre Baskerville Regular';">Alcalde St. Brgy. Tibig,
            Silang, Cavite
          </p>
        </div>
        <a href="https://maps.app.goo.gl/YAr1f6YgVdHib9RZA"
          class="mt-2 inline-block bg-[#fffaf6] text-[#512731] px-4 py-2 rounded-full text-xs md:text-sm uppercase"
          target="_blank" rel="noreferrer" style="font-family: 'Manrope Bold'">GET DIRECTIONS</a>
      </div>
    </div>
  </section>

  <!-- Dress Code Section -->
<section
  class="flex flex-col bg-[#EFE7E1] min-h-screen justify-center items-center text-center text-[#4b2e2e] 
         px-4 sm:px-6 md:px-16 pt-16 md:pt-24 pb-10 space-y-0"
  style="font-family: 'Manrope'">

  <!-- Heading -->
  <div data-reveal class="flex flex-col">
    <p class="text-4xl md:text-5xl" style="font-family: 'HeaderFont'">THE</p>
    <p class="text-6xl md:text-7xl -mt-5" style='font-family: "Swear Display Light Cilati";'>Dress Code</p>
  </div>
<br>
  <!-- Guest Attire Image -->
<img data-reveal src="/img/guest-attire.png" alt="Guest attire"
     class="mx-auto my-4 w-36 md:w-48 lg:w-56 object-contain" />

  <!-- Dress Code Text -->
  <div class="flex flex-col items-center text-sm md:text-lg w-full max-w-md sm:max-w-2xl md:max-w-3xl px-4 sm:px-6">

    <p class="text-sm md:text-lg max-w-xl">
      We kindly request our guests to wear formal attire.<br><br>
      <strong>Gentlemen:</strong> beige barong with black slacks<br>
      <strong>Ladies:</strong> long gowns or dresses in any color from our palette:
    </p>

    <!-- Color Palette Circles -->
    <div class="flex justify-center my-6 -space-x-2 md:-space-x-3">
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-full" style="background-color:#452e1e;"></div>
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-full" style="background-color:#733015;"></div>
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-full" style="background-color:#845a2d;"></div>
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-full" style="background-color:#541028;"></div>
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-full" style="background-color:#be8483;"></div>
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-full" style="background-color:#53503f;"></div>
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-full" style="background-color:#80856d;"></div>
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-full" style="background-color:#cfab7b;"></div>
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-full" style="background-color:#f4ddb4;"></div>
    </div>

    <p class="text-xs md:text-sm uppercase" style="font-family: 'Manrope Bold'">
      Please reserve white for the bride.
    </p><br>

    <p class="text-sm md:text-lg max-w-xl">
    Our reception will include a garden area for the cocktail hour. For comfort and safety while walking on the grass, we recommend wearing comfortable and stable heels, wedges, or flats.
    </p>

  </div>
</section>



<!-- FAQ Section -->
<section
  class="relative bg-[#EFE7E1] min-h-screen flex flex-col items-center justify-center
         px-6 md:px-16 lg:px-72 xl:px-88
         py-12 text-center space-y-8 text-[#4b2e2e]">

  <!-- Top Left Floral -->
  <img src="/img/roses2.png" alt="Top left floral"
    class="absolute top-0 left-0 w-30 lg:w-80 pointer-events-none opacity-100 z-0" />

  <!-- Bottom Right Floral (rotated for balance) -->
  <img src="/img/roses2.png" alt="Bottom right floral"
    class="absolute bottom-0 right-0 w-30 lg:w-80 pointer-events-none opacity-100 z-0"
    style="transform: rotate(180deg)" />

  <!-- FAQ Content -->
  <div class="w-full max-w-3xl lg:max-w-2xl xl:max-w-3xl space-y-6">
    <h2 data-reveal class="rounded-lg text-3xl text-[#4b2e2e] font-bold tracking-wide p-10"
        style="font-family: 'Libre Baskerville', serif;">
      <div class="flex flex-col items-center text-center">
        <p class="text-5xl md:text-7xl -mt-5" style='font-family: "HeaderFont"'>
          FAQ
        </p>
      </div>
    </h2>
  </div>



<div class="px-6 sm:px-8 md:px-0 pb-16 space-y-4 text-sm md:text-lg">

  <p class="text-sm md:text-lg mb-6 leading-normal">
    <span style="font-family: 'Libre Baskerville', serif; font-weight: bold; font-style: italic;">
      Can I bring a plus one or additional guest?
    </span><br>
    <span style="font-family: 'Manrope', sans-serif;">
      While we'd love to celebrate with everyone, to keep our gathering small and intimate, we're only able to accommodate guests who are formally invited. We appreciate your understanding and your warm wishes!
    </span>
  </p>

  <p class="text-sm md:text-lg mb-6 leading-normal">
    <span style="font-family: 'Libre Baskerville', serif; font-weight: bold; font-style: italic;">
      Is there parking available?
    </span><br>
    <span style="font-family: 'Manrope', sans-serif;">
      Yes, parking is available at both St. Benedict Parish and Alta Veranda de Tibig. For convenience, we still suggest arriving a bit early or carpooling if possible.
    </span>
  </p>

  <p class="text-sm md:text-lg mb-6 leading-normal">
    <span style="font-family: 'Libre Baskerville', serif; font-weight: bold; font-style: italic;">
      How about gifts?
    </span><br>
    <span style="font-family: 'Manrope', sans-serif;">
      Your presence at our wedding is the greatest gift we could ask for. If you wish to contribute to our future together, a QR code linked to our UnionBank account is available below.
    </span>
  </p>

  <!-- Button -->
  <Button as="a" href="https://drive.google.com/file/d/1TFCZm7wWcSzReCtw6GP6YAcckbTkRuRW/view?usp=sharing"
    target="_blank" rel="noreferrer"
    class="cursor-pointer rounded-full bg-[#512731] text-white px-6 py-3 font-semibold hover:bg-[#5f3841] transition text-xs md:text-sm uppercase"
    style="font-family: 'Manrope Bold'">
    DOWNLOAD QR CODE HERE
  </Button>

  <!-- Closing -->
  <p class="text-sm md:text-lg mb-6 leading-normal">
    <span style="font-family: 'Manrope', sans-serif;">
      Your generosity will help us as we start this new chapter together, and we are deeply grateful.
    </span>
  </p>

</div>
</section>







<!-- RSVP Section -->
<section class="relative min-h-screen flex items-center justify-center px-4 md:px-0">
  <!-- Background Image -->
  <div
    class="absolute inset-0 bg-cover bg-center"
    style="background-image: url('/img/backgrounds/lian.jpg');"
  ></div>

  <!-- Optional Overlay for contrast -->
  <div class="absolute inset-0 bg-black/10"></div>

  <!-- Wrapper -->
  <div class="px-4 sm:px-6">

    <!-- RSVP Box -->
    <div class="relative z-10 bg-[#EFE7E1] rounded-3xl shadow-[0_20px_50px_-8px_rgba(0,0,0,0.5)]
            max-w-sm md:max-w-md
            p-6 md:p-12 mx-auto space-y-6">
            
    <!-- RSVP Title -->
    <div data-reveal class="flex items-center justify-center w-full">
      <h2
        class="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wide text-center"
        style="font-family: 'HeaderFont', serif; color: #512731; line-height: 1.15;"
      >
      RSVP
      </h2>
    </div>

    <!-- Blinking RSVP Prompt -->
    <p
      class="text-base md:text-lg text-center"
      style="font-family: 'Manrope'; color: #512731; animation: blink 1s infinite;"
    >
      <div class="rsvp-pulse">Please respond by <strong>March 8</strong></div>
    </p>

    <!-- RSVP Form -->
    <form @submit.prevent="submitRSVP" class="flex flex-col gap-4">
      <!-- Name Fields -->
      <div class="flex flex-col gap-4 md:flex-row">
        <Input
          class="border-[#512731] flex-1 text-sm md:text-lg text-[#512731]"
          v-model="form.firstName"
          placeholder="First Name"
          required
        />
        <Input
          class="border-[#512731] flex-1 text-sm md:text-lg text-[#512731]"
          v-model="form.lastName"
          placeholder="Last Name"
          required
        />
      </div>

      <!-- Attendance -->
      <div class="flex items-center gap-5 flex-wrap">
        <p class="border-[#512731] text-sm md:text-base font-medium text-[#512731]">
          Will you attend?*
        </p>
        <RadioGroup
          class="flex cursor-pointer gap-4 sm:gap-8 flex-wrap text-sm md:text-base"
          v-model="form.attending"
        >
          <div class="flex items-center space-x-2">
            <RadioGroupItem required class="border-[#512731] cursor-pointer" id="Yes" value="Yes" />
            <Label class="cursor-pointer text-sm md:text-base text-[#512731]" for="Yes">Yes</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem required class="border-[#512731] cursor-pointer" id="No" value="No" />
            <Label class="cursor-pointer text-sm md:text-base text-[#512731]" for="No">No</Label>
          </div>
        </RadioGroup>
      </div>

      <!-- Notes and Contact -->
      <Textarea
        class="border-[#512731] text-sm md:text-lg text-[#512731]"
        v-model="form.notes"
        placeholder="Let us know any dietary notes or special requests"
      />
      <Input
        class="border-[#512731] text-sm md:text-lg text-[#512731]"
        v-model="form.contact_no"
        placeholder="Contact Number"
      />

      <!-- Submit Button -->
      <Button
        type="submit"
        class="cursor-pointer bg-[#512731] hover:bg-[#5f3841]/25 text-white text-xs md:text-sm rounded-full uppercase"
        style="font-family: 'Manrope Bold'"
      >
        SUBMIT RSVP
      </Button>

      <!-- Response Message -->
      <div
        v-if="responseMessage"
        class="rsvp-response mt-2"
        :class="responseStatus === 'success' ? 'rsvp-success' : 'rsvp-alert'"
        style="font-family: 'Manrope'; color: #512731;"
      >
        {{ responseMessage }}
      </div>
    </form>
  </div>
  </div>
</section>





  <!-- Footer -->
  <footer class="bg-[#512731] text-center text-white py-8 px-8 space-y-2">
    <p class="font-script text-sm" style="font-family: 'Manrope'">
      For any questions, feel free to message us on our social media accounts.
    </p>
    <br>
    <p class="font-script text-sm" style="font-family: 'Libre Baskerville Regular'">with love and gratitude,</p>
      
    <p class="text-sm" style="font-family: 'Libre Baskerville Regular'">
      © 2026 JAY & GEN
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
    class="cursor-pointer fixed border-[1px] right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#512731] text-white shadow-2xl transition hover:-translate-y-2 hover:bg-[#512731]/25"
    aria-label="Scroll to next section">
    <span class="text-2xl leading-none">↓</span>
  </button>
</template>

<style scoped>
./* Body text — reduce size across site while leaving headings untouched */
::v-deep(.text-xs),
::v-deep(.text-sm),
::v-deep(.text-base),
::v-deep(.md\:text-lg) {
  font-size: 9px !important;
  line-height: 1.6 !important;
}

.drop-cap {
  float: left;
  font-family: 'HeaderFont';
  font-size: 3.25rem;
  line-height: 0.85;
  margin-right: 0.5rem;
  margin-top: 0.1rem;
  color: #4b2e2e;
}

@media (min-width: 768px) {
  .drop-cap {
    font-size: 5rem;
    margin-top: 0.05rem;
  }
}

.rsvp-pulse {
  display: inline-block;
  animation: rsvp-pulse 2.8s ease-in-out infinite;
  transform-origin: center;
}

.rsvp-response {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #512731;
  background: rgba(81, 39, 49, 0.08);
  color: #512731;
  font-weight: 600;
}

.rsvp-alert {
  border-color: #b42318;
  background: rgba(180, 35, 24, 0.12);
  color: #512731;
  animation: rsvp-alert-pulse 2s ease-in-out infinite, rsvp-alert-blink 1.2s step-end infinite;
}

.rsvp-success {
  border-color: #067647;
  background: rgba(6, 118, 71, 0.12);
  color: #067647;
}

.calendar-link {
  display: inline-block;
  color: #512731;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-weight: 600;
}

.calendar-link:hover {
  color: #3f1d24;
}

@keyframes rsvp-pulse {
  0% {
    transform: scale(1) translateY(0);
  }
  35% {
    transform: scale(1.06) translateY(-2px);
  }
  55% {
    transform: scale(0.98) translateY(0);
  }
  75% {
    transform: scale(1.02) translateY(-1px);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

@keyframes rsvp-alert-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.04);
  }
}

@keyframes rsvp-alert-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rsvp-pulse {
    animation: none;
  }

  .rsvp-alert {
    animation: none;
  }
}

@media (max-width: 375px) {
  .hero-name {
    font-size: 64px;
    line-height: 0.9;
  }

  .hero-amp {
    font-size: 0.45em;
  }

  .rsvp-title {
    font-size: 2.5rem;
  }
}

/* Ampersand styling: Arsenica Trial at a smaller size than JAY/GEN */
.hero-name {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.08em; /* tight, balanced spacing between lines */
  line-height: 1;
}

.hero-line {
  display: block;
  line-height: 0.9;
}

.hero-amp {
  font-family: 'Arsenica Trial';
  font-size: 0.48em; /* smaller than JAY/GEN (relative to container text size) */
  line-height: 1;
  display: block;
  margin: 0.05em 0;
}

@media (min-width: 768px) {
  .hero-name { gap: 0.12em; }
  .hero-amp { font-size: 0.5em; }
}
</style>
