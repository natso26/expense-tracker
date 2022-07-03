import styled from "styled-components";

// https://dev.to/dcodeyt/creating-beautiful-html-tables-with-css-428l

export const Table = {
    Table: styled.table`
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.9em;
      font-family: sans-serif;
      width: 100%;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);

      th,
      td {
        padding: 12px 15px;
      }

      thead tr {
        background-color: #009879;
        color: #ffffff;
        text-align: left;
      }

      tbody tr {
        border-bottom: 1px solid #dddddd;
      }

      tbody tr:hover,
      tbody tr:focus,
      tbody tr:active {
        font-weight: bold;
        color: #009879;
      }

      tbody tr:nth-of-type(even) {
        background-color: #f3f3f3;
      }

      tbody tr:last-of-type {
        border-bottom: 2px solid #009879;
      }
    `,
    Number: {
        Header: styled.th`
          text-align: right;
        `,
        Data: styled.td`
          text-align: right;
        `,
    },
    Date: {
        Row: styled.tr`
          font-weight: bold;
        `,
    },
}