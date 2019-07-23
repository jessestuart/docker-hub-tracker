import { queryReposForUser } from './services/docker-hub'
import { popuplateDynamoForRepo } from './services/dynamodb'
import { USERNAME } from './utils/constants'
import log from './utils/log'

queryReposForUser({ username: USERNAME })
  .then(({ topRepos }) => Promise.all(topRepos.map(popuplateDynamoForRepo)))
  .catch(log.error)
