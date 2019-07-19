import { DynamoDB, UpdateItemInput } from '@aws-sdk/client-dynamodb-node'
import _ from 'lodash'

import RepositoryDetails from '../types/RepositoryDetails'

const client = new DynamoDB({ region: 'us-east-1' })
const TableName = 'jds-docker-hub'

export const popuplateDynamoForRepo = async (
  repo: RepositoryDetails,
): Promise<any> => {
  const { description, last_updated, name, pull_count, star_count } = repo

  const isDescriptionAvailable = !_.isEmpty(description)
  let UpdateExpression = `set STAR_COUNT=:star_count, PULL_COUNT=:pull_count, LAST_UPDATED=:last_updated`
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
  return client.updateItem(command)
}
