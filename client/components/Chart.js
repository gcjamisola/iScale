import * as React from "react";
import { Card, Switch, DatePicker } from "antd";
import { getOptins, getRecipients } from "../api/reports";
import styled from "styled-components";

import { Line } from "react-chartjs-2";

const { RangePicker } = DatePicker;
require("antd/dist/antd.less");

export default class Chart extends React.Component {
  state = {
    chartData: {
      labels: [],
      datasets: [
        {
          label: "Opt-ins",
          data: [],
          lineTension: 0,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          borderWidth: 1,
          hidden: false
        },
        {
          label: "Recipients",
          data: [],
          lineTension: 0,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          borderWidth: 1,
          hidden: false
        }
      ]
    },
    isUpdated: false
  };

  handleOnChange = async (date, dateString) => {
    let chartData = this.state.chartData;

    const query = {
      params: { from: dateString[0], to: dateString[1] }
    };

    await Promise.all([getOptins(query), getRecipients(query)]).then(
      responses => {
        responses[0].data.forEach(item => {
          chartData.labels.push(item.date);
          chartData.datasets[0].data.push(item.count);
        });
        responses[1].data.forEach(item => {
          chartData.datasets[1].data.push(item.count);
        });

        this.setState({ chartData, isUpdated: true });
      }
    );
  };

  toggleOptins = checked => {
    let chartData = this.state.chartData;

    chartData.datasets[0].hidden = !checked;

    this.setState({
      chartData
    });
  };

  toggleRecipients = checked => {
    let chartData = this.state.chartData;

    chartData.datasets[1].hidden = !checked;

    this.setState({
      chartData
    });
  };

  render() {
    const { chartData, isUpdated } = this.state;
    return (
      <div>
        <Card>
          <__Row>
            <span>Date Range:</span>
            <div>
              <RangePicker onChange={this.handleOnChange} />
            </div>
          </__Row>
          <__Row>
            <span>Show optins: </span>
            <div>
              <Switch size="small" defaultChecked onClick={this.toggleOptins} />
            </div>
          </__Row>
          <__Row>
            <span>Show recipients: </span>
            <div>
              <Switch
                size="small"
                defaultChecked
                onClick={this.toggleRecipients}
              />
            </div>
          </__Row>
        </Card>
        <br />
        <Card>
          {!!isUpdated && (
            <Line
              data={chartData}
              width="600"
              height="150"
              redraw
              options={{
                scales: {
                  xAxes: [
                    {
                      display: true,
                      ticks: {
                        display: true
                      }
                    }
                  ],
                  yAxes: [
                    {
                      display: false
                    }
                  ]
                }
              }}
            />
          )}
          {!isUpdated && "Please select a range"}
        </Card>
      </div>
    );
  }
}

const __Row = styled.div`
  display: grid;
  grid-template: 1fr / 10% 20%;
  margin-bottom: 5px;
  align-items: center;
`;
