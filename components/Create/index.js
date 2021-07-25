import { Container, Grid, TextField } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthCheck from "../../components/AuthCheck";
import { auth, firestore, serverTimestamp, fromDate } from "../../lib/firebase";
import DrawerHeading from "../DrawerHeading";
import Form from "../Form";

export default function CreatePage(props) {
  return (
    <main>

        <Container maxWidth="md">
        <AuthCheck>
          <DrawerHeading heading="Add Birthday" />
          <CreateNewBirthday setIsCreate={props.setIsCreate} setValidBirthdays={props.setValidBirthdays} />
        </AuthCheck>
        </Container>
    </main>
  )
}

function CreateNewBirthday({ setIsCreate, setValidBirthdays }) {
    const router = useRouter();

    const [firstname, setFirstname] = useState(''); // Required
    const [lastname, setLastname] = useState("");
    const [birthdate, setBirthdate] = useState('2021-01-01'); // Required
    const [birthyear, setBirthyear] = useState("");
    const [address, setAddress] = useState("");
    const [postal, setPostal] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const isValid = (firstname.length > 0) && birthdate

    const createBirthday = async (e) => {
      e.preventDefault();
      const uid = auth.currentUser.uid;
  
      // Create ref to new birthday
      const ref = firestore.collection('users').doc(uid).collection('birthdays').doc();
  
      // Create Default Data
      const data = {
        firstname,
        lastname,
        birthdate: fromDate(new Date(birthdate)),
        birthyear,
        address,
        postal,
        city,
        country,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
    
      // Commit data to firestore
      await ref.set(data);
  
      // Trigger Toast Message
      toast.success('Birthday created!')
  
      // Refresh Birthdays
      setValidBirthdays(false)

      // Close Create Pop-Up
      setIsCreate(false)
    };
  
    return (
      <Form submitText="Add Birthday" onSubmit={createBirthday} disabled={!isValid} submit={true}> 
        <TextField id="firstname" label="firstname" variant="filled" fullWidth value={firstname} />
        <TextField id="lastname" label="lastname" variant="filled" fullWidth value={lastname} />
        <TextField id="birthdate" label="birthdate" type="date" fullWidth variant="filled" value={birthdate} />
        <TextField id="birthyear" label="birthyear" variant="filled" fullWidth value={birthyear} />
        <TextField id="address" label="address" variant="filled" fullWidth value={address} />
        <TextField id="postal" label="postal" variant="filled" fullWidth value={postal} />
        <TextField id="city" label="city" variant="filled" fullWidth value={city} />
        <TextField id="country" label="country" variant="filled" fullWidth value={country} />
      </Form>
    );
  }