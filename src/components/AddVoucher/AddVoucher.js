import React, { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { db } from "../../database-config";
import Select from "react-select";
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

function AddVoucher(props) {
  // form states
  const [voucherForm, setVoucherForm] = useState({
      amount: 0,
      date: new Date(),
      remark: "",
      transaction_type: {
        label: "CREDITE/जमा",
        value: "CREDITE/जमा",
      },
      user_id: "",
    }),
    [usersList, setUsersList] = useState([]);

  // collection reference for getting users list
  const UsersCollectionRef = collection(db, "vijay_user");

  // Dialog controlling props
  const { isAddVoucherOpen, handleAddVoucherClose } = props;

  // select transaction type
  const selectOptions = [
    {
      label: "CREDITE/जमा",
      value: "CREDITE/जमा",
    },
    {
      label: "DEBITE/नावे",
      value: "DEBITE/नावे",
    },
  ];

  const getAllUsersData = useCallback(async () => {
    // base array
    const usersArray = [];
    await getDocs(UsersCollectionRef).then((d) => {
      d.docs.map((s) => {
        // adding in base array
        usersArray.push({ ...s.data(), id: s.id });
      });
    });
    // setting users list
    setUsersList(usersArray);
    // setting base option for users list
    onChangeInput(
      "user_id",
      usersArray[0] && {
        label: `${usersArray[0].last_name} ${usersArray[0].first_name} ${usersArray[0].middle_name}`,
        value: `${usersArray[0].user_id}`,
      }
    );
  }, []);

  useEffect(() => {
    // fetch the users list on mount
    getAllUsersData();
  }, []);

  const onChangeInput = (key, value) => {
    console.log("changing input", { key, value });
    setVoucherForm((prevState) => ({ ...prevState, [key]: value }));
  };

  const onFormSubmit = async () => {
    // refine selects and make proper datas
    const dataToPut = {
      ...voucherForm,
      transaction_type: voucherForm.transaction_type?.value,
      user_id: voucherForm.user_id?.value,
    };
    console.log("formdata", voucherForm);
    window.alert(JSON.stringify(dataToPut));
    // create the record
    const docRef = await addDoc(collection(db, "vijay_transaction"), dataToPut);
    // update the record with unique id
    await updateDoc(docRef, { transaction_id: docRef.id });
    // user doc from userslist
    let userData = usersList.filter(
      (user) => user.user_id == dataToPut.user_id
    )[0];
    // current amount in db
    let baseAmount = Number(userData?.closing_balance);
    // check transaction type
    if (dataToPut.transaction_type == "CREDITE/जमा") {
      // if it is credit
      baseAmount += Number(dataToPut.amount);
    } else {
      // if it is debit
      baseAmount -= Number(dataToPut.amount);
    }
    console.log("baseamount", baseAmount);
    // get the doc for selected user from db
    const userDoc = doc(db, "vijay_user", userData?.id);
    // update user balance
    await updateDoc(userDoc, { closing_balance: baseAmount.toString() });
  };

  return (
    <Dialog
      open={isAddVoucherOpen}
      onClose={handleAddVoucherClose}
      PaperProps={{
        component: "form",
        onSubmit: async (event) => {
          event.preventDefault();
          // submit the form
          await onFormSubmit();
          // close the dialog
          handleAddVoucherClose();
        },
      }}
    >
      <DialogTitle fontWeight={700}>Add Voucher</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add the voucher details here so that you can track it later We will
          send updates occasionally.
        </DialogContentText>
        <div className="center-align" style={{ margin: "8px" }}>
          <table>
            <tr>
              <td>
                <label
                  for="typeFormControl"
                  className="label mr-8 margin-top-8"
                >
                  Transaction type
                </label>
              </td>
              <td>
                <Select
                  defaultValue={voucherForm.transaction_type}
                  value={voucherForm.transaction_type}
                  onChange={(selectedOption) =>
                    onChangeInput("transaction_type", selectedOption)
                  }
                  options={selectOptions}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label
                  for="typeFormControl"
                  className="label mr-8 margin-top-4"
                >
                  User
                </label>
              </td>
              <td>
                <Select
                  className="margin-top-4"
                  defaultValue={voucherForm.user_id}
                  value={voucherForm.user_id}
                  onChange={(selectedOption) =>
                    onChangeInput("user_id", selectedOption)
                  }
                  maxMenuHeight={120}
                  options={usersList.map((opt) => ({
                    label: `${opt.last_name} ${opt.first_name} ${opt.middle_name}`,
                    value: `${opt.user_id}`,
                  }))}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label
                  for="courseFormControl"
                  className="label mr-8 margin-top-4"
                >
                  Amount
                </label>
              </td>
              <td>
                <input
                  type="number"
                  class="form-control margin-top-4"
                  onChange={(event) =>
                    onChangeInput("amount", event.target.value)
                  }
                  value={voucherForm.amount}
                  id="courseFormControl"
                  placeholder="Amount"
                />
              </td>
            </tr>
            <tr>
              <td>
                <label
                  for="exampleFormControlInput1"
                  className="label mr-8 margin-top-4"
                >
                  Remark
                </label>
              </td>
              <td>
                <input
                  type="text"
                  className="form-control margin-top-4"
                  onChange={(event) =>
                    onChangeInput("remark", event.target.value)
                  }
                  value={voucherForm.remark}
                  id="exampleFormControlInput1"
                  placeholder="Remark"
                />
              </td>
            </tr>
            <tr>
              <td>
                <label
                  for="startDateNameFormControl"
                  className="label mr-8 margin-top-4"
                >
                  Date
                </label>
              </td>
              <td>
                <DatePicker
                  className="margin-top-4 dpicker-border"
                  wrapperClassName="dpicker-wrapper"
                  selected={voucherForm.date}
                  // showTimeSelect={true}
                  maxDate={new Date()}
                  dateFormat={"dd/MM/YYYY"}
                  onChange={(date) => onChangeInput("date", date)}
                />
              </td>
            </tr>
          </table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddVoucherClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddVoucher;
