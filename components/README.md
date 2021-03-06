#Components

All components should fall in to one of the namespace categories below. If not a blank object with the name of the category should be added to the 'fc.js' file.

##Namespaces

Components are arranged in namespaces depending on function. These are all arranged under the 'fc' namespace which is defined in 'fc.js'.

*A namespace summary is below:*

###fc.indicators

Used for financial indicators, such as Bollinger Bands, Moving Average, RSI, Divergence etc. These are components which are represented by a D3 data series but not directly related to data without some data processing before they are displayed.

Current components in this namespace:

+ fc.indicators.bollingerBands
+ fc.indicators.movingAverage
+ fc.indicators.rsi

###fc.scale

Used for components which interact with the axes or the scale on the chart.

Current components in this namespace:

+ fc.scale.financeScale
+ fc.scale.gridlines

###fc.series

Used for financial data series, such as OHLC (Open, High, Low, Close) and candles. These are components which are represented by a D3 data series in its raw from. i.e. No data processing.

Current components in this namespace:

+ fc.series.candlestick
+ fc.series.comparison
+ fc.series.ohlc
+ fc.series.volume

###fc.tools

Used for charting tools, such as crosshairs etc.

Current components in this namespace:

+ fc.tools.annotation
+ fc.tools.crosshairs
+ fc.tools.fibonacciFan
+ fc.tools.measure

###fc.utilities

Used for any other functionality which is a dependency of a component in the fc namespace or something else useful which does not fall into on of the other namespaces.

Current components int this namespace:

+ fc.utilities.dataGenerator
+ fc.utilities.chartLayout
+ fc.utilities.weekday

**Further documentation for each component can be found in the corresponding namespace folder**

##License

These components are licensed under the [MIT License](http://opensource.org/licenses/MIT)
