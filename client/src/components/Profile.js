import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import JSONPretty from "react-json-pretty";
import styled from "styled-components";

export default function Profile() {
  const { user, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <div>
        <Img src={user.picture} alt="profile-pic"></Img>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {/* <JSONPretty data={user}></JSONPretty> */}
        {/* {JSON.stringify(user, null, 2)} */}
      </div>
    )
  );
}

const Img = styled.img`
  border-radius: 50%;
  width: 80px;
`;
