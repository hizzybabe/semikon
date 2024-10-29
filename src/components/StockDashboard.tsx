import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface StockData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
}

const StockDashboard: React.FC = () => {
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  const tickers = ['NVDA', 'AMD', 'INTC', 'AVGO', 'QCOM', 'TSM', 'ASML'];

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const responses = await Promise.all(
          tickers.map(ticker =>
            axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${process.env.REACT_APP_POLYGON_API_KEY}`)
          )
        );

        const processedData = responses.map((response, index) => {
          const result = response.data.results[0];
          return {
            ticker: tickers[index],
            price: result.c,
            change: result.c - result.o,
            changePercent: ((result.c - result.o) / result.o) * 100
          };
        });

        setStocksData(processedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Semiconductor Stocks Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocksData.map((stock) => (
          <div
            key={stock.ticker}
            className="p-4 border rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold">{stock.ticker}</h2>
            <p className="text-2xl">${stock.price.toFixed(2)}</p>
            <p className={`${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDashboard; 