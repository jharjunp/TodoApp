import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from "recharts";

export default function Chart({ dataset }) {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  const datasetDate = new Date(dataset[0].timeStamp);
  const isToday = now.toDateString() === datasetDate.toDateString();

  const dataClean = dataset.map(x => {
    const date = new Date(new Date(x.timeStamp).toLocaleString("en-US", { timeZone: "Europe/Helsinki" }));
    const hour = date.getHours() + date.getMinutes() / 60;
    return {
      ...x,
      hour: hour
    };
  });

  const lastDataPoint = dataClean[dataClean.length - 1];
  const extendedData = [...dataClean, { ...lastDataPoint, hour: 24 }];

  const customTicks = Array.from({ length: 25 }, (v, i) => i);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={extendedData}
        margin={{
          top: 50,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" type='number' ticks={customTicks} domain={[0, 24]} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="stepAfter" dataKey="price" stroke="#8884d8" dot={false} />
        {isToday && <ReferenceLine x={currentHour} stroke="red" label={{ value: 'Current Hour', position: 'insideTop', dy: -20 }} />}
      </LineChart>
    </ResponsiveContainer>
  );
}
