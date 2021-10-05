import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
// import JSONPretty from "react-json-pretty";
import styled from "styled-components";

export default function Profile() {
  const { user, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <Wrapper>
        <Img src={user.picture} alt="profile-pic"></Img>
        <UserInfo>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </UserInfo>
        {/* <JSONPretty data={user}></JSONPretty> */}
        {/* {JSON.stringify(user, null, 2)} */}
      </Wrapper>
    )
  );
}

const UserInfo = styled.div`
  /* display: flex; */
  padding-left: 35px;
`;

const Wrapper = styled.div`
  display: flex;
  padding-top: 10px;
`;

const Img = styled.img`
  border-radius: 50%;
  width: 80px;
  height: 80px;
`;
