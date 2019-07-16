import AWS from 'aws-sdk'
import _ from 'lodash'

import { queryRepos } from '../index'

AWS.config.update({ region: 'us-east-1' })

const Dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

queryRepos({ username: 'jessestuart' })
  .then(result => {
    result.topRepos.forEach(repo => {
      const { description, last_updated, name, pull_count, star_count } = repo
      const params = {
        Item: {
          LAST_UPDATED: last_updated,
          NAME: name,
          PULL_COUNT: _.toNumber(pull_count),
          STAR_COUNT: _.toNumber(star_count),
        },
        TableName: 'jds-docker-hub',
      }
      if (description) {
        _.set(params, 'Item.DESCRIPTION', description)
      }

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
