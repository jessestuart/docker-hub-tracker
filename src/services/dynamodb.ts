import AWS from 'aws-sdk'
import _ from 'lodash'

import RepositoryDetails from '../types/RepositoryDetails'

AWS.config.update({ region: 'us-east-1' })

const Dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

export const popuplateDynamoWithQueryResults = ({
  topRepos,
}: {
  topRepos: RepositoryDetails[]
}): void => {
  topRepos.map(async (repo: RepositoryDetails) => {
    const { description, last_updated, name, pull_count, star_count } = repo

    const isDescriptionAvailable = !_.isEmpty(description)
    let UpdateExpression = `
      set
        STAR_COUNT=:star_count,
        PULL_COUNT=:pull_count,
        LAST_UPDATED=:last_updated`
    const ExpressionAttributeValues = {
      ':last_updated': last_updated,
      ':pull_count': pull_count,
      ':star_count': star_count,
    }
    if (isDescriptionAvailable) {
      UpdateExpression += ', DESCRIPTION=:description'
      _.set(ExpressionAttributeValues, ':description', description)
    }
    const updateParams = {
      ExpressionAttributeValues,
      Key: { NAME: name },
      ReturnValues: 'UPDATED_NEW',
      TableName: 'jds-docker-hub',
      UpdateExpression,
    }
    return Dynamo.update(updateParams)
  })
}
