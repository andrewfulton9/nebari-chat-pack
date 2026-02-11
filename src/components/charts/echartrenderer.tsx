/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as echarts from 'echarts';

import type {
  ReactNode
} from 'react';

import {
  useEffect, useRef
} from 'react';


/**
 * A react component that renders an EChart.
 */
export
function EChartRenderer(props: EChartRenderer.Props): ReactNode {
  // Extract the echart option.
  const { option, className } = props;

  // Create the ref the chart node.
  const ref = useRef<HTMLDivElement>(null);

  const chartRef = useRef<echarts.EChartsType | null>(null);

  // Setup the effect to create the chart.
  useEffect(() => {
    // Fetch the chart container node.
    const node = ref.current!;

    // Initialize the chart.
    const chart = echarts.init(node);

    // Create a reference to the chart for updates
    chartRef.current = chart;

    const resize = () => requestAnimationFrame(() => chart.resize());

    // Create the resize observer.
    const observer = new ResizeObserver( resize );

    // Observe the chart container.
    observer.observe(node);

    window.addEventListener("resize", resize);

    // Return the disposer function.
    return () => {
      // remove the event listener
      window.removeEventListener("resize", resize);

      // Disconnect the resize observer.
      observer.disconnect();

      // Dispose the chart.
      chart.dispose();
      
      // Clear the chart reference
      chartRef.current = null;
    };
  }, []);

  // Resize effect
  useEffect(() => {
    // get the chart reference
    const chart = chartRef.current;

    // Bail if no chart
    if (!chart) return;

    // 
    chart.setOption(option, { notMerge: true, lazyUpdate: true });

    // resize the chart
    chart.resize();
  }, [option]);

  // Return the rendered component.
  return <div ref={ ref } className={ className } />;
}


/**
 * The namespace for the `EChartRenderer` statics.
 */
export
namespace EChartRenderer {
  /**
   * A type alias for the `EChartRenderer` props.
   */
  export
  type Props = {
    /**
     * The option object for configuring the echart.
     */
    readonly option: echarts.EChartsOption;

    /**
     * The classname for configuring the echart div.
     */
    readonly className?: string;
  };
}
