import React from "react";
import styled, { css } from "styled-components";
import {
  subtleBoxShadow,
  lightBlueBackground,
  greenBoxShadow,
  redBoxShadow
} from "./Style";

const CoinGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
  margin-top: 40px;
`;

const CoinTile = styled.div`
  padding: 10px;
  &:hover {
    cursor: pointer;
    ${greenBoxShadow};
  }
  ${subtleBoxShadow};
  ${lightBlueBackground};

  ${props =>
    props.favorite &&
    css`
      &:hover {
        cursor: pointer;
        ${redBoxShadow};
      }
    `};
  ${props =>
    props.chosen &&
    !props.favorite &&
    css`
      pointer-events: none;
      opacity: 0.4;
    `};
`;

const CoinHeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const CoinSymbol = styled.div`
  justify-self: right;
`;

const DeleteIcon = styled.div`
  justify-self: right;
  display: none;
  ${CoinTile}:hover & {
    color: red;
    display: block;
  }
`;

export default function(favorites = false) {
  let coinKeys = favorites
    ? this.state.favorites
    : Object.keys(this.state.coinList).slice(0, 100);
  return (
    <CoinGrid>
      {coinKeys.map(coinKey => (
        <CoinTile
          chosen={this.isInFavorites(coinKey)}
          favorite={favorites}
          onClick={
            favorites
              ? () => {
                  this.removeCoinFromFavorites(coinKey);
                }
              : () => {
                  this.addCoinToFavorites(coinKey);
                }
          }
        >
          <CoinHeaderGrid>
            <div>{this.state.coinList[coinKey].CoinName}</div>
            {favorites ? (
              <DeleteIcon>X</DeleteIcon>
            ) : (
              <CoinSymbol>{this.state.coinList[coinKey].Symbol}</CoinSymbol>
            )}
          </CoinHeaderGrid>
          <img
            style={{ height: "50px" }}
            alt={this.state.coinList[coinKey].CoinName}
            src={`http://cryptocompare.com/${
              this.state.coinList[coinKey].ImageUrl
            }`}
          />
        </CoinTile>
      ))}
    </CoinGrid>
  );
}
