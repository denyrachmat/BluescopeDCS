import { boot } from 'quasar/wrappers'
import VueGapi from 'vue-gapi'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  // something to do
  app.use(VueGapi, {
    apiKey: 'AIzaSyBTK-MYxSDDxpabGO5dkr8gsNNp6TBb498',
    clientId: '941660173387-54p26vavsm26fjd6ut4hipts62dmnka7.apps.googleusercontent.com',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    scope: 'https://www.googleapis.com/auth/drive',
    refreshToken: true,
  })
})
