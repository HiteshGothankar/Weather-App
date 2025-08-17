<script setup>

useHead({
  title: 'Weather App',
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/weather.png' }
  ],
})

const cookie = useCookie("city")

if (!cookie.value) {
  cookie.value = "mumbai"
}

const search = ref(cookie.value)
const input = ref("")
const background = ref("/images/4.avif")

const { data: city, error } = useAsyncData("city", async () => {
  let response;

  try {
    response = await $fetch(`/api/weather?city=${search.value}`)

    cookie.value = search.value
    const temp = response.main.temp

    if (temp <= -10) {
      background.value = "/images/1.avif"
    } else if (temp > -10 && temp <= 0) {
      background.value = "/images/2.avif"
    } else if (temp > 0 && temp <= 10) {
      background.value = "/images/3.avif"
    } else {
      background.value = "/images/4.avif"
    }
  } catch (error) {
    console.error("Weather fetch failed:", error)
    throw createError({ statusCode: 404, message: "City not found" })
  }
  return response
}, { watch: [search] })

let today = new Date()

today = today.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
})

const handleClick = () => {
  const formattedSearch = input.value.trim().split(" ").join("+")
  search.value = formattedSearch;
  input.value = "";
}

const goBack = () => {
  search.value = "mumbai"
}
</script>

<template>
  <div v-if="city" class="min-h-screen relative overflow-hidden">
    <img v-if="city" :src="background" class="absolute inset-0 w-full h-full object-cover z-0" />
    <div class="absolute inset-0 bg-black/40 z-10"></div>

    <div class="relative z-20 px-6 py-35 sm:px-12 md:px-20 md:py-40 lg:px-48 flex flex-col justify-center h-full">

      <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div class="text-center sm:text-left">
          <h1 class="text-4xl md:text-6xl lg:text-8xl text-white font-semibold">{{ city.name }}</h1>
          <p class="font-normal text-xl mt-3 text-white">{{ today }}</p>
          <img :src="`http://openweathermap.org/img/wn/${city.weather[0].icon}@4x.png`"
            class="w-24 h-24 mx-auto sm:mx-0 sm:w-32 sm:h-32" alt="Weather Icon" />
        </div>

        <div class="text-center sm:text-right">
          <p class="text-4xl md:text-7xl lg:text-8xl text-white font-semibold">
            {{ city.main.temp }}°
          </p>
        </div>
      </div>

      <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <input type="text" v-model="input"
          class="w-full sm:w-2/3 px-4 py-2 rounded bg-white text-black focus:outline-none"
          placeholder="Search for a city" />
        <button
          class="w-full sm:w-auto px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded transition duration-500"
          @click="handleClick">
          Search
        </button>
      </div>
    </div>
  </div>
  <div v-else class="p-10 flex flex-col items-center justify-center h-[100vh]">
    <h1 class="text-2xl md:text-6xl">We can't find that city</h1>
    <button class="mt-7 bg-sky-400 px-10 w-40 md:w-50 text-white h-10" @click="goBack">Go Back</button>
  </div>
</template>



<style scoped>
.overlay {
  background: rgba(0, 0, 0, 0.1);
}

.icon {
  margin-left: -2.75rem;
  margin-top: -2.75rem;
}
</style>