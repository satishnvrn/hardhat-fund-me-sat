// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import './PriceConverter.sol';
import "hardhat/console.sol";

error NotOwner();

/** @title A contract for crowd funding
 *   @author Satish NVRN
 *   @notice This contract is to demo a sample funding contract
 *   @dev This implements price feeds as our library
 */
contract FundMe {
  using PriceConverter for uint256;

  uint256 public constant MINIMUM_USD = 50;

  address[] private s_funders;
  mapping(address => uint256) private s_addressToAmountFunded;

  address private immutable i_owner;

  AggregatorV3Interface private s_priceFeed;

  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  modifier onlyOwner() {
    // require(msg.sender == i_owner);
    if (msg.sender != i_owner) {
      revert NotOwner();
    }
    _;
  }

  function fund() public payable {
    require(
      msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
      "Didn't send enough ETH"
    );
    console.log('Funding ', msg.value);
    s_funders.push(msg.sender);
    s_addressToAmountFunded[msg.sender] += msg.value;
    // 20000000000000000
  }

  function getRateForETH(uint256 ethAmount) public view returns (uint256) {
    uint256 answer = ethAmount.getConversionRate(s_priceFeed);
    return answer;
  }

  function withdraw() public payable onlyOwner {
    for (uint256 funderIndex = 0; funderIndex < s_funders.length; funderIndex++) {
      address funder = s_funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }

    s_funders = new address[](0);
    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }('');
    require(callSuccess, 'Call failed');
  }

  function cheaperWithdraw() public payable onlyOwner {
    address[] memory funders = s_funders;
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }

    funders = new address[](0);
    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }('');
    require(callSuccess, 'Call failed');
  }

  receive() external payable {
    fund();
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return s_priceFeed;
  }

  function getFunders(uint256 index) public view returns (address) {
    return s_funders[index];
  }

  function getAddressToAmountFunded(
    address funderAddress
  ) public view returns (uint256) {
    return s_addressToAmountFunded[funderAddress];
  }
}
