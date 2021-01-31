import { firebaseServer } from './../../config/firebase/server'

const db = firebaseServer.firestore()
const profile = db.collection('profiles')

export default async (req, res) => {
  const [, token] = req.headers.authorization.split(' ')
  const { user_id } = await firebaseServer.auth().verifyIdToken(token)

  profile.doc(req.body.username).set({
    userId: user_id,
    username: req.body.username
  })

  res.status(200).json({ name: 'John Doe' })
}
