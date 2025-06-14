export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const city = query.city || "mumbai"

  try {
    const response = await $fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${config.API_KEY}`)
    return response
  } catch (error) {
    return { error: "City not found" }
  }
})
