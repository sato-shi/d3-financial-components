(function(d3, fc) {
    'use strict';

    fc.series.comparison = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var cachedData, cachedScale;

        var yScaleTransform = function(oldScale, newScale) {
            // Compute transform for elements wrt changing yScale.
            var oldDomain = oldScale.domain(),
                newDomain = newScale.domain(),
                scale = (oldDomain[1] - oldDomain[0]) / (newDomain[1] - newDomain[0]),
                translate = scale * (oldScale.range()[1] - oldScale(newDomain[1]));
            return {
                translate: translate,
                scale: scale
            };
        };

        var findIndex = function(seriesData, date) {
            // Find insertion point for date in seriesData.
            var bisect = d3.bisector(
                function(d) {
                    return d.date;
                }).left;

            var initialIndex = bisect(seriesData, date);
            if (initialIndex === 0) {
                // Google finance style, calculate changes from the
                // date one before initial date if possible, or index 0.
                initialIndex += 1;
            }
            return initialIndex;
        };

        var percentageChange = function(seriesData, initialDate) {
            // Computes the percentage change data of a series from an initial date.
            var initialIndex = findIndex(seriesData, initialDate) - 1;
            var initialClose = seriesData[initialIndex].close;

            return seriesData.map(function(d) {
                return {
                    date: d.date,
                    change: (d.close / initialClose) - 1
                };
            });
        };

        var rebaseChange = function(seriesData, initialDate) {
            // Change the initial date the percentage changes should be based from.
            var initialIndex = findIndex(seriesData, initialDate) - 1;
            var initialChange = seriesData[initialIndex].change;

            return seriesData.map(function(d) {
                return {
                    date: d.date,
                    change: d.change - initialChange
                };
            });
        };

        var calculateYDomain = function(data, xDomain) {
            var start, end;

            data = data.map(function(series) {
                series = series.data;
                start = findIndex(series, xDomain[0]) - 1;
                end = findIndex(series, xDomain[1]) + 1;
                return series.slice(start, end);
            });

            var allPoints = data.reduce(function(prev, curr) {
                return prev.concat(curr);
            }, []);

            if (allPoints.length) {
                return d3.extent(allPoints, function(d) {
                    return d.change;
                });
            } else {
                return [0, 0];
            }
        };

        var color = d3.scale.category10();

        var line = d3.svg.line()
            .interpolate('linear')
            .x(function(d) {
                return xScale(d.date);
            })
            .y(function(d) {
                return yScale(d.change);
            });

        var comparison = function(selection) {
            var series, lines;

            selection.each(function(data) {

                data = data.map(function(d) {
                    return {
                        name: d.name,
                        data: percentageChange(d.data, xScale.domain()[0])
                    };
                });

                // TODO: use __chart__?
                cachedData = data; // Save for rebasing.

                color.domain(data.map(function(d) {
                    return d.name;
                }));

                yScale.domain(calculateYDomain(data, xScale.domain()));
                cachedScale = yScale.copy();

                series = d3.select(this).selectAll('.comparison-series').data([data]);
                series.enter().append('g').classed('comparison-series', true);

                lines = series.selectAll('.line')
                    .data(data, function(d) {
                        return d.name;
                    })
                    .enter().append('path')
                    .attr('class', function(d) {
                        return 'line ' + 'line' + data.indexOf(d);
                    })
                    .attr('d', function(d) {
                        return line(d.data);
                    })
                    .style('stroke', function(d) {
                        return color(d.name);
                    });

                series.selectAll('.line')
                    .attr('d', function(d) {
                        return line(d.data);
                    });
            });
        };

        comparison.geometricZoom = function(selection, xTransformTranslate, xTransformScale) {
            // Apply a transformation for each line to update its position wrt the new initial date,
            // then apply the yScale transformation to reflect the updated yScale domain.

            var initialIndex,
                yTransform;

            var lineTransform = function(initialChange) {
                var yTransformLineTranslate = cachedScale(0) - cachedScale(initialChange);

                yTransformLineTranslate *= yTransform.scale;
                yTransformLineTranslate += yTransform.translate;

                return 'translate(' + xTransformTranslate + ',' + yTransformLineTranslate + ')' +
                    ' scale(' + xTransformScale + ',' + yTransform.scale + ')';
            };

            var domainData = cachedData.map(function(d) {
                return {
                    name: d.name,
                    data: rebaseChange(d.data, xScale.domain()[0])
                };
            });

            yScale.domain(calculateYDomain(domainData, xScale.domain()));
            yTransform = yScaleTransform(cachedScale, yScale);

            cachedData = cachedData.map(function(d) {
                initialIndex = findIndex(d.data, xScale.domain()[0]) - 1;
                return {
                    name: d.name,
                    data: d.data,
                    transform: lineTransform(d.data[initialIndex].change)
                };
            });

            selection.selectAll('.line')
                .data(cachedData)
                .attr('transform', function(d) { return d.transform; });
        };

        comparison.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return comparison;
        };

        comparison.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return comparison;
        };

        return comparison;
    };
}(d3, fc));