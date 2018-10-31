import React from "react";
import { CoinGrid, CoinTile, CoinHeaderGrid, CoinSymbol } from "./CoinList";
import styled, { css } from "styled-components";
import {
  fontSizeBig,
  fontSize3,
  subtleBoxShadow,
  lightBlueBackground
} from "./Style";

const numberFormat = number => {
  return +(number + "").slice(0, 5);
};

const ChangePct = styled.div`
  color: green;
  ${props =>
    props.red &&
    css`
      color: red;
    `};
`;

const TickerPrice = styled.div`
  ${fontSizeBig};
`;

const CoinTileCompact = styled(CoinTile)`
  ${fontSize3};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
  justify-items: right;
`;

const PaddingBlue = styled.div`
  ${subtleBoxShadow};
  ${lightBlueBackground};
  padding: 5px 5px 20px;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: 1fr 3fr;
  margin-top: 20px;
`;

export default function() {
  return [
    <CoinGrid>
      {this.state.prices.map((price, index) => {
        let sym = Object.keys(price)[0];
        let data = price[sym]["USD"];
        let tileProps = {
          dashboardFavorite: sym === this.state.currentFavorite,
          onClick: () => {
            this.setState({ currentFavorite: sym });
            localStorage.setItem(
              "cryptoDash",
              JSON.stringify({
                ...JSON.parse(localStorage.getItem("cryptoDash")),
                currentFavorite: sym
              })
            );
          }
        };
        return index < 5 ? (
          <CoinTile {...tileProps}>
            <CoinHeaderGrid>
              <div>{sym}</div>
              <CoinSymbol>
                <ChangePct red={data.CHANGEPCT24HOUR < 0}>
                  {numberFormat(data.CHANGEPCT24HOUR)}%
                </ChangePct>{" "}
              </CoinSymbol>
            </CoinHeaderGrid>
            <TickerPrice>${numberFormat(data.PRICE)}</TickerPrice>
          </CoinTile>
        ) : (
          <CoinTileCompact {...tileProps}>
            <div style={{ justifySelf: "left" }}>{sym}</div>
            <CoinSymbol>
              <ChangePct red={data.CHANGEPCT24HOUR < 0}>
                {numberFormat(data.CHANGEPCT24HOUR)}%
              </ChangePct>{" "}
            </CoinSymbol>{" "}
            <div>${numberFormat(data.PRICE)}</div>
          </CoinTileCompact>
        );
      })}
    </CoinGrid>,
    <ChartGrid>
      <PaddingBlue style={{ textAlign: "center" }}>
        <h2>{this.state.coinList[this.state.currentFavorite].CoinName}</h2>
        <img
          style={{ height: "200px" }}
          alt={this.state.coinList[this.state.currentFavorite].CoinName}
          src={`http://cryptocompare.com/${
            this.state.coinList[this.state.currentFavorite].ImageUrl
          }`}
        />
      </PaddingBlue>
      <PaddingBlue>Charts go here</PaddingBlue>
    </ChartGrid>
  ];
}
