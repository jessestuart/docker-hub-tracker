import AWS from 'aws-sdk'
import _ from 'lodash'

import { queryRepos } from '../index'

AWS.config.update({ region: 'us-east-1' })

// @ts-ignore
const Dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

queryRepos({ username: 'jessestuart' })
  .then(result => {
    result.topRepos.forEach(repo => {
      // @ts-ignore
      const { description, last_updated, name, pull_count, star_count } = repo
      const params = {
        Item: {
          LAST_UPDATED: new Date(last_updated).getTime(),
          NAME: name,
          PULL_COUNT: _.toNumber(pull_count),
          STAR_COUNT: _.toNumber(star_count),
        },
        TableName: 'jds-docker-hub',
      }
      if (description) {
        _.set(params, 'Item.DESCRIPTION', description)
      }

      // const updateParams = {
      //   ExpressionAttributeValues: {
      //     ':last_updated': last_updated,
      //     // ':pull_count': pull_count,
      //     ':star_count': star_count,
      //   },
      //   Key: { NAME: name, PULL_COUNT: pull_count },
      //   ReturnValues: 'UPDATED_NEW',
      //   TableName: 'jds-docker-hub',
      //   UpdateExpression: `
      //     set STAR_COUNT=:star_count, LAST_UPDATED=:last_updated
      //   `,
      // }
      // Dynamo.update(updateParams, (err, data) => {
      //   if (err) {
      //     console.error(err)
      //   } else {
      //     console.log('Success: ', { data })
      //   }
      // })
      Dynamo.put(params, (err, data) => {
        if (err) {
          console.error('Error', err)
        } else {
          console.log('Success', data)
        }
      })
    })
  })
  .catch(console.error)
