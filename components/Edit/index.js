import { useRouter } from "next/dist/client/router";
import { auth, firestore, fromDate, serverTimestamp } from "../../lib/firebase";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import AuthCheck from "../../components/AuthCheck";
import toast from "react-hot-toast";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography } from '@material-ui/core';
import { PlayArrowSharp } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import editStyles from "./Edit.module.css";
import { useState } from "react";
import DrawerHeading from "../DrawerHeading";
import Form from "../Form";

export default function EditPage(props) {
  return (
    <main>

        <Container maxWidth="md">
        <AuthCheck>
            <DrawerHeading heading="Edit Birthday" />
            <EditBirthday id={props.id} setEditId={props.setEditId} setValidBirthdays={props.setValidBirthdays} />
        </AuthCheck>
        </Container>
    </main>
  )
}

function EditBirthday(props) {
    const birthdayRef = firestore.collection('users').doc(auth.currentUser.uid).collection('birthdays').doc(props.id);
    const [birthday] = useDocumentDataOnce(birthdayRef);
    const defaultValues = {
        ...birthday,
        birthdate: birthday?DatetoString(birthday.birthdate.toDate()):null
    }
  
    return (
        <>
        {birthday ? <BirthdayForm defaultValues={defaultValues} birthdayRef={birthdayRef} setEditId={props.setEditId} setValidBirthdays={props.setValidBirthdays} />:
          <DummyBirthdayForm />}
        </>
    );
  }

function dummyBirthday() {
  return {
    address: "",
    birthdate: "2020-01-01",
    birthyear: "",
    city: "",
    country: "",
    createdAt: {
      nanoseconds: 473000000,
      seconds: 1625954704,
    },
    firstname: "",
    lastname: "",
    postal: "",
    updatedAt: {
      nanoseconds: 21000000,
      seconds: 1626294267,
    },
  }
}

function DummyBirthdayForm(props) {
  const router = useRouter();
  const defaultValues = dummyBirthday();
  const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: 'onChange' });


  // Implement Client-Side Validation (only for UX no use as security implementation)
  const { isValid, isDirty } = formState;

  const updateBirthday = async ({ firstname, lastname, birthdate, birthyear, address, postal, city, country }) => {
      await birthdayRef.update({
          firstname,
          lastname,
          birthdate: fromDate(new Date(birthdate)),
          birthyear,
          address,
          postal,
          city,
          country,
          updatedAt: serverTimestamp(),
      });
  
      reset({ firstname, lastname, birthdate, birthyear, address, postal, city, country });
  
      toast.success('Birthday updated!')

      setValidBirthdays(false);

      setEditId('')
    }

    return (
      <Form submitText="Save Changes" 
            onSubmit={handleSubmit(updateBirthday) /* updateBirthday function has automatically access to registered field values */}
            disabled={!isDirty || !isValid}>
          <TextField id="firstname" label="firstname" variant="filled" fullWidth defaultValue={defaultValues.firstname}  inputProps={{...register('firstname',{ required: true })}} />
          <TextField id="lastname" label="lastname" variant="filled" fullWidth defaultValue={defaultValues.lastname}  inputProps={{...register('lastname')}} />
          <TextField id="birthdate" label="birthdate" type="date" fullWidth variant="filled" defaultValue={defaultValues.birthdate} inputProps={{...register('birthdate',{ required: true })}} />
          <TextField id="birthyear" label="birthyear" variant="filled" fullWidth defaultValue={defaultValues.birthyear}  inputProps={{...register('birthyear')}} />
          <TextField id="address" label="address" variant="filled" fullWidth defaultValue={defaultValues.address}  inputProps={{...register('address')}} />
          <TextField id="postal" label="postal" variant="filled" fullWidth defaultValue={defaultValues.postal}  inputProps={{...register('postal')}} />
          <TextField id="city" label="city" variant="filled" fullWidth defaultValue={defaultValues.city}  inputProps={{...register('city')}} />
          <TextField id="country" label="country" variant="filled" fullWidth defaultValue={defaultValues.country}  inputProps={{...register('country')}} />
      </Form>
    );
  }

