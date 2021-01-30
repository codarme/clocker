import { useEffect, useState } from 'react'
import { Container, Spinner } from '@chakra-ui/react'

import { Login, Agenda } from './../components'
import { firebaseClient } from './../config/firebase/client'

export default function Home() {
  const [auth, setAuth] = useState({
    loading: true,
    user: false
  })

  useEffect(() => {
    firebaseClient.auth().onAuthStateChanged(user => {
      setAuth({
        loading: false,
        user
      })
    })
  }, [])

  if (auth.loading) {
    return (
      <Container p={4} centerContent>
        <Spinner />
      </Container>
    )
  }

  return auth.user ? <Agenda /> : <Login />
}