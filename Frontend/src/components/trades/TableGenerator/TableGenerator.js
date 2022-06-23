import { Table } from "@mantine/core";
import React from "react";

export default function TableGenerator({DataObject, title}) {
  return (
    <Table verticalSpacing='xs' highlightOnHover>
      <thead>
        <tr>
          <th colSpan="2">{title}</th>
        </tr>
        <tr key={"header"}>
        {Object.keys(DataObject[0]).map((key) => (
          <th>{key}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {DataObject.map((item) => (
        <tr key={item.id}>
          {Object.values(item).map((val) => (
            <td>{val}</td>
          ))}
        </tr>
          ))}
      </tbody>
    </Table>
    // <div>HI</div>
  );
}