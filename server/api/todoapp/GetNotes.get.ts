export default defineEventHandler(async () => {
  try {
    const database = await useDatabase()
    const result = await database.collection('todocollectiuon').find({}).toArray()
    return result
  }
  catch (err) {
    console.error('Error fetching notes:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
