import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText } from "@material-ui/core";
import FolderIcon from '@material-ui/icons/Folder';
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useContext, useState } from "react";
import { auth, firestore, getUserRef, fromMillis } from "../../lib/firebase";
import { getDate, getMonth } from "../../lib/utils";
import AuthCheck from "../AuthCheck";
import Loader from "../Loader";

export default function BirthdayList(props) {
    /*
    Fetches and renders the List of Birthdays associated with the logged in User
    */

    return (
            <>
                {props.children}
                {props.birthdays && <Birthdays sortBy={props.sortBy} birthdays={props.birthdays} setEditId={props.setEditId} />}
            </>
    )
}

function Birthdays(props) {
    const birthdays = props.birthdays

    if (props.sortBy == 'Alphabet') {
        birthdays.sort(sortByFirstName);
    } else {
        birthdays.sort(sortByCountdown);
    }

    return (
        <List dense={true}>
            {birthdays.map(({ id, data }) => (<Birthday key={id} id={id} {...data} setEditId={props.setEditId} />))}
        </List>
    )
}

function sortByCountdown(a,b) {
    const keyA = a.data.daysUntil, keyB = b.data.daysUntil;
    // Compare the 2 numbers and order ascending
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
}

function sortByFirstName(a,b) {
    const textA = a.data.firstname.toUpperCase(), textB = b.data.firstname.toUpperCase();
    // Compare the 2 texts and order ascending
    if (textA < textB) return -1;
    if (textA > textB) return 1;
    return 0;
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}

function parseBirthdate(birthdate) {
    /*
    Parses Date and returns the month and day of month
    */
    const month = getMonth(birthdate);
    const date = getDate(birthdate);
    return { month, date }
}

const monthNames = [null, "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function Birthday(props) {
    /*
    Renders a single Birthday card
    */
    const { month, date } = parseBirthdate(props.birthdate.toDate())

    let age;

    if (props.birthyear) {
        const birthdate_w_year = `${props.birthyear}-${month}-${date}`
        age = getAge(birthdate_w_year) + 1
    }

    return (
        <>
        <ListItem button onClick={() => props.setEditId(props.id)}>
            <ListItemIcon>
                {props.daysUntil}
                <br />
                days
            </ListItemIcon>
            <ListItemText
            primary={`${props.firstname} ${props.lastname}`}
            secondary={`${monthNames[month]} ${date} | Turns ${age}`}
            />
        </ListItem>
        <Divider  component="li" />
        </>
    )
}

/*
 * Gets a users/{uid} document
 * @param  {string} username
 */
export async function ensureUserDataAvailable() {
    const usersRef = firestore.doc(`users/${auth.currentUser.uid}`);
    const { exists } = await usersRef.get();
    if (!exists) {
        usersRef.set({})
    }
    return usersRef;
}
