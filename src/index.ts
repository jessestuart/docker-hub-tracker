import { queryReposForUser } from './services/docker-hub'
import { popuplateDynamoForRepo } from './services/dynamodb'

export const USERNAME = 'jessestuart'

queryReposForUser({ username: USERNAME })
  .then(({ topRepos }) => {
    return Promise.all(topRepos.map(popuplateDynamoForRepo))
  })
  .catch(console.error)
