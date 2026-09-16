export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const newNotes = formData.get('newNotes')

    if (typeof newNotes !== 'string' || !newNotes.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'newNotes is required',
      })
    }

    const database = await useDatabase()
    const numOfDoc = await database.collection('todocollectiuon').countDocuments({})
    const note = {
      id: (numOfDoc + 1).toString(),
      desc: newNotes,
    }

    await database.collection('todocollectiuon').insertOne(note)

    return note
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('Error adding notes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
