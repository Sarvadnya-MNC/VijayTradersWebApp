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
import * as yup from "yup";

function AddUser(props) {
  // form states
  const [userDetailsForm, setUserDetailsForm] = useState({
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      address: "",
      mobile: "",
      updated_date: new Date(),
      token: "",
      password: "123456",
      role: "Customer",
      closing_balance: 0,
    }),
    [error, setError] = useState("");

  // schema object for validations
  const schema = yup.object().shape({
    // confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    first_name: yup.string().required("First Name cannot be empty"),
    middle_name: yup.string().required("Middle Name cannot be empty"),
    last_name: yup.string().required("Last Name cannot be empty"),
    email: yup
      .string()
      .required("Email cannot be empty")
      .email("Email is not vaid email"),
    address: yup.string().required("Address cannot be empty"),
    mobile: yup
      .string()
      .required("Please enter the mobile number")
      .length(10, "Mobile number must be containing 10 digits"),
  });

  // collection reference for getting users list
  const UsersCollectionRef = collection(db, "vijay_user");

  // dialog controlling props
  const { isAddUserOpen, handleAddUserClose } = props;

  const onChangeInput = (key, value) => {
    setUserDetailsForm((prevState) => ({ ...prevState, [key]: value }));
  };

  const onFormSubmit = async () => {
    // create the record
    const docRef = await addDoc(UsersCollectionRef, userDetailsForm);
    // update the record with unique id
    await updateDoc(docRef, { user_id: docRef.id });
  };

  return (
    <Dialog
      open={isAddUserOpen}
      onClose={handleAddUserClose}
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
              // close the form
              handleAddUserClose();
            })
            .catch((err) => {
              // set the error state
              setError(err?.errors[0]);
            });
        },
      }}
    >
      <DialogTitle fontWeight={700}>Add User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add the user details here so that you can track it later We will send
          updates occasionally.
        </DialogContentText>
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
                  First Name
                </label>
              </td>
              <td>
                <input
                  type="text"
                  class="form-control margin-top-4"
                  onChange={(event) =>
                    onChangeInput("first_name", event.target.value)
                  }
                  value={userDetailsForm.first_name}
                  placeholder="First Name"
                />
              </td>
            </tr>
            <tr>
              <td>
                <label
                  for="typeFormControl"
                  className="label mr-8 margin-top-4"
                >
                  Middle Name
                </label>
              </td>
              <td>
                <input
                  type="text"
                  class="form-control margin-top-4"
                  onChange={(event) =>
                    onChangeInput("middle_name", event.target.value)
                  }
                  value={userDetailsForm.middle_name}
                  placeholder="Middle Name"
                />
              </td>
            </tr>
            <tr>
              <td>
                <label
                  for="courseFormControl"
                  className="label mr-8 margin-top-4"
                >
                  Last Name
                </label>
              </td>
              <td>
                <input
                  type="text"
                  class="form-control margin-top-4"
                  onChange={(event) =>
                    onChangeInput("last_name", event.target.value)
                  }
                  value={userDetailsForm.last_name}
                  placeholder="Last Name"
                />
              </td>
            </tr>
            <tr>
              <td>
                <label
                  for="exampleFormControlInput1"
                  className="label mr-8 margin-top-4"
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
                  for="startDateNameFormControl"
                  className="label mr-8 margin-top-4"
                >
                  Mobile Number
                </label>
              </td>
              <td>
                <input
                  type="text"
                  class="form-control margin-top-4"
                  onChange={(event) =>
                    onChangeInput("mobile", event.target.value)
                  }
                  value={userDetailsForm.mobile}
                  placeholder="Mobile Number"
                />
              </td>
            </tr>
            <tr>
              <td>
                <label className="label mr-8 margin-top-4">Address</label>
              </td>
              <td>
                <input
                  type="text"
                  class="form-control margin-top-4"
                  onChange={(event) =>
                    onChangeInput("address", event.target.value)
                  }
                  value={userDetailsForm.address}
                  placeholder="Address"
                />
              </td>
            </tr>
          </table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddUserClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddUser;
