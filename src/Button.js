import { fontSize1, greenBoxShadow } from "./Style";
import styled from "styled-components";

export const ConfirmButton = styled.div`
  margin: 20px;
  ${fontSize1};
  font-family: Exo 2, san-serif;
  color: #42ff3a;
  padding: 5px;
  &:hover {
    ${greenBoxShadow};
    cursor: pointer;
  }
`;
