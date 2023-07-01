# hardhat-fund-me-sat

Hi, This repository is used to run hardhat fund me contracts.

## Installation

Clone the project and run `yarn install`

## Usage

### Compile

`yarn hardhat compile`

### deploy

#### deploy mocks with mocks tags

`yarn hardhat deploy --tags mocks`

#### deploy locally

`yarn hardhat deploy`

#### Run local blockchain using hardhat

`yarn hardhat node`

#### deploy using a network like sepolia

`yarn hardhat deploy --network sepolia`

### test coverage

To check the code coverage of the tests, execute the following line:
`yarn hardhat coverage`

### run unit test cases

`yarn hardhat test`

`yarn hardhat test --grep '<the test suite description>'`

