import React from "react";
import LoginButton from "./LoginButton";
import Logoutbutton from "./Logoutbutton";
import Profile from "./Profile";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

export default function Header() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Wrapper>
      <Profile></Profile>
      <ButtonWraper>
        <LoginButton></LoginButton>
        <Logoutbutton></Logoutbutton>
      </ButtonWraper>
    </Wrapper>
  );
}

const ButtonWraper = styled.div`
  /* display: flex; */
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 150px;
  width: 100vw;
  background-color: #ffc069;
`;
