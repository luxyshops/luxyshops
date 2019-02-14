import React from 'react';
import styled from "styled-components";
import {TouchableOpacity} from "react-native";

export const ButtonsWrapper = styled.View`
  flex: 1;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
`;

export const StyledButton = styled(TouchableOpacity)`
  background-color: ${({blue}) => blue ? '#0079FF' : '#61CA93'};
  border-radius: 50px;
  width: 100%;
  box-shadow: 0 ${({blue}) => blue ? '5' : '10'}px 10px ${({blue}) => blue ? 'rgba(0, 121, 255, 0.6)' : 'rgba(97, 202, 147, 0.6)'};
`;
