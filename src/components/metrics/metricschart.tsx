/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine
} from 'recharts';

import {
  Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';

import type {
  ChartConfig
} from '@/components/ui/chart';

import {
  ChartContainer
} from '@/components/ui/chart';


/**
 *
 */
export
function MetricsChart(props: MetricsChart.Props): ReactNode {
  //
  const { title, description, total, config } = props;

  //
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          { title }
        </CardTitle>
        <CardDescription>
          { description }
        </CardDescription>
        <CardAction className='font-semibold'>
          { `${total ?? '-'}` }
        </CardAction>
      </CardHeader>
      <CardContent>
        <Private.ChartImpl config={ config } />
      </CardContent>
    </Card>
  );
}


/**
 *
 */
export
namespace MetricsChart {
  /**
   *
   */
  export
  type Datum = {
    /**
     *
     */
    readonly [key: string]: string | number;
  };

  /**
   *
   */
  export
  type Series = {
    /**
     *
     */
    readonly key: string;

    /**
     *
     */
    readonly label: string;
  };

  /**
   *
   */
  export
  type BarConfig = {
    /**
     *
     */
    readonly type: 'bar';

    /**
     *
     */
    readonly data: readonly Datum[];

    /**
     *
     *
     */
    readonly series: readonly Series[];
  };

  /**
   *
   */
  export
  type LineConfig = {
    /**
     *
     */
    readonly type: 'line';

    /**
     *
     */
    readonly data: readonly Datum[];
  };

  /**
   *
   */
  export
  type RadialConfig = {
    /**
     *
     */
    readonly type: 'radial';
  };

  /**
   *
   */
  export
  type EmptyConfig = {
    /**
     *
     */
    readonly type: 'empty';
  };

  /**
   *
   */
  export
  type Config = BarConfig | LineConfig | RadialConfig | EmptyConfig;

  /**
   *
   */
  export
  type Props = {
    /**
     *
     */
    readonly title: string;

    /**
     *
     */
    readonly description: string;

    /**
     *
     */
    readonly total: number | undefined;

    /**
     *
     */
    readonly config: Config;
  };
}


/**
 *
 */
namespace Private {
  /**
   *
   */
  export
  type ChartImplProps = {
    /**
     *
     */
    readonly config: MetricsChart.Config;
  };

  /**
   *
   */
  export
  function ChartImpl(props: ChartImplProps): ReactNode {
    //
    const { config } = props;

    //
    let content: ReactNode;
    switch (config.type) {
    case 'bar':
      content = <BarChartImpl config={ config } />
      break;
    case 'line':
      content = <LineChartImpl config={ config } />
      break;
    case 'radial':
      content = <RadialChartImpl config={ config } />
      break;
    case 'empty':
      content = (
        <div className="flex h-full items-center justify-center text-xs">
          NO DATA AVAILABLE YET
        </div>
      );
      break;
    default:
      throw 'unreachable';
    }

    //
    return (
      <ChartContainer config={{}} >
        { content }
      </ChartContainer>
    );
  }

  /**
   *
   */
  type BarChartImplProps = {
    /**
     *
     */
    readonly config: MetricsChart.BarConfig;
  };

  /**
   *
   */
  function BarChartImpl(props: BarChartImplProps): ReactNode {
    //
    // const { config } = props;

    //
    const data = [
      { label: 'foo', value: 10 },
      { label: 'bar', value: 5 },
      { label: 'baz', value: 15 }
    ];

    // //
    // const bars = config.series.map(({ key }) =>
    //   <Bar key={ key } dataKey={ key } fill='black' stackId='users' />
    // );

    //
    return (
      <BarChart data={ data } >
        <CartesianGrid vertical={false} />
        <YAxis domain={[0, "dataMax"]} />
        <XAxis dataKey='label' />
        <Bar dataKey='value' stackId='a' fill='#FF0000' />
      </BarChart>
    );
  }
}
