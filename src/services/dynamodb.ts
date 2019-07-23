import { DynamoDB, UpdateItemInput } from '@aws-sdk/client-dynamodb-node'
import _ from 'lodash'

import RepositoryDetails from '../types/RepositoryDetails'
import { REGION, TABLE_NAME, USERNAME } from '../utils/constants'
import log from '../utils/log'

const client = new DynamoDB({ region: REGION })

const formatExpressionAttributeValues = ({
  last_updated,
  pull_count,
  star_count,
}) => ({
  ':last_updated': {
    S: last_updated,
  },
  ':pull_count': {
    N: _.toString(pull_count),
  },
  ':star_count': {
    N: _.toString(star_count),
  },
})

export const popuplateDynamoForRepo = (
  repo: RepositoryDetails,
): Promise<any> => {
  const { description, last_updated, name, pull_count, star_count } = repo
  log.info(
    { last_updated, pull_count, repo: `${USERNAME}/${name}` },
    'Updating DynamoDB item.',
  )

  let UpdateExpression = `set STAR_COUNT=:star_count,
    PULL_COUNT=:pull_count,
    LAST_UPDATED=:last_updated`

  const ExpressionAttributeValues = formatExpressionAttributeValues({
    last_updated,
    pull_count,
    star_count,
  })

  if (!_.isEmpty(description)) {
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
    TableName: TABLE_NAME!,
    UpdateExpression,
  }
  return client.updateItem(command)
}
