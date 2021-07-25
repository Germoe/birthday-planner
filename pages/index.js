import { loadGetInitialProps } from "next/dist/next-server/lib/utils";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import Head from 'next/head';
import { Typography } from "@material-ui/core";

export default function Home(props) {
  const user = useContext(UserContext);
  
  return (
    <>
      <Head>
        {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script> */}
      </Head>
      {props.children}
    </>
  )
}
