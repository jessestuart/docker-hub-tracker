import AWS from 'aws-sdk'

import { queryRepos } from '../index'

AWS.config.update({ region: 'us-east-1' })

// @ts-ignore
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
      // @ts-ignore
      const { description, last_updated, name, pull_count, star_count } = repo
      // const params = {
      //   Item: {
      //     LAST_UPDATED: new Date(last_updated).getTime(),
      //     NAME: name,
      //     PULL_COUNT: _.toNumber(pull_count),
      //     STAR_COUNT: _.toNumber(star_count),
      //   },
      //   TableName: 'jds-docker-hub',
      // }
      // if (description) {
      //   _.set(params, 'Item.DESCRIPTION', description)
      // }

      const updateExpression = `
        set
          STAR_COUNT=:star_count,
          PULL_COUNT=:pull_count,
          LAST_UPDATED=:last_updated
          ${description != null ? ', DESCRIPTION=:description' : null}
      `
      const updateParams = {
        ExpressionAttributeValues: {
          ':last_updated': last_updated,
          ':pull_count': pull_count,
          ':star_count': star_count,
        },
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
      // Dynamo.put(params, (err, data) => {
      //   if (err) {
      //     console.error('Error', err)
      //   } else {
      //     console.log('Success', data)
      //   }
      // })
    })
    // async.map(result.topRepos, processRepo, (err, queryRepoResults) => {
    //   if (err != null) {
    //     return Promise.reject(err)
    //   }
    //   return Promise.resolve(queryRepoResults)
    // })
  })
  .catch(console.error)

// queryRepos({ username: 'jessestuart' })
//   .then(result => {
//     result.topRepos.forEach(async repo => {
//       const processRepoResults = await processRepo(repo)
//       console.log({ processRepoResults })
//       // results.then(console.log).catch(console.error)
//     })
//   })
//   .catch(console.error)
