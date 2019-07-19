import AWS from 'aws-sdk'
import _ from 'lodash'

import { queryRepos } from '../index'

AWS.config.update({ region: 'us-east-1' })

const Dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

// @ts-ignore
// const processRepo = async (repo: any) => {
//   const { description, last_updated, name, pull_count, star_count } = repo
//   const params = {
//     Item: {
//       LAST_UPDATED: last_updated,
//       NAME: name,
//       PULL_COUNT: _.toNumber(pull_count),
//       STAR_COUNT: _.toNumber(star_count),
//     },
//     TableName: 'jds-docker-hub',
//   }
//   if (description) {
//     _.set(params, 'Item.DESCRIPTION', description)
//   }

//   const result = await Dynamo.put(params)
//   return result
// }

queryRepos({ username: 'jessestuart' })
  .then(result => {
    result.topRepos.forEach(repo => {
      const { description, last_updated, name, pull_count, star_count } = repo

      const updateExpression = `
        set
          STAR_COUNT=:star_count,
          PULL_COUNT=:pull_count,
          LAST_UPDATED=:last_updated
          ${description != null ? ', DESCRIPTION=:description' : ''}
      `

      const ExpressionAttributeValues = {
        ':last_updated': last_updated,
        ':pull_count': pull_count,
        ':star_count': star_count,
      }
      if (!_.isEmpty(description)) {
        _.set(ExpressionAttributeValues, ':description', description)
      }
      const updateParams = {
        ExpressionAttributeValues,
        Key: { NAME: name },
        ReturnValues: 'UPDATED_NEW',
        TableName: 'jds-docker-hub',
        UpdateExpression: updateExpression,
      }
      Dynamo.update(updateParams, (err, data) => {
        if (err) {
          console.error(err)
        } else {
          console.log('Success: ', { data })
        }
      })
    })
  })
  .catch(console.error)
