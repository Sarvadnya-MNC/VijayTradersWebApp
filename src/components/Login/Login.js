import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { db } from "../../database-config";
import Select from "react-select";
import Alert from "@mui/material/Alert";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "@firebase/firestore";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import {  signInWithEmailAndPassword  } from 'firebase/auth';
import { auth } from "../../database-config";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const Login = (props) =>{
    const [userDetailsForm, setUserDetailsForm] = useState({
        email: "",
        password:''
      }),
      [error, setError] = useState("");

    const navigate = useNavigate()
  
    // schema object for validations
    const schema = yup.object().shape({
        password: yup.string().required("Password cannot be empty"),
      email: yup
        .string()
        .required("Email cannot be empty")
        .email("Email is not vaid email")
    });
  
    // collection reference for getting users list
    const UsersCollectionRef = collection(db, "vijay_user");
  
    // dialog controlling props
    const { isAddUserOpen, handleAddUserClose } = props;
  
    const onChangeInput = (key, value) => {
      setUserDetailsForm((prevState) => ({ ...prevState, [key]: value }));
    };
  
    const onFormSubmit = async () => {
      // create the user
      await signInWithEmailAndPassword(auth, userDetailsForm.email, userDetailsForm.password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            console.log('error',error)
            setError('Invalid credentials')
        });
  
  };
  
    return (
      <Dialog
        open={true}
        onClose={()=>{}}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            // validate the form
            schema
              .validate(userDetailsForm)
              .then(async (valid) => {
                // add user
                await onFormSubmit();
              })
              .catch((err) => {
                console.log('out err',err)
                // set the error state
                setError(err?.errors[0]);
              });
          },
        }}
      >
        <DialogTitle fontWeight={700}>
            <span className="center-align">Vijay Traders</span></DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Add the user details here so that you can track it later We will send
            updates occasionally.
          </DialogContentText> */}
          <div className="center-align" style={{ margin: "8px" }}>
            <table>
              {error && (
                <tr>
                  <td colSpan={2}>
                    <Alert severity="error">{error}</Alert>
                  </td>
                </tr>
              )}
              <tr>
                <td>
                  <label
                    for="typeFormControl"
                    className="label mr-8 margin-top-8"
                  >
                    Email
                  </label>
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control margin-top-4"
                    onChange={(event) =>
                      onChangeInput("email", event.target.value)
                    }
                    value={userDetailsForm.email}
                    placeholder="Email"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label
                    for="typeFormControl"
                    className="label mr-8 margin-top-4"
                  >
                    Password
                  </label>
                </td>
                <td>
                  <input
                    type="password"
                    class="form-control margin-top-4"
                    onChange={(event) =>
                      onChangeInput("password", event.target.value)
                    }
                    value={userDetailsForm.password}
                    placeholder="Password"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                    <div className="center-align margin-top-8">
                <Button variant="contained" type="submit">Login</Button>
                </div>
                </td>
              </tr>
            </table>
          </div>
        </DialogContent>
      </Dialog>);
}

export default Login;