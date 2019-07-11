import _ from 'lodash'
import fp from 'lodash/fp'

import API from './api'
import RepositoryDetails from './types/RepositoryDetails'

const api = new API()

const NUM_REPOS_TO_ANALYZE = 20

interface QueryOptions {
  username: string
}

interface RepoFields {
  description: string
  name: string
  pull_count: number
  star_count: number
}

interface DHStatsReponse {
  topRepos: RepoFields[]
  totalPulls: number
}

export const queryRepos = async ({
  username,
}: QueryOptions): Promise<DHStatsReponse> => {
  const repos = await api.repositories(username)
  const repoDetails: RepositoryDetails[] = await Promise.all(
    repos.map(({ namespace, name }) => api.repository(namespace, name)),
  )

  const topRepos: RepoFields[] = _.flow(
    fp.orderBy('pull_count', 'desc'),
    fp.take(NUM_REPOS_TO_ANALYZE),
    fp.map(
      fp.pick([
        'description',
        'last_updated',
        'name',
        'pull_count',
        'star_count',
      ]),
    ),
  )(repoDetails) as RepoFields[]

  const totalPulls = _.sumBy(repoDetails, 'pull_count')

  return { topRepos, totalPulls }
}

const USERNAME = 'jessestuart'
queryRepos({ username: USERNAME })
  .then(({ topRepos, totalPulls }) => {
    console.log({ topRepos, totalPulls })
  })
  .catch(console.error)
