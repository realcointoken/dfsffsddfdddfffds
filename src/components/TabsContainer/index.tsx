import React, { useState } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import PanelWrapper from './PanelWrapper'
import Balance from 'components/Balance'
import ERC721BalanceUi from 'components/Balance/ERC721Balance'
import ExplorerLink from 'components/App/ExplorerLink'

import {
  BridgeBalance,
  TokenType,
  ERC721Balance,
  ContractStorage,
  BridgeToken
} from 'token-bridge-sdk'
import AssetDropDown from 'components/AssetDropDown'
import EthL1Actions from 'components/Actions/EthL1Actions'
import EthL2Actions from 'components/Actions/EthL2Actions'

import ERC20L1Actions from 'components/Actions/ERC20L1Actions'
import ERC20L2Actions from 'components/Actions/ERC20L2Actions'

import ERC721L1Actions from 'components/Actions/ERC721L1Actions'
import ERC721L2Actions from 'components/Actions/ERC721L2Actions'
import { Transaction } from 'token-bridge-sdk'

type TabProps = {
  ethBalances: BridgeBalance
  erc20BridgeBalance: BridgeBalance | undefined
  erc721balance: ERC721Balance | undefined
  eth: any
  token: any
  currentERC20Address: string
  currentERC721Address: string
  setCurrentERC20Address: React.Dispatch<string>
  setCurrentERC721Address: React.Dispatch<string>
  bridgeTokens: ContractStorage<BridgeToken>
  addToken: (a: string, type: TokenType) => Promise<string>
  transactions: Transaction[]
  networkId: number
}

type TabName = 'eth' | 'erc20' | 'erc721'

const TabsContainer = ({
  ethBalances,
  erc20BridgeBalance,
  addToken,
  eth,
  token,
  erc721balance,
  currentERC20Address,
  bridgeTokens,
  currentERC721Address,
  setCurrentERC20Address,
  setCurrentERC721Address,
  transactions,
  networkId
}: TabProps) => {
  const [key, setKey] = useState('eth')
  // TODO: clean up / memoize
  const brideTokensArray: BridgeToken[] = Object.values(bridgeTokens)
    .filter((token): token is BridgeToken => !!token)
    .sort((a: BridgeToken, b: BridgeToken) => {
      if (a.symbol === b.symbol){
        const Aaddress = a.eth?.addresss || a.arb?.aaddresss
        const Baddress = b.eth?.addresss || b.arb?.aaddresss
        return Aaddress > Baddress ? 1: -1
      }

      return a.symbol > b.symbol ? 1 : -1
    })
    const erc20BridgeTokens = brideTokensArray.filter(
    token => token.type === TokenType.ERC20
  )
  const erc721BridgeTokens = brideTokensArray.filter(
    token => token.type === TokenType.ERC721
  )

  const currentERC20Token = bridgeTokens[currentERC20Address]
  const currentERC721Token = bridgeTokens[currentERC721Address]
  const disabledWithdrawals = networkId === 152709604825713

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k: string) => setKey(k)}
    >
      <Tab eventKey="eth" title="ETH">
        <Container>
          <Row>
            <Col>
              <PanelWrapper isDepositPanel={true}>
                <EthL1Actions balances={ethBalances} eth={eth}  transactions={transactions}/>
              </PanelWrapper>
            </Col>
            <Col>
              <PanelWrapper isDepositPanel={false} disabledWithdrawals={disabledWithdrawals}>
                <EthL2Actions balances={ethBalances} eth={eth}  />
              </PanelWrapper>
            </Col>
          </Row>
        </Container>
      </Tab>
      <Tab eventKey="erc20" title="ERC-20">
        <Container>
          <Row md={6}>
            <Col>
              <AssetDropDown
                bridgeTokensArray={erc20BridgeTokens}
                addToken={addToken}
                tokenType={TokenType.ERC20}
                currentToken={currentERC20Token}
                setCurrentAddress={setCurrentERC20Address}
              />
            </Col>
          </Row>
          <Row style={{fontSize: 14}}>
          {currentERC20Address   ? <Col>Token Address: <ExplorerLink hash={currentERC20Address} type={'address'}/></Col> : null }
          </Row>
          <Row>
            <Col>
              <PanelWrapper isDepositPanel={true}>
                <ERC20L1Actions
                  balances={erc20BridgeBalance}
                  eth={token}
                  bridgeTokens={bridgeTokens}
                  currentERC20Address={currentERC20Address}
                  transactions={transactions}
                />
              </PanelWrapper>
            </Col>
            <Col>
              <PanelWrapper isDepositPanel={false} disabledWithdrawals={disabledWithdrawals}>
                <ERC20L2Actions
                  balances={erc20BridgeBalance}
                  eth={token}
                  bridgeTokens={bridgeTokens}
                  currentERC20Address={currentERC20Address}
                />
              </PanelWrapper>
            </Col>
          </Row>
        </Container>
      </Tab>
      <Tab eventKey="erc721" title="ERC-721">
        <Container>
          <Row>
            <Col>
              <ERC721BalanceUi
              balances={erc721balance}
              transactions={transactions}
              bridgeTokens={bridgeTokens}
              currentERC721Address={currentERC721Address}
            />
            </Col>
          </Row>
          <Row>
            <Col>
              <AssetDropDown
                  bridgeTokensArray={erc721BridgeTokens}
                  addToken={addToken}
                  tokenType={TokenType.ERC721}
                  currentToken={currentERC721Token}
                  setCurrentAddress={setCurrentERC721Address}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <PanelWrapper isDepositPanel={true}>
                <ERC721L1Actions
                  balances={erc721balance}
                  eth={token}
                  bridgeTokens={bridgeTokens}
                  currentERC721Address={currentERC721Address}
                />
              </PanelWrapper>
            </Col>
            <Col>
              <PanelWrapper isDepositPanel={false} disabledWithdrawals={disabledWithdrawals}>
                <ERC721L2Actions
                  balances={erc721balance}
                  eth={token}
                  bridgeTokens={bridgeTokens}
                  currentERC721Address={currentERC721Address}
                />
              </PanelWrapper>
            </Col>
          </Row>
        </Container>
      </Tab>
    </Tabs>
  )
}

export default TabsContainer