function BirthdayForm({ defaultValues, birthdayRef, setEditId, setValidBirthdays }) {
    const router = useRouter();
    const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: 'onChange' });

    // Implement Client-Side Validation (only for UX no use as security implementation)
    const { isValid, isDirty } = formState;

    const updateBirthday = async ({ firstname, lastname, birthdate, birthyear, address, postal, city, country }) => {
        await birthdayRef.update({
            firstname,
            lastname,
            birthdate: fromDate(new Date(birthdate)),
            birthyear,
            address,
            postal,
            city,
            country,
            updatedAt: serverTimestamp(),
        });
    
        reset({ firstname, lastname, birthdate, birthyear, address, postal, city, country });
    
        toast.success('Birthday updated!')

        setValidBirthdays(false);

        setEditId('')
      }
      return (
        <>
        <Form submitText="Save Changes" 
              onSubmit={handleSubmit(updateBirthday) /* updateBirthday function has automatically access to registered field values */}
              submit={true}
              disabled={!isDirty || !isValid}>
            <TextField id="firstname" label="firstname" variant="filled" fullWidth defaultValue={defaultValues.firstname}  inputProps={{...register('firstname',{ required: true })}} />
            <TextField id="lastname" label="lastname" variant="filled" fullWidth defaultValue={defaultValues.lastname}  inputProps={{...register('lastname')}} />
            <TextField id="birthdate" label="birthdate" type="date" fullWidth variant="filled" defaultValue={defaultValues.birthdate} inputProps={{...register('birthdate',{ required: true })}} />
            <TextField id="birthyear" label="birthyear" variant="filled" fullWidth defaultValue={defaultValues.birthyear}  inputProps={{...register('birthyear')}} />
            <TextField id="address" label="address" variant="filled" fullWidth defaultValue={defaultValues.address}  inputProps={{...register('address')}} />
            <TextField id="postal" label="postal" variant="filled" fullWidth defaultValue={defaultValues.postal}  inputProps={{...register('postal')}} />
            <TextField id="city" label="city" variant="filled" fullWidth defaultValue={defaultValues.city}  inputProps={{...register('city')}} />
            <TextField id="country" label="country" variant="filled" fullWidth defaultValue={defaultValues.country}  inputProps={{...register('country')}} />
        </Form>

        <Grid item xs={12} className={editStyles.delete}>
          <DeleteBirthday id="delete" birthdayRef={birthdayRef} name={defaultValues.firstname} setEditId={setEditId} setValidBirthdays={setValidBirthdays} />
        </Grid>
        </>
      );
    }

function AskConfirm(props) {
  const handleConfirm = () => {
    props.onConfirm();
    props.onClose();
  }
  return (
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.question}</DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-start">
            <Grid item xs={12} sm={6} md={6}>
              <Button id="delete" onClick={handleConfirm} color="secondary" fullWidth>
                Delete
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Button id="back" onClick={props.onClose} variant="contained" color="primary" autoFocus fullWidth>
                Back
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
  )
}

function DeleteBirthday({ birthdayRef, setEditId, setValidBirthdays, name }) {
    const deleteBirthday = async () => {
        await birthdayRef.delete();

        toast.success("Birthday deleted.");

        setValidBirthdays(false);

        setEditId('');
    };

    const [askConfirm, setAskConfirm] = useState(false)
    return (
        <>
            <Button color="secondary" size="large" variant="outlined" fullWidth onClick={() => setAskConfirm(true)} startIcon={<DeleteIcon />}>
              Delete
            </Button>
            <AskConfirm open={askConfirm} question={`Are you you want to delete ${name}'s Birthday?`} onConfirm={() => deleteBirthday()} onClose={() => setAskConfirm(false)}>
              
            </AskConfirm>
        </>
    )

}

function DatetoString(dt) {
    var mm = dt.getMonth() + 1; // getMonth() is zero-based
    var dd = dt.getDate();

    return [dt.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
        ].join('-');
};