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
      <LoginButton></LoginButton>
      <Logoutbutton></Logoutbutton>
      <Profile></Profile>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 200px;
  background-color: aquamarine;
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
`;
