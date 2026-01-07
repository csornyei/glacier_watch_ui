import * as d3 from "d3";
import { useMemo, useState } from "react";
import { Paper } from "@mantine/core";

type TimeseriesPoint = {
  x: Date;
  y: number;
};

type Series = {
  label: string;
  points: TimeseriesPoint[];
  color?: string;
};

export type TimeSeriesLineChartProps = {
  series: Series[];
  width?: number;
  height?: number;
  label: string;
  meassure?: string;

  gapDaysToBreakLine?: number;
  seasonalColoring?: boolean;
  customYThreshold?: number;
};

type HoverState = {
  visible: boolean;
  px: number;
  py: number;
  dataPoints: {
    point: TimeseriesPoint;
    series: { label: string; color?: string };
  }[];
} | null;

const getSeason = (date: Date): "winter" | "spring" | "summer" | "autumn" => {
  const month = date.getUTCMonth() + 1;
  if (month === 12 || month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "autumn";
};

function seasonColor(s: ReturnType<typeof getSeason>) {
  switch (s) {
    case "winter":
      return "rgba(80, 140, 220, 0.10)";
    case "spring":
      return "rgba(70, 200, 120, 0.10)";
    case "summer":
      return "rgba(240, 200, 60, 0.10)";
    case "autumn":
      return "rgba(210, 120, 60, 0.10)";
  }
}

function seasonIntervals(domain: [Date, Date]) {
  const start = new Date(
    Date.UTC(domain[0].getUTCFullYear(), domain[0].getUTCMonth(), 1)
  );
  const end = new Date(
    Date.UTC(domain[1].getUTCFullYear(), domain[1].getUTCMonth() + 1, 1)
  );

  const months = d3.utcMonths(start, end);
  // chunk consecutive months of the same season into bands
  const bands: {
    start: Date;
    end: Date;
    season: ReturnType<typeof getSeason>;
  }[] = [];

  for (let i = 0; i < months.length - 1; i++) {
    const a = months[i];
    const b = months[i + 1];
    const s = getSeason(a);

    const last = bands[bands.length - 1];
    if (!last || last.season !== s) {
      bands.push({ start: a, end: b, season: s });
    } else {
      last.end = b;
    }
  }

  return bands.map((band) => ({
    ...band,
    start: band.start < domain[0] ? domain[0] : band.start,
    end: band.end > domain[1] ? domain[1] : band.end,
  }));
}

const TimeSeriesLineChart: React.FC<TimeSeriesLineChartProps> = ({
  series,
  width = 800,
  height = 400,
  label,
  gapDaysToBreakLine = 60,
  seasonalColoring = true,
  customYThreshold = 0,
  meassure = "",
}) => {
  const margin = { top: 20, right: 30, bottom: 40, left: 70 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const [hover, setHover] = useState<HoverState>(null);

  const allPoints = series.flatMap((s) => s.points);

  const {
    xScale,
    yScale,
    xTicks,
    yTicks,
    formatDate,
    formatY,
    bands,
    bisectDate,
  } = useMemo(() => {
    const formatDate = d3.timeFormat("%Y-%m-%d");
    const formatY = (v: number) => d3.format(",")(v);

    const sorted = [...allPoints].sort((a, b) => a.x.getTime() - b.x.getTime());

    const xMin = d3.min(sorted, (d: TimeseriesPoint) => d.x) ?? new Date();
    const xMax = d3.max(sorted, (d: TimeseriesPoint) => d.x) ?? new Date();

    const xDomain: [Date, Date] = [
      d3.timeMonth.offset(xMin, -3),
      d3.timeMonth.offset(xMax, 3),
    ];

    const yMin = d3.min(sorted, (d: TimeseriesPoint) => d.y) ?? 0;
    const yMax = d3.max(sorted, (d: TimeseriesPoint) => d.y) ?? 0;

    const yDomain =
      customYThreshold === 0
        ? [0, yMax]
        : [yMin - customYThreshold, yMax + customYThreshold];

    const xScale = d3.scaleUtc().domain(xDomain).range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .nice()
      .range([innerHeight, 0]);

    const xTicks = xScale.ticks(6);
    const yTicks = yScale.ticks(6);

    const bands = seasonalColoring ? seasonIntervals(xDomain) : [];
    const bisectDate = d3.bisector<TimeseriesPoint, Date>((d) => d.x).left;

    return {
      xScale,
      yScale,
      xTicks,
      yTicks,
      formatDate,
      formatY,
      bands,
      bisectDate,
    };
  }, [allPoints, innerHeight, innerWidth, seasonalColoring, customYThreshold]);

  const seriesPaths = series.map((s, idx) => {
    const line = d3
      .line<TimeseriesPoint>()
      .defined((d, i, arr) => {
        if (!gapDaysToBreakLine) return true;
        if (i === 0) return true;
        const prev = arr[i - 1];
        return (
          d.x.getTime() - prev.x.getTime() <=
          gapDaysToBreakLine * 24 * 60 * 60 * 1000
        );
      })
      .x((d: TimeseriesPoint) => xScale(d.x))
      .y((d: TimeseriesPoint) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    return {
      line: line(s.points) ?? "",
      color: s.color || d3.schemeCategory10[idx % 10],
      label: s.label,
    };
  });

  const onMove: React.MouseEventHandler<SVGRectElement> = (e) => {
    const rect = (
      e.currentTarget.ownerSVGElement as SVGSVGElement
    ).getBoundingClientRect();
    const mx = e.clientX - rect.left - margin.left;
    const my = e.clientY - rect.top - margin.top;

    if (mx < 0 || mx > innerWidth || my < 0 || my > innerHeight) {
      setHover(null);
      return;
    }

    const date = xScale.invert(mx);

    const dataPoints: {
      point: TimeseriesPoint;
      series: { label: string; color?: string };
    }[] = [];

    series.forEach((s) => {
      const sorted = [...s.points].sort(
        (a, b) => a.x.getTime() - b.x.getTime()
      );
      const i = bisectDate(sorted, date, 1);
      const a = sorted[i - 1];
      const b = sorted[i];
      const candidate = !b
        ? a
        : date.getTime() - a.x.getTime() > b.x.getTime() - date.getTime()
        ? b
        : a;

      dataPoints.push({
        point: candidate,
        series: { label: s.label, color: s.color },
      });
    });

    if (dataPoints.length > 0) {
      setHover({
        visible: true,
        px: xScale(date),
        py: my,
        dataPoints: dataPoints,
      });
    } else {
      setHover(null);
    }
  };

  const onLeave: React.MouseEventHandler<SVGRectElement> = () => setHover(null);

  return (
    <Paper withBorder p="sm" radius="md">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`Line chart showing ${label} over time`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {bands.map((b) => {
            const x0 = xScale(b.start);
            const x1 = xScale(b.end);
            return (
              <rect
                key={`${b.season}-${b.start.toISOString()}`}
                x={x0}
                y={0}
                width={Math.max(0, x1 - x0)}
                height={innerHeight}
                fill={seasonColor(b.season)}
              />
            );
          })}
          <g>
            {yTicks.map((t: number) => (
              <line
                key={`y-grid-${t}`}
                x1={0}
                x2={innerWidth}
                y1={yScale(t)}
                y2={yScale(t)}
                stroke="currentColor"
                opacity={0.1}
              />
            ))}
          </g>

          {seriesPaths.map((s) => (
            <path
              key={s.label}
              d={s.line}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
            />
          ))}

          {series.map((s) => {
            return s.points.map((p, i) => (
              <circle
                key={`${s.label}-point-${i}`}
                cx={xScale(p.x)}
                cy={yScale(p.y)}
                r={2}
                fill={s.color || "currentColor"}
                opacity={0.8}
              />
            ));
          })}

          {hover && (
            <g pointerEvents="none">
              <line
                x1={hover.px}
                x2={hover.px}
                y1={0}
                y2={innerHeight}
                stroke="currentColor"
                opacity={0.25}
              />
              {hover.dataPoints.map((dp, idx) => (
                <g key={idx}>
                  <circle
                    cx={xScale(dp.point.x)}
                    cy={yScale(dp.point.y)}
                    r={4}
                    fill={dp.series.color || "currentColor"}
                    opacity={0.9}
                  />
                </g>
              ))}
              <rect
                x={Math.min(innerWidth - 200, hover.px + 10)}
                y={Math.max(0, hover.py - 34 - 20 * hover.dataPoints.length)}
                width={200}
                height={44 + 20 * hover.dataPoints.length}
                rx={10}
                fill="white"
                opacity={0.92}
              />
              <text
                x={Math.min(innerWidth - 190, hover.px + 18)}
                y={Math.max(14, hover.py - 14 - 20 * hover.dataPoints.length)}
                fontSize={12}
                fill="black"
              >
                {d3.utcFormat("%Y-%m-%d")(hover.dataPoints[0].point.x)}
              </text>
              {hover.dataPoints.map((dp, i) => (
                <text
                  key={i}
                  x={Math.min(innerWidth - 190, hover.px + 18)}
                  y={Math.max(
                    30 + 20 * i,
                    hover.py + 4 - 20 * hover.dataPoints.length + 20 * i
                  )}
                  fontSize={12}
                  fill={dp.series.color}
                >
                  {dp.series.label}: {d3.format(",")(dp.point.y)} {meassure}
                </text>
              ))}
            </g>
          )}

          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          />

          {/* X Axis */}
          <g transform={`translate(0,${innerHeight})`}>
            <line
              x1={0}
              x2={innerWidth}
              y1={0}
              y2={0}
              stroke="currentColor"
              opacity={0.4}
            />
            {xTicks.map((t: Date) => (
              <g key={t.toISOString()} transform={`translate(${xScale(t)},0)`}>
                <line y2={6} stroke="currentColor" opacity={0.6} />
                <text
                  y={20}
                  textAnchor="middle"
                  fontSize={12}
                  fill="currentColor"
                  opacity={0.8}
                >
                  {formatDate(t)}
                </text>
              </g>
            ))}
            <text
              x={innerWidth / 2}
              y={38}
              textAnchor="middle"
              fontSize={12}
              opacity={0.9}
            >
              Acquisition Date
            </text>
          </g>

          {/* Y Axis */}
          <g>
            <line
              x1={0}
              x2={0}
              y1={0}
              y2={innerHeight}
              stroke="currentColor"
              opacity={0.4}
            />
            {yTicks.map((t: number) => (
              <g key={`y-${t}`} transform={`translate(0,${yScale(t)})`}>
                <line x2={-6} stroke="currentColor" opacity={0.6} />
                <text
                  x={-10}
                  dy="0.32em"
                  textAnchor="end"
                  fontSize={12}
                  fill="currentColor"
                  opacity={0.8}
                >
                  {formatY(t)}
                </text>
              </g>
            ))}
            <text
              transform={`translate(${-55},${innerHeight / 2}) rotate(-90)`}
              textAnchor="middle"
              fontSize={12}
              opacity={0.9}
            >
              {label}
            </text>
          </g>
        </g>
      </svg>
    </Paper>
  );
};

export default TimeSeriesLineChart;
