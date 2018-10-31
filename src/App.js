import React, { Component } from "react";
import "./App.css";
import styled from "styled-components";
import _ from "lodash";
import fuzzy from "fuzzy";
import AppBar from "./AppBar";
import CoinList from "./CoinList";
import Search from "./Search";
import Dashboard from "./Dashboard";
import { ConfirmButton } from "./Button";
const cc = require("cryptocompare");

const AppLayout = styled.div`
  padding: 40px;
`;

const Content = styled.div``;

const CenterDiv = styled.div`
  display: grid;
  justify-content: center;
`;

const MAX_FAVORITES = 10;

const checkFirstVisit = () => {
  let cryptoDashData = JSON.parse(localStorage.getItem("cryptoDash"));
  if (!cryptoDashData) {
    return {
      firstVisit: true,
      page: "settings"
    };
  }

  let { favorites, currentFavorite } = cryptoDashData;
  return {
    favorites,
    currentFavorite
  };
};

class App extends Component {
  state = {
    page: "dashboard",
    favorites: ["ETH", "BTC", "XMR", "DOGE", "EOS"],
    ...checkFirstVisit()
  };

  componentDidMount = () => {
    this.fetchCoins();
    this.fetchPrices();
  };
  fetchCoins = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState({ coinList });
  };

  fetchPrices = async () => {
    let prices;
    try {
      prices = await this.prices();
    } catch (e) {
      this.setState({ error: true });
    }
    this.setState({ prices });
  };

  prices = () => {
    let promises = [];
    this.state.favorites.forEach(sym => {
      promises.push(cc.priceFull(sym, "USD"));
    });
    return Promise.all(promises);
  };

  displayingDashboard = () => this.state.page === "dashboard";
  displayingSettings = () => this.state.page === "settings";
  firstVisitMessage = () => {
    if (this.state.firstVisit) {
      return (
        <div>
          Welcome to CryptoDash, please select your favorite coins to begin.
        </div>
      );
    }
  };
  confirmFavorites = () => {
    let currentFavorite = this.state.favorites[0];
    localStorage.setItem("cryptoDash", "test");
    this.setState({
      firstVisit: false,
      page: "dashboard",
      prices: null,
      currentFavorite: this.state.favorites[0]
    });
    this.fetchPrices();
    localStorage.setItem(
      "cryptoDash",
      JSON.stringify({
        favorites: this.state.favorites,
        currentFavorite
      })
    );
  };

  settingsContent = () => {
    return (
      <div>
        {this.firstVisitMessage()}
        <div>
          {CoinList.call(this, true)}
          <CenterDiv>
            <ConfirmButton onClick={this.confirmFavorites}>
              Confirm Favorites
            </ConfirmButton>
          </CenterDiv>
          {Search.call(this)}
          {CoinList.call(this)}
        </div>
      </div>
    );
  };

  loadingContent = () => {
    if (!this.state.coinList) {
      return <div>Loading Coins</div>;
    }
    if (!this.state.prices) {
      return <div>Loading prices</div>;
    }
  };

  addCoinToFavorites = key => {
    let favorites = [...this.state.favorites];
    if (favorites.length < MAX_FAVORITES) {
      favorites.push(key);
      this.setState({ favorites });
    }
  };

  removeCoinFromFavorites = key => {
    let favorites = [...this.state.favorites];
    this.setState({ favorites: _.pull(favorites, key) });
  };

  isInFavorites = key => _.includes(this.state.favorites, key);

  handleFilter = _.debounce(inputValue => {
    // Get all the coin symbols
    let coinSymbols = Object.keys(this.state.coinList);
    // Get all the coin names, maps symbol to name
    let coinNames = coinSymbols.map(sym => this.state.coinList[sym].CoinName);
    let allStringsToSearch = coinSymbols.concat(coinNames);
    let fuzzyResults = fuzzy
      .filter(inputValue, allStringsToSearch, {})
      .map(result => result.string);

    let filteredCoins = _.pickBy(this.state.coinList, (result, symKey) => {
      let coinName = result.CoinName;
      return (
        // If our fuzzy results contains this symbol OR the coinName, include it (return true).
        _.includes(fuzzyResults, symKey) || _.includes(fuzzyResults, coinName)
      );
    });

    this.setState({
      filteredCoins
    });
  }, 500);
  filterCoins = e => {
    let inputValue = _.get(e, "target.value");
    if (!inputValue) {
      this.setState({
        filteredCoins: null
      });
      return;
    }
    this.handleFilter(inputValue);
  };

  render() {
    return (
      <AppLayout>
        {AppBar.call(this)}
        {this.loadingContent() || (
          <Content>
            {this.displayingSettings() && this.settingsContent()}
            {this.displayingDashboard() && Dashboard.call(this)}
          </Content>
        )}
      </AppLayout>
    );
  }
}

export default App;
