(function (d3, fc) {
    'use strict';

    fc.utilities.navigator = function () {

        var chartZoom,
            brush = d3.svg.brush(),
            navScale = d3.time.scale(),
            navHeight = 100,
            zoomScale,
            plotAreaSelection;

        var navigator = function (selection) {
            var context,
                zoomBehavior = chartZoom.getZoomBehavior();

            brush.x(navScale);
            zoomScale = chartZoom.getZoomBehavior().x();
            plotAreaSelection = selection;

            selection.each(function () {
                context = d3.select(this).selectAll('.brush').data([0]);
                context.enter().append("g")
                    .attr("class", "brush")
                    .call(brush);

                context.selectAll("rect")
                    .attr("y", -6)
                    .attr("height", navHeight + 7);

            });

            brush.on("brush.navigatorInternal", brushed);
            brush.on("brushend.navigatorInternal", brushend);
            zoomBehavior.on("zoom.navigatorInternal", zoomed);
        };

        var brushed = function () {
            var components = chartZoom.components();
            var component, selection;

            zoomScale.domain(brush.empty() ? navScale.domain() : brush.extent());
            components.forEach(function (pair) {
                component = pair[0];
                selection = pair[1];
                selection.call(component);
            });
        };

        var brushend = function () {
            chartZoom.getZoomBehavior().x(zoomScale);
        };

        var zoomed = function () {
            brush.extent(zoomScale.domain());

            plotAreaSelection.each(function () {
                d3.select(this).selectAll('.brush').call(brush);
            });

        };

        navigator.chartZoom = function (value) {
            if (!arguments.length) {
                return chartZoom;
            }
            chartZoom = value;
            return navigator;
        };

        navigator.navScale = function (value) {
            if (!arguments.length) {
                return navScale;
            }
            navScale = value;
            return navigator;
        };

        navigator.navHeight = function (value) {
            if (!arguments.length) {
                return navHeight;
            }
            navHeight = value;
            return navigator;
        };
        return navigator;
    };
}(d3, fc));