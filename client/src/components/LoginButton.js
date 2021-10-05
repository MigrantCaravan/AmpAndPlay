import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    !isAuthenticated && (
      <Button
        onClick={() => {
          loginWithRedirect();
        }}
      >
        Log-In
      </Button>
    )
  );
};

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 8px;
  padding: 0px;
  width: 75px;
  height: 50px;

  border: 4px solid #4a403a;
  outline: none;
  background-color: #efefef;
  border-radius: 4px;
  /* box-shadow: -6px -8px 10px #2a2a28, -6px -8px 10px #2a2a28,
    -20px 0px 25px #2a2a28, 6px 20px 25px rgba(0, 0, 0, 0.2); */
  transition: 0.16s ease-in-out;
  cursor: pointer;
  &:active {
    box-shadow: none;
    .button__content {
      box-shadow: none;
      .button__text,
      .button__icon {
        transform: translate3d(0px, 0px, 0px);
      }
    }
  }
  &__content {
    position: relative;
    display: grid;

    padding: 20px;
    width: 100%;
    height: 100%;

    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    box-shadow: inset 0px -8px 0px #dddddd, 0px -8px 0px #f4f5f6;
    border-radius: 40px;
    transition: 0.13s ease-in-out;

    z-index: 1;
  }
  &__icon {
    position: relative;
    display: flex;

    transform: translate3d(0px, -4px, 0px);
    grid-column: 4;
    align-self: start;
    justify-self: end;
    width: 32px;
    height: 32px;
    transition: 0.13s ease-in-out;
    svg {
      width: 32px;
      height: 32px;
      fill: #aaaaaa;
    }
  }
  &__text {
    position: relative;

    transform: translate3d(0px, -4px, 0px);
    margin: 0;
    align-self: end;
    grid-column: 1/5;
    grid-row: 2;

    text-align: center;
    font-size: 32px;
    background-color: #888888;
    color: transparent;
    text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.5);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    transition: 0.5s ease-in-out;
  }
`;

export default LoginButton;
