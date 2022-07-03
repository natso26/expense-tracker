import styled from "styled-components";

// https://stackoverflow.com/questions/9686538/align-labels-in-form-next-to-input

export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 5px;

  label {
    text-align: right;
  }

  label:after {
    content: ':';
  }
`