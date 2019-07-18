import { popuplateDynamoWithQueryResults } from './aws/populate-dynamodb'
import { queryReposForUser } from './services/docker-hub'

queryReposForUser({ username: 'jessestuart' })
  .then(async ({ topRepos, totalPulls }) => {
    const results = await popuplateDynamoWithQueryResults({
      topRepos,
    })
    console.log({ results })
    return { topRepos, totalPulls }
  })
  .catch(err => {
    throw new Error(err)
  })
