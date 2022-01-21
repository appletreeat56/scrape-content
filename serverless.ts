import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'pdftextsearch',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    findKeywordInPDF: {
      handler: 'handler.findKeywordInPDF',
      events: [
        {
          http: {
            method: 'get',
            path: 'findKeywordInPDF',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
