import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
  export default function Chart( {dataset} ) {
    const dataClean = structuredClone(dataset).map(x => {
      x.timeStamp = new Date(x.timeStamp).getHours()
      return x
    })

     return (
      <ResponsiveContainer width="100%" height={400} >
        <BarChart
          data={dataClean}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey = "timeStamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="price" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }