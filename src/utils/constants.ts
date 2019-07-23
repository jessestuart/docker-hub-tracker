import { config } from 'dotenv'

config()

export const REGION = process.env.DYNAMODB_REGION
export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME
export const USERNAME = process.env.DOCKER_USERNAME
