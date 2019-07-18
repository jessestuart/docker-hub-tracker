import _ from 'lodash'

import { queryReposForUser } from './services/docker-hub'
import { popuplateDynamoWithQueryResults } from './services/dynamodb'

queryReposForUser({ username: 'jessestuart' })
  .then(async ({ topRepos, totalPulls }) => {
    console.log('Top repos:', _.orderBy(topRepos, 'pull_count', 'desc'))
    console.log('Total pulls: ', { totalPulls })

    await popuplateDynamoWithQueryResults({ topRepos })

    return { topRepos, totalPulls }
  })
  .catch(err => {
    throw new Error(err)
  })
