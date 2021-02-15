import firebaseServer from 'firebase-admin'

const app = firebaseServer.apps.length
    ? firebaseServer.app()
    : firebaseServer.initializeApp({
        credential: firebaseServer.credential.cert({
            type: "service_account",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            project_id: process.env.PROJECT_ID,
            private_key_id: process.env.PRIVATE_KEY_ID,
            private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.CLIENT_EMAIL,
            client_id: process.env.CLIENT_ID,
            client_cert: process.env.CLIENT_CERT
        })
    })

export { firebaseServer }