import axios from 'axios'
import _ from 'lodash'
import fp from 'lodash/fp'

const NUM_REPOS_TO_ANALYZE = 20
const USERNAME = 'jessestuart'
const QUERY_PARAMS = {
  params: {
    page: 1,
    page_size: NUM_REPOS_TO_ANALYZE,
  },
}

interface QueryOptions {
  username: string
}

interface RepoFields {
  description: string
  last_updated: string
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
  const repos = await axios.get(
    `https://hub.docker.com/v2/repositories/${username}`,
    QUERY_PARAMS,
  )
  const topRepos: RepoFields[] = _.flow(
    fp.get('data.results'),
    fp.map(
      fp.pick([
        'description',
        'last_updated',
        'name',
        'pull_count',
        'star_count',
      ]),
    ),
  )(repos) as RepoFields[]
  const totalPulls: number = _.sumBy(topRepos, 'pull_count')

  return { topRepos, totalPulls }
}

queryRepos({ username: USERNAME })
  .then(({ topRepos, totalPulls }) => {
    console.log({ topRepos, totalPulls })
  })
  .catch(console.error)
