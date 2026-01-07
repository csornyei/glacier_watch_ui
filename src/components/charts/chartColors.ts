export function getChartColor(index: number): string {
  const colors = ["#14248A", "#92140C", "#97CC04", "#FFB800", "#52B788"];

  return colors[index % colors.length];
}
