import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import HeaderFilter from "./HeaderFilter/HeaderFilter";
import Pagination from "./Pagination/Pagination";
import GridPanel from "./GridPanel";
import ListPanel from "../ListPanel";
import FooterDesc from "./FooterDesc/FooterDesc";

function ItemContainer({
  queries,
  setFilter,
  subQueries,
  setSubFilter,
  resetFilters,
  queryString,
}) {
  const { category, series } = queries;
  const { page, sort } = subQueries;
  const [products, setProducts] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [view, setView] = useState("list");

  console.log(queryString);

  useEffect(() => {
    async function getProducts() {
      try {
        const { data } = await axios.get("/Data/mockItemLists.json");
        const {
          Pagination: { last_page },
          Products,
        } = data;
        const index = last_page.indexOf("page");

        setProducts(Products);
        setLastPage(+last_page.substring(index + 5, last_page.length));
      } catch (err) {
        console.error(err);
      }
    }

    getProducts();
  }, [queries, subQueries]);

  return (
    <Container>
      <HeaderFilter
        view={view}
        setView={setView}
        queries={queries}
        setFilter={setFilter}
        sort={sort}
        setSubFilter={setSubFilter}
        resetFilters={resetFilters}
      />
      <div>
        {view === "grid" ? (
          <GridPanel
            products={products}
            sort={sort}
            getSortText={getSortText}
          />
        ) : (
          <ListPanel
            products={products}
            sort={sort}
            getSortText={getSortText}
          />
        )}
      </div>
      <Pagination page={page} lastPage={lastPage} setSubFilter={setSubFilter} />
      {category === "air jordan" && <FooterDesc series={series} />}
    </Container>
  );
}

const Container = styled.div`
  float: left;
  width: calc((100% / 6) * 5);
  padding: 0 15px;

  &::after {
    content: " ";
    clear: both;
    display: table;
  }
`;

const getTimeLine = (time) => {
  time = parseInt(time / 1000);

  const seconds = (time / 1000).toFixed(0);
  const minutes = (time / (1000 * 60)).toFixed(0);
  const hours = (time / (1000 * 60 * 60)).toFixed(0);
  const days = (time / (1000 * 60 * 60 * 24)).toFixed(0);

  switch (true) {
    case seconds < 60:
      return `${seconds} seconds ago`;
    case minutes < 60:
      return `${minutes} minutes ago`;
    case hours < 24:
      return `${hours} hours ago`;
    default:
      return `${days} days ago`;
  }
};

const getDateText = (date) => {
  date = new Date(date);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const getSortText = (view, sort, data) => {
  const sortText = {
    grid: {
      most_popular: `# of sales: ${data}`,
      recent_asks: getTimeLine(data),
      recent_bids: getTimeLine(data),
      average_price: `avg sales: ${data}`,
      total_sold: `# sold: ${data}`,
      volatility: `volatility: ${(data * 100).toFixed(0)}%`,
      price_premium: `premium: ${(data * 100).toFixed(0)}%`,
      last_sale: `last sale: ${data}`,
      release_date: `Release ${getDateText(data)}`,
    },
    list: {
      most_popular: data,
      recent_asks: getTimeLine(data),
      recent_bids: getTimeLine(data),
      average_price: `$${data}`,
      total_sold: data,
      volatility: `${(data * 100).toFixed(0)}%`,
      price_premium: `${(data * 100).toFixed(0)}%`,
      last_sale: `$${data}`,
      release_date: `${getDateText(data)}`,
      lowest_ask: `$${data}`,
      highest_bid: `$${data}`,
    },
  };

  return sortText[view][sort];
};

export default ItemContainer;