import { firebaseServer } from '../../config/firebase/server'
import { differenceInHours, format, addHours } from 'date-fns'

const db = firebaseServer.firestore()
const profile = db.collection('profiles')
const agenda = db.collection('agenda')

const startAt = new Date(2021, 1, 1, 8, 0)
const endAt = new Date(2021, 1, 1, 17, 0)
const totalHours = differenceInHours(endAt, startAt)

const timeBlocksList = []

for (let blockIndex = 0; blockIndex <= totalHours; blockIndex++) {
    const time = format(addHours(startAt, blockIndex), 'HH:mm')
    timeBlocksList.push(time)
}

const getUserId = async (username) => {
    const profileDoc = await profile
        .where('username', '==', username)
        .get()

    if (!profileDoc.docs.length) {
        return false
    }

    const { userId } = profileDoc.docs[0].data()

    return userId
}


const setSchedule = async (req, res) => {
    const userId = await getUserId(req.body.username)
    const docId = `${userId}#${req.body.date}#${req.body.time}`

    const doc = await agenda.doc(docId).get()

    if (doc.exists) {
        console.log('doc')
        res.status(400).json({ message: 'Time blocked!' })
        return
    }

    const block = await agenda.doc(docId).set({
        userId,
        date: req.body.date,
        time: req.body.time,
        name: req.body.name,
        phone: req.body.phone,
    })

    return res.status(200).json(block)
}

const getSchedule = async (req, res) => {
    try {
        const userId = await getUserId(req.query.username)

        if (!userId) {
            return res.status(404).json({ message: 'Invalid username' })
        }

        const snapshot = await agenda
            .where('userId', '==', userId)
            .where('date', '==', req.query.date)
            .get()

        const docs = snapshot.docs.map(doc => doc.data())

        const result = timeBlocksList.map(time => ({
            time,
            isBlocked: !!docs.find(doc => doc.time === time)
        }))

        return res.status(200).json(result)
    } catch (error) {
        console.log('FB ERROR:', error)
        return res.status(401)
    }
}

const methods = {
    POST: setSchedule,
    GET: getSchedule
}

export default async (req, res) => methods[req.method]
    ? methods[req.method](req, res)
    : res.status(405)