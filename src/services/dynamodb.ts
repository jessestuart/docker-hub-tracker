import { DynamoDB, UpdateItemInput } from '@aws-sdk/client-dynamodb-node'
import _ from 'lodash'

import { USERNAME } from '../'
import RepositoryDetails from '../types/RepositoryDetails'
import log from '../utils/log'

const client = new DynamoDB({ region: 'us-east-1' })

export const TableName = 'jds-docker-hub'

export const popuplateDynamoForRepo = async (
  repo: RepositoryDetails,
): Promise<any> => {
  const { description, last_updated, name, pull_count, star_count } = repo
  log.info(
    { last_updated, pull_count, repo: `${USERNAME}/${name}` },
    // `Updating repo in DynamoDB: ${USERNAME}/${repo.name} | last updated: ${repo.last_updated}, pull count ${repo.pull_count}`,
  )

  const isDescriptionAvailable = !_.isEmpty(description)

  let UpdateExpression = `
    set
      STAR_COUNT=:star_count,
      PULL_COUNT=:pull_count,
      LAST_UPDATED=:last_updated`

  const ExpressionAttributeValues = {
    ':last_updated': {
      S: last_updated,
    },
    ':pull_count': {
      N: pull_count.toString(),
    },
    ':star_count': {
      N: star_count.toString(),
    },
  }
  if (isDescriptionAvailable) {
    UpdateExpression += ', DESCRIPTION=:description'
    ExpressionAttributeValues[':description'] = { S: description }
  }
  const command: UpdateItemInput = {
    ExpressionAttributeValues,
    Key: {
      NAME: {
        S: name,
      },
    },
    TableName,
    UpdateExpression,
  }
  await client.updateItem(command)
  return Promise.resolve()
}
