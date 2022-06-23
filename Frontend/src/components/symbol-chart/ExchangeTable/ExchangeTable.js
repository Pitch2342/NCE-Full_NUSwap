import { Table } from "@mantine/core";
import React, { Component } from "react";

export class ExchangeTable extends Component {
  componentDidMount() {
    this.props.subscribeToNewOrderBook();
  }
  render() {
    return (
      <Table verticalSpacing='xs' highlightOnHover>
        <thead>
          <tr>
            <th colSpan="2">{this.props.title}</th>
          </tr>
          <tr>
            <th>Amount ({this.props.currencyArray[0]})</th>
            <th>Price ({this.props.currencyArray[1]})</th>
            <th>Total ({this.props.currencyArray[1]})</th>
          </tr>
        </thead>
        <tbody>
          {this.props.arr && this.props.arr.slice(0, 4).map((item, index) => (
            <tr key={index}>
              <td> {Math.round(Number(item[1]) * 1000) / 1000} </td>
              <td style={{ color: this.props.color }}> {item[0]} </td>
              {/* <td>
                {
                  this.props.arr.slice(0, index + 1).map((item) => item[1]).reduce((x, y) => Math.round((Number(x) * Number(y)) * 1000) / 1000, 0)
                }
              </td> */}
              <td>
                {
                  Math.round(Number(item[1])*Number(item[0]) * 1000) / 1000
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>)
  }
}

// export default function ExchangeTable({ currencyArray, title, color, arr }) {
//   return (
//     <Table verticalSpacing='xs' highlightOnHover>
//       <thead>
//         <tr>
//           <th colSpan="2">{title}</th>
//         </tr>
//         <tr>
//           <th>Amount ({currencyArray[0]})</th>
//           <th>Price ({currencyArray[1]})</th>
//           <th>Total ({currencyArray[0]})</th>
//         </tr>
//       </thead>
//       <tbody>
//         {arr && arr.slice(0, 4).map((item, index) => (
//           <tr key={index}>
//             <td> {Math.round(Number(item[1]) * 1000) / 1000} </td>
//             <td style={{ color: color }}> {item[0]} </td>
//             <td>
//               {
//                 arr.slice(0, index + 1).map((item) => item[1]).reduce((x, y) => Math.round((Number(x) + Number(y)) * 1000) / 1000, 0)
//               }
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// }